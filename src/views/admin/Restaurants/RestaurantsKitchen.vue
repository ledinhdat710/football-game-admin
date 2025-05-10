<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EIcon from "@/components/Elements/EIcon.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { kitchenService } from "@/services/kitchen.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormKitchen from "@/views/admin/Restaurants/ModalFormKitchen.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Swal from "sweetalert2";
import { computed, onMounted, reactive, ref } from "vue";
import {
  Dataset,
  DatasetInfo,
  DatasetItem,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import { useRoute, useRouter } from "vue-router";

let toast = Swal.mixin({
  buttonsStyling: false,
  target: "#page-container",
  customClass: {
    confirmButton: "btn btn-success m-1",
    cancelButton: "btn btn-danger m-1",
    input: "form-control",
  },
});
const store = useTemplateStore();
const { setNotify } = useNotify();
const router = useRouter();
const route = useRoute();
const id = route.params?.id;
let state = reactive({
  kitchen_id: null,
  use_pin: 0,
  pin_code: "",
  isUsePin: false,
  language: "",
  receive_sms: "",
  complete_sms: "",
  printer_id: "",
});
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
});

const rules = computed(() => {
  return {
    language: {
      required,
    },
    printer_id: {
      required,
    },
  };
});

let vformKitchen$ = useVuelidate(rules, state);

// Helper variables
const cols = reactive([
  {
    name: "ID",
    field: "id",
    sort: "",
  },
  {
    name: "Use Pin",
    field: "Use Pin",
    sort: "",
  },
  {
    name: "Pin Code",
    field: "Pin Code",
    sort: "",
  },
  {
    name: "Language",
    field: "Language",
    sort: "",
  },
  {
    name: "Printer ID",
    field: "Printer ID",
    sort: "",
  },
]);

const listKitchens = ref([]);
const idModal = ref(null);
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await kitchenService.getList({
      store_id: id,
      limit: -1,
    });
    if (!response?.error) {
      listKitchens.value = response.data?.data || [];
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const handleNavigate = (slug, id) => {
  const env = import.meta.env.VITE_DOMAIN_KITCHEN;
  window.open(`${env}/${id}`, "_blank");
};

const handleModalForm = async () => {
  idModal.value = undefined;
  state.pin_code = "";
  state.use_pin = 0;
  state.isUsePin = false;
  state.language = "";
  state.receive_sms = "";
  state.complete_sms = "";
  state.printer_id = "";
  vformKitchen$.value.$reset();
  store.pageLoader({ mode: "on" });
  store.pageLoader({ mode: "off" });
};
const handleModalFormUpdate = async (id) => {
  idModal.value = id;
  store.pageLoader({ mode: "on" });
  await apiGetPrinter(id);
  store.pageLoader({ mode: "off" });
};

const apiGetPrinter = async (id) => {
  const response = await kitchenService.get(id);
  state.pin_code = response.data.pin_code;
  state.use_pin = response.data.use_pin ? 1 : 0;
  state.isUsePin = response.data.use_pin ? true : false;
  state.language = response.data.language;
  state.receive_sms = response.data.receive_sms;
  state.complete_sms = response.data.complete_sms;
  state.printer_id =
    response.data.printer_id === null ? "no_printer" : response.data.printer_id;
  vformKitchen$.value.$reset();
};

onMounted(async () => {
  await onFetchList();

  // Remove labels from
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });

  // Replace select classes
  let selectLength = document.querySelector("#datasetLength select");

  if (selectLength) {
    selectLength.classList = "";
    selectLength.classList.add("form-select");
    selectLength.style.width = "80px";
  }
});

const onOpenDeleteConfirm = (id) => {
  toast
    .fire({
      title: "Are you sure?",
      text: "You will not be able to recover this kitchen!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return kitchenService.delete(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Kitchen has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Kitchen is safe", "error");
      }
    });
};

async function onSubmitKitchen() {
  if (idModal.value) {
    await onSubmitUpdateKitchen();
  } else {
    await onSubmitCreateKitchen();
  }
}
async function confirmNew(val) {
  await onSubmitCreateKitchen(val);
}

