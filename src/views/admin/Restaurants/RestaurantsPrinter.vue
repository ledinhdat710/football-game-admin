<script setup>
import EIcon from "@/components/Elements/EIcon.vue";
import EButton from "@/components/Elements/EButton.vue";
import EModal from "@/components/Elements/EModal.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import ModalFormPrinter from "@/views/admin/Restaurants/ModalFormPrinter.vue";
import { printerService } from "@/services/printer.service";
import { useTemplateStore } from "@/stores/template";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import {
  Dataset,
  DatasetInfo,
  DatasetItem,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { computed } from "vue";
import { required } from "@vuelidate/validators";
import useNotify from "@/composables/useNotify";

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
const router = useRouter();
const route = useRoute();
const { setNotify } = useNotify();
const id = route.params?.id;
let state = reactive({
  name: null,
  printer_id: null,
  username: null,
  access_key: null,
});
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
});

const rules = computed(() => {
  return {
    name: { required },
    printer_id: { required },
    username: { required },
    access_key: { required },
  };
});
let vformPrinter$ = useVuelidate(rules, state);

// Helper variables
const cols = reactive([
  {
    name: "Id",
    field: "id",
    sort: "",
  },
  {
    name: "Printer Id",
    field: "printer_id",
    sort: "",
  },
  {
    name: "Printer Name",
    field: "name",
    sort: "",
  },
  {
    name: "User Name",
    field: "username",
    sort: "",
  },
]);

const listPrinters = ref([]);
const idModal = ref();
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await printerService.getList({
      store_id: id,
      limit: -1,
    });
    if (!response?.error) {
      listPrinters.value = response.data?.data || [];
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const handleModalForm = () => {
  idModal.value = undefined;
  state.name = null;
  state.printer_id = null;
  state.username = null;
  state.access_key = null;
  vformPrinter$.value.$reset();
};
const handleModalFormUpdate = async (id) => {
  idModal.value = id;
  await apiGetPrinter(id);
};
const apiGetPrinter = async (id) => {
  try {
    const response = await printerService.get(id);
    state.name = response.data.name;
    state.printer_id = response.data.printer_id;
    state.username = response.data.username;
    state.access_key = response.data.access_key;
    vformPrinter$.value.$reset();
  } catch (error) {
    console.log("error :", error);
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
      text: "You will not be able to recover this printer!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return printerService.delete(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Kiosk has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Printer is safe", "error");
      }
    });
};

const onSubmitPrinter = async () => {
  if (idModal.value) {
    await onSubmitUpdatePrinter();
  } else {
    await onSubmitCreatePrinter();
  }
};

async function confirmNew(val) {
  await onSubmitCreatePrinter(val);
}

const onSubmitCreatePrinter = async (val) => {
  try {
    const result = await vformPrinter$.value.$validate();
    if (!result) return;
    let payload = {
      name: state.name,
      printer_id: state.printer_id,
      username: state.username,
      access_key: state.access_key,
      store_id: id,
    };
    const response = await printerService.create(payload);
    if (!response?.error) {
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      state.name = null;
      state.printer_id = null;
      state.username = null;
      state.access_key = null;
      vformPrinter$.value.$reset();
      return setNotify({
        title: "Success",
        message: "Create printer success",
        type: "success",
      });
    }
  } catch (e) {
    return setNotify({
      title: "Error",
      message: e?.message,
    });
  }
};

const onSubmitUpdatePrinter = async () => {
  try {
    const result = await vformPrinter$.value.$validate();
    if (!result) return;
    let payload = {
      name: state.name,
      printer_id: state.printer_id,
      username: state.username,
      access_key: state.access_key,
      store_id: id,
    };
    const response = await printerService.update(idModal.value, payload);
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
};
const onTestPrint = async (id) => {
  try {
    const result = await printerService.testPrint(id);
    if (!result?.error) {
      setNotify({
        title: "Success",
        message: result?.message || "Print success",
        type: "success",
      });
    }
  } catch (e) {
    setNotify({
      title: "Error",
      message: e?.message,
    });
  }
};
const navigateRestaurent = () => {
  router.push(`/admin/restaurants`);
};

const handleConfigDefaultPrinter = async (id) => {
  try {
    const result = await printerService.defaultPrint(id);
    if (!result?.error) {
      setNotify({
        title: "Success",
        message: result?.message || "Print success",
        type: "success",
      });
      onFetchList();
    }
  } catch (e) {
    setNotify({
      title: "Error",
      message: e?.message,
    });
  }
};

const handleUnsetConfigDefaultPrinter = async (id) => {
  try {
    const result = await printerService.unsetDefaultPrint(id);
    if (!result?.error) {
      setNotify({
        title: "Success",
        message: result?.message || "Unset Print success",
        type: "success",
      });
      onFetchList();
    }
  } catch (e) {
    setNotify({
      title: "Error",
      message: e?.message,
    });
  }
};
</script>

<template>
  <BasePageHeading
    title="Printer Detail"
    subtitle="Custom functionality to further enrich your tables."
    :go-back="true"
  >
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2">
          <EButton
            type="info"
            size="sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-printer"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New Printer</EButton
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
            <li class="breadcrumb-item" aria-current="page">List Printer</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="d-flex justify-content-end mb-2">
      <!--      <e-button type="info" size="sm" @click="handleConfigDefaultPrinter">Config Default Printer</e-button>-->
    </div>
    <BaseBlock title="Printers">
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
        :ds-data="listPrinters"
        :ds-search-in="['id', 'name']"
      >
        <div v-show="listPrinters?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listPrinters?.length">
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
                          {{ row?.id }}
                        </td>
                        <td style="min-width: 150px">
                          {{ row?.printer_id }}
                          <span
                            v-if="!!row?.is_default"
                            class="badge badge-dark text-bg-dark"
                            >Default Printer</span
                          >
                        </td>
                        <td style="min-width: 150px">{{ row?.name }}</td>
                        <td style="min-width: 150px">{{ row?.username }}</td>
                        <!-- <td style="min-width: 150px">
                          {{ row.type === 1 ? 'Counter' : 'Kitchen' }}
                        </td> -->
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              v-if="!row?.is_default"
                              title="default printer"
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="handleConfigDefaultPrinter(row?.id)"
                            >
                              <i class="fa-solid fa-gear"></i>
                            </button>
                            <button
                              v-if="!!row?.is_default"
                              title="remove default printer"
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="handleUnsetConfigDefaultPrinter(row?.id)"
                            >
                              <i class="fa-solid fa-square-minus"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onTestPrint(row?.id)"
                            >
                              <i class="fa fa-print"></i>
                            </button>
                            <button
                              v-if="row?.version !== 2"
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-printer"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalFormUpdate(row?.id)"
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
        <EListEmpty v-if="!listPrinters?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitPrinter">
    <EModal
      id="modal-printer"
      :title="idModal ? 'Update printer' : 'Add new printer'"
      :idModal="idModal"
      size="modal-xl"
      ok-type="submit"
      ok-text-add="Confirm & New"
      :close-on-submit="false"
      @confirmNew="(val) => confirmNew(val)"
      @confirm="() => onSubmitPrinter()"
    >
      <template v-slot:childrenComponent>
        <ModalFormPrinter :id="idModal" :v$="vformPrinter$" :state="state" />
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
