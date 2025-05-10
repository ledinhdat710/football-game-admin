<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EIcon from "@/components/Elements/EIcon.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { kiosikService } from "@/services/kiosik.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormKiosk from "@/views/admin/Restaurants/ModalFormKiosk.vue";
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
import { BankTerminalService } from "@/services/bank.service";

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
  name: null,
  kiosk_id: null,
  use_cash: 0,
  is_required_phone_number: false,
  isUseCash: false,
  printer_id: null,
  serve_printer_id: null,
  bank_terminal: null,
  type: 1,
  use_qr: 0,
  isUseQR: false,
  checkout_terminal_id: null,
});
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
});
const rules = computed(() => {
  return {
    name: {
      required,
    },
    kiosk_id: {
      required,
    },
    printer_id: {
      required,
    },
    serve_printer_id: {
      required,
    },
    bank_terminal: {
      required,
    },
    type: {
      required,
    },
  };
});
let vformKiosk$ = useVuelidate(rules, state);

// Helper variables
const cols = reactive([
  {
    name: "ID",
    field: "id",
    sort: "",
  },
  {
    name: "Kiosk ID",
    field: "Kiosk ID",
    sort: "",
  },
  {
    name: "Name",
    field: "name",
    sort: "",
  },
  {
    name: "Reception Printer",
    field: "printer_id",
    sort: "",
  },
  {
    name: "Terminal",
    field: "terminal_id",
    sort: "",
  },
]);

const listKiosks = ref([]);
const idModal = ref(null);
const idReconsultionTime = ref();
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await kiosikService.getList({
      store_id: id,
      limit: -1,
    });
    if (!response?.error) {
      listKiosks.value = response.data?.data || [];
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const handleNavigate = (slug, id) => {
  const env = import.meta.env.VITE_DOMAIN_CLIENT;
  window.open(`${env}/${slug}/${id}`, "_blank");
};

const handleModalForm = async () => {
  idModal.value = undefined;
  state.name = null;
  state.kiosk_id = null;
  state.printer_id = null;
  state.serve_printer_id = null;
  state.bank_terminal = null;
  state.checkout_terminal_id = null;
  state.type = 1;
  state.use_cash = 0;
  state.use_qr = 0;
  state.isUseCash = false;
  state.is_required_phone_number = false;
  state.isUseQR = false;
  vformKiosk$.value.$reset();
  store.pageLoader({ mode: "on" });
  await onFetchListBankTerminal(undefined);
  store.pageLoader({ mode: "off" });
};
const handleModalFormUpdate = async (id, idKiosk) => {
  idModal.value = id;
  idReconsultionTime.value = idKiosk;
  store.pageLoader({ mode: "on" });
  await apiGetPrinter(id);
  store.pageLoader({ mode: "off" });
};
const optionBankTerminal = ref([
  { value: null, text: "Please select" },
  { value: "no_bank", text: "No bank terminal" },
]);

const apiGetPrinter = async (id) => {
  const response = await kiosikService.get(id);
  await onFetchListBankTerminal(id);
  console.log("response.data.terminal_id", response.data.terminal_id);
  state.name = response.data.name;
  state.kiosk_id = response.data.kiosk_id;
  state.use_cash = response.data.use_cash ? 1 : 0;
  state.use_qr = response.data.use_qr ? 1 : 0;
  state.isUseCash = response.data.use_cash;
  state.is_required_phone_number = response.data.is_required_phone_number;
  state.isUseQR = response.data.use_qr;
  state.printer_id =
    response.data.printer_id === null ? "no_printer" : response.data.printer_id;
  state.serve_printer_id =
    response.data.serve_printer_id === null
      ? "no_printer"
      : response.data.serve_printer_id;
  state.bank_terminal =
    response.data.terminal_id === null ? "no_bank" : response.data.terminal_id;
  state.checkout_terminal_id =
    response.data.checkout_terminal_id === null
      ? ""
      : response.data.checkout_terminal_id;
  state.type = response.data.type;
  vformKiosk$.value.$reset();
};

const onFetchListBankTerminal = async (idKiosk) => {
  const response = await BankTerminalService.getAll({
    store_id: id_stores,
    kiosk_id: idKiosk,
  });
  if (!response?.error) {
    const newArray = response?.data.map((item) => ({
      value: item.id,
      text: item.id,
    }));
    optionBankTerminal.value = [
      { value: null, text: "Please select" },
      { value: "no_bank", text: "No bank terminal" },
      ...newArray,
    ];
    console.log("newArray", newArray);
    // optionBankTerminal.value = [{ value: null, text: 'Please select' },{value: 'no_bank', text: 'No bank terminal'}, ...newArray]
  }
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
      text: "You will not be able to recover this kiosk!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return kiosikService.delete(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Kiosk has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Kiosk is safe", "error");
      }
    });
};