async function onSubmitCreateKitchen(val) {
  try {
    const result = await vformKitchen$.value.$validate();
    if (!result) return;
    if (state.use_pin === 1 && state.pin_code.length < 4) {
      return;
    }
    let payload = {};
    if (state.use_pin === 1) {
      payload = {
        pin_code: state.pin_code,
        use_pin: state.use_pin,
        store_id: id,
        language: state.language,
        receive_sms: state.receive_sms,
        complete_sms: state.complete_sms,
        printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
      };
    } else {
      payload = {
        use_pin: state.use_pin,
        store_id: id,
        language: state.language,
        receive_sms: state.receive_sms,
        complete_sms: state.complete_sms,
        printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
      };
    }
    const response = await kitchenService.create(payload);
    if (!response?.error) {
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      (state.pin_code = ""),
        (state.use_pin = 0),
        (state.isUsePin = false),
        (state.language = ""),
        (state.receive_sms = ""),
        (state.complete_sms = ""),
        (state.printer_id = "");
      vformKitchen$.value.$reset();
      return setNotify({
        title: "Success",
        message: "Create success",
        type: "success",
      });
    }
  } catch (e) {
    return setNotify({
      title: "Error",
      message: e?.message,
    });
  }
}

async function onSubmitUpdateKitchen() {
  try {
    const result = await vformKitchen$.value.$validate();
    if (!result) return;
    if (state.use_pin === 1 && state.pin_code.length < 4) {
      return;
    }
    let payload = {
      use_pin: state.use_pin,
      store_id: id,
      language: state.language,
      receive_sms: state.receive_sms,
      complete_sms: state.complete_sms,
      printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
    };
    if (state.pin_code) {
      payload.pin_code = state.pin_code;
    }
    const response = await kitchenService.update(idModal.value, payload);
    if (!response?.error) {
      onFetchList();
      refBtn.value.click();
      return setNotify({
        title: "Success",
        message: "Update success",
        type: "success",
      });
    }
  } catch (e) {
    return setNotify({
      title: "Error",
      message: e?.message,
    });
  }
}

const onCloseKitchen = () => {
  vformKitchen$.value.$reset();
};

const navigateRestaurent = () => {
  router.push(`/admin/restaurants`);
};
</script>

<template>
  <BasePageHeading
    title="Kitchen Detail"
    subtitle="Custom functionality to further enrich your tables."
    :go-back="true"
  >
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2">
          <EButton
            :ref="refButton"
            type="info"
            size="sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-kitchen"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New kitchen</EButton
          >
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a
                class="link-fx"
                @click="navigateRestaurent"
                href="javascript:void(0)"
                >Store</a
              >
            </li>
            <li class="breadcrumb-item" aria-current="page">List Kitchen</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Kitchens">
      <template #options>
        <e-icon
          @click="() => router.back()"
          name="arrow-left"
          role="button"
          class="icon_arrow_left"
        />
      </template>
      <Dataset
        v-slot="{ ds }"
        :ds-data="listKitchens"
        :ds-search-in="['id', 'pin_code']"
      >
        <div v-show="listKitchens?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listKitchens?.length">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th v-for="th in cols" :key="th.field">
                        {{ th.name }}
                      </th>
                      <th class="text-end" scope="col">Action</th>
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row }">
                      <tr>
                        <td style="min-width: 50px">{{ row?.id }}</td>
                        <td style="min-width: 100px">
                          {{ row?.use_pin ? "Yes" : "No" }}
                        </td>
                        <td style="min-width: 100px">{{ row?.pin_code }}</td>
                        <td style="min-width: 50px">{{ row?.language }}</td>
                        <td style="min-width: 50px">{{ row?.printer_id }}</td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              @click="
                                () => handleNavigate(row?.store_id, row?.uuid)
                              "
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                            >
                              <i class="fa fa-fw fa-link"></i>
                            </button>
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-kitchen"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalFormUpdate(row?.uuid)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onOpenDeleteConfirm(row.uuid)"
                            >
                              <i class="fa fa-fw fa-times"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </DatasetItem>
                </table>
              </div>
            </div>
          </div>
          <div
            class="d-flex flex-md-row flex-column justify-content-between align-items-center"
          >
            <DatasetInfo class="py-3 fs-sm" />
            <DatasetPager class="flex-wrap py-3 fs-sm" />
          </div>
        </div>
        <EListEmpty v-if="!listKitchens?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitKitchen">
    <EModal
      id="modal-kitchen"
      :title="idModal ? 'Update kitchen' : 'Add new kitchen'"
      :idModal="idModal"
      size="modal-xl"
      ok-text="Confirm"
      ok-text-add="Confirm & New"
      ok-type="submit"
      :close-on-submit="false"
      @confirm="() => onSubmitKitchen()"
      @confirmNew="(val) => confirmNew(val)"
      @closeModal="() => onCloseKitchen()"
    >
      <template v-slot:childrenComponent>
        <ModalFormKitchen
          :id="idModal"
          :v$="vformKitchen$"
          :state="state"
          :id_store="id"
        />
      </template>
    </EModal>
  </form>
</template>

<style lang="scss" scoped>
.gg-select {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
.gg-select::after,
.gg-select::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
th.sort {
  cursor: pointer;
  user-select: none;
  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }
  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}
</style>