async function onSubmitKiosk() {
  if (idModal.value) {
    await onSubmitUpdateKiosk();
  } else {
    await onSubmitCreateKiosk();
  }
}
async function confirmNew(val) {
  await onSubmitCreateKiosk(val);
}
const id_stores = route.params?.id;
async function onSubmitCreateKiosk(val) {
  try {
    const result = await vformKiosk$.value.$validate();
    if (!result) return;
    let payload = {
      name: state.name,
      kiosk_id: state.kiosk_id,
      use_cash: state.use_cash,
      is_required_phone_number: state.is_required_phone_number,
      use_qr: state.use_qr,
      printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
      serve_printer_id:
        state.serve_printer_id === "no_printer" ? "" : state.serve_printer_id,
      terminal_id:
        state.bank_terminal === "no_bank" ? null : state.bank_terminal,
      checkout_terminal_id: state.checkout_terminal_id,
      type: state.type,
      store_id: id,
    };
    const response = await kiosikService.create(payload);
    if (!response?.error) {
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      (state.name = null),
        (state.kiosk_id = null),
        (state.printer_id = null),
        (state.serve_printer_id = null),
        (state.type = 1);
      vformKiosk$.value.$reset();
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

async function onSubmitUpdateKiosk() {
  try {
    const result = await vformKiosk$.value.$validate();
    if (!result) return;
    let payload = {
      name: state.name,
      kiosk_id: state.kiosk_id,
      printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
      serve_printer_id:
        state.serve_printer_id === "no_printer" ? "" : state.serve_printer_id,
      terminal_id:
        state.bank_terminal === "no_bank" ? null : state.bank_terminal,
      checkout_terminal_id: state.checkout_terminal_id,
      type: state.type,
      is_required_phone_number: state.is_required_phone_number,
      use_cash: state.use_cash,
      use_qr: state.use_qr,
      store_id: id,
    };
    const response = await kiosikService.update(idModal.value, payload);
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

const onCloseKiosk = () => {
  vformKiosk$.value.$reset();
};

const navigateRestaurent = () => {
  router.push(`/admin/restaurants`);
};
</script>

<template>
  <BasePageHeading
    title="Kiosk Detail"
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
            data-bs-target="#modal-kiosik"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New kioks</EButton
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
            <li class="breadcrumb-item" aria-current="page">List Kiosk</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Kiosks">
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
        :ds-data="listKiosks"
        :ds-search-in="['id', 'name']"
      >
        <div v-show="listKiosks?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listKiosks?.length">
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
                        <td style="min-width: 50px">
                          {{ row.id }}
                        </td>
                        <td style="min-width: 150px">{{ row?.kiosk_id }}</td>
                        <td style="min-width: 150px">{{ row?.name }}</td>
                        <td style="min-width: 150px">
                          {{ row?.printer?.name }}
                        </td>
                        <td style="min-width: 150px">
                          {{ row?.terminal_id }}
                        </td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              @click="
                                () =>
                                  handleNavigate(
                                    row?.store?.slug,
                                    row?.kiosk_id
                                  )
                              "
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                            >
                              <i class="fa fa-fw fa-link"></i>
                            </button>
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-kiosik"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="
                                () =>
                                  handleModalFormUpdate(row?.id, row?.kiosk_id)
                              "
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onOpenDeleteConfirm(row.id)"
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
        <EListEmpty v-if="!listKiosks?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitKiosk">
    <EModal
      id="modal-kiosik"
      :title="idModal ? 'Update kiosik' : 'Add new kiosik'"
      :idModal="idModal"
      size="modal-xl"
      ok-text="Confirm"
      ok-text-add="Confirm & New"
      ok-type="submit"
      :close-on-submit="false"
      @confirm="() => onSubmitKiosk()"
      @confirmNew="(val) => confirmNew(val)"
      @closeModal="() => onCloseKiosk()"
    >
      <template v-slot:childrenComponent>
        <ModalFormKiosk
          :idReconsultionTime="idReconsultionTime"
          :id="idModal"
          :v$="vformKiosk$"
          :state="state"
          :id_store="id"
          :optionBankTerminal="optionBankTerminal"
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
