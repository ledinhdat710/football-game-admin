<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { kioskSlavesService } from "@/services/kioskSlaves.service";
import { restaurantService } from "@/services/restaurant.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormKioskSlaves from "@/views/admin/KioskSlaves/KioskSlavesForm.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Swal from "sweetalert2";
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  Dataset,
  DatasetInfo,
  DatasetItem,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

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
let state = reactive({
  name: "",
  resetTimer: "",
  hwid: "",
  autoScreenOff: 0,
  isAutoScreenOff: false,
  store_id: null,
  idleTimeout: null,
  screenInch: "",
  use_cash: 0,
  printer_id: null,
  bank_terminal: null,
  checkout_terminal_id: null,
  type: 1,
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
    hwid: {
      required,
    },
    screenInch: {
      required,
    },
    // printer_id: {
    //   required,
    // },
    // bank_terminal: {
    //   required,
    // },
    type: {
      required,
    },
  };
});

let vformKioskSlaves$ = useVuelidate(rules, state);

// Helper variables
const cols = reactive([
  {
    name: "ID",
    field: "id",
    sort: "",
  },
  {
    name: "Name",
    field: "Name",
    sort: "",
  },
  {
    name: "HWID",
    field: "HWID",
    sort: "",
  },
  {
    name: "Screen Inch",
    field: "ScreenInch",
    sort: "",
  },
  {
    name: "Store",
    field: "Store",
    sort: "",
  },
  {
    name: "Last Seen",
    field: "LastSeen",
    sort: "",
  },
  {
    name: "Status",
    field: "Status",
    sort: "",
  },
]);

const listKioskSlaves = ref([]);
const limit = ref(10);
const currentPage = ref(1);
const total = ref();
const visible = ref(true);
const idModal = ref(null);
const valueSearchStore = ref(0);
const searchStore = async () => {
  onFetchList();
};
const optionsStore = ref([]);
const optionsStoreSelect = ref([]);
const onFetchListStore = async () => {
  try {
    const response = await restaurantService.getList({
      page: 1,
      limit: -1,
    });
    if (!response?.error) {
      const newArray = response.data?.data.map((item) => ({
        value: item.id,
        name: item.name,
      }));
      optionsStore.value = [{ value: 0, name: "All Store" }, ...newArray];
      optionsStoreSelect.value = [
        { value: null, name: "No Store" },
        ...newArray,
      ];
    }
  } catch (e) {
    console.log(e);
  }
};
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await kioskSlavesService.getListDevice({
      store_id: valueSearchStore.value,
      page: currentPage.value,
      limit: limit.value,
    });
    if (!response?.error) {
      listKioskSlaves.value = response?.data?.data || [];
      total.value = response?.data?.pagination.total;
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const reloadData = () => {
  onFetchList();
};

watch(limit, async () => {
  currentPage.value = 1;
  await onFetchList();
});

const idKiosk = ref(null);

const handleModalForm = async () => {
  idModal.value = undefined;
  idKiosk.value = undefined;
  state.name = "";
  state.resetTimer = "";
  state.autoScreenOff = 0;
  state.isAutoScreenOff = false;
  state.store_id = null;
  state.idleTimeout = null;
  state.screenInch = "";
  state.hwid = "";
  state.use_cash = 0;
  state.printer_id = null;
  state.bank_terminal = null;
  state.checkout_terminal_id = null;
  state.type = 1;
  vformKioskSlaves$.value.$reset();
  store.pageLoader({ mode: "on" });
  store.pageLoader({ mode: "off" });
};
const handleModalFormUpdate = async (id, idKioskForm) => {
  idModal.value = id;
  idKiosk.value = idKioskForm;
  store.pageLoader({ mode: "on" });
  await apiGetPrinter(id);
  store.pageLoader({ mode: "off" });
};

const apiGetPrinter = async (id) => {
  const response = await kioskSlavesService.getDetailDevice(id);
  state.name = response?.name;
  state.hwid = response?.hwid;
  state.screenInch = response?.screenInch;
  state.resetTimer = response?.resetTimer;
  state.store_id = response?.store?.id ? response?.store?.id : null;
  if (response?.idleTimeout) {
    state.idleTimeout = response?.idleTimeout;
  }
  state.autoScreenOff = response?.autoScreenOff ? 1 : 0;
  state.isAutoScreenOff = response?.autoScreenOff ? true : false;
  state.use_cash = response?.use_cash ? 1 : 0;
  state.printer_id =
    response?.printer_id === null ? "no_printer" : response?.printer_id;
  state.bank_terminal =
    response?.terminal_id === null ? "no_bank" : response?.terminal_id;
  state.checkout_terminal_id =
    response?.checkout_terminal_id === null
      ? ""
      : response?.checkout_terminal_id;
  state.type = response?.type;

  vformKioskSlaves$.value.$reset();
};

onMounted(async () => {
  await onFetchListStore();
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
      text: "You will not be able to recover this kiosk slaves!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return kioskSlavesService.deleteDevice(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Kiosk Slaves has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Kiosk Slaves is safe", "error");
      }
    });
};

async function onSubmitKioskSlaves() {
  if (idModal.value) {
    await onSubmitUpdateKioskSlaves();
  } else {
    await onSubmitCreateKioskSlaves();
  }
}
async function confirmNew(val) {
  await onSubmitCreateKioskSlaves(val);
}

async function onSubmitCreateKioskSlaves(val) {
  try {
    const result = await vformKioskSlaves$.value.$validate();
    if (!result) return;
    let payload = {};
    payload = {
      resetTimer: state.resetTimer,
      autoScreenOff: state.autoScreenOff,
      idleTimeout: state.idleTimeout,
      store_id: state.store_id,
      name: state.name,
      screenInch: state.screenInch,
      hwid: state.hwid,
      use_cash: state.use_cash,
      printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
      terminal_id:
        state.bank_terminal === "no_bank" ? null : state.bank_terminal,
      checkout_terminal_id: state.checkout_terminal_id,
      type: state.type,
    };
    const response = await kioskSlavesService.createDevice(payload);
    if (!response?.error) {
      currentPage.value = 1;
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      (state.name = ""),
        (state.hwid = ""),
        (state.screenInch = ""),
        (state.resetTimer = ""),
        (state.autoScreenOff = 0),
        (state.isAutoScreenOff = false),
        (state.idleTimeout = ""),
        (state.store_id = null);
      (state.printer_id = null),
        (state.type = 1),
        vformKioskSlaves$.value.$reset();
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

async function onSubmitUpdateKioskSlaves() {
  try {
    const result = await vformKioskSlaves$.value.$validate();
    if (!result) return;
    let payload = {
      resetTimer: state.resetTimer,
      autoScreenOff: state.autoScreenOff,
      idleTimeout: state.idleTimeout,
      store_id: state.store_id,
      name: state.name,
      screenInch: state.screenInch,
      hwid: state.hwid,
      printer_id: state.printer_id === "no_printer" ? "" : state.printer_id,
      terminal_id:
        state.bank_terminal === "no_bank" ? null : state.bank_terminal,
      checkout_terminal_id: state.checkout_terminal_id,
      type: state.type,
      use_cash: state.use_cash,
      _method: "PUT",
    };
    const response = await kioskSlavesService.updateDevice(
      idModal.value,
      payload
    );
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

const onCloseKioskSlaves = () => {
  vformKioskSlaves$.value.$reset();
};
</script>

<template>
  <BasePageHeading
    title="List Kiosk Slaves"
    subtitle="View and manage all your kiosk slaves."
    :go-back="true"
  >
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2">
          <EButton
            type="info"
            size="sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-kiosk-slaves"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New Kiosk
            Slaves</EButton
          >
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)">Manages</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">
              List Kiosk Slaves
            </li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Kiosk Slaves" :isReload="true" @reloadData="reloadData">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listKioskSlaves"
        :ds-search-in="['id', 'name', 'hwid']"
      >
        <div>
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-6 py-2">
              <div v-show="listKioskSlaves?.length">
                <DatasetShow v-show="false" :dsShowEntries="100" />
                <div class="form-inline">
                  <select
                    class="form-select"
                    style="width: 80px"
                    v-model="limit"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-3 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
            <div class="col-md-3 py-2">
              <select
                id="val-store-id"
                class="form-select"
                v-model="valueSearchStore"
                placeholder="Select store"
                @change="searchStore"
              >
                <option
                  v-for="(store, index) in optionsStore"
                  :value="store.value"
                  :key="`store-${index}`"
                >
                  {{ store.name }}
                </option>
              </select>
            </div>
          </div>
          <hr />
          <div class="row" v-if="listKioskSlaves?.length">
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
                        <td style="min-width: 100px">{{ row?.name }}</td>
                        <td style="min-width: 100px">{{ row?.hwid }}</td>
                        <td style="min-width: 50px">
                          {{ row?.screenInch }}
                        </td>
                        <td style="min-width: 100px">
                          {{ row?.store?.name }}
                        </td>
                        <td style="min-width: 100px">
                          {{ row?.last_call }}
                        </td>
                        <td v-if="row?.status === 1" style="min-width: 50px">
                          <div class="online"></div>
                        </td>
                        <td
                          v-else-if="row?.status === 3"
                          style="min-width: 50px"
                        >
                          <div class="offline"></div>
                        </td>
                        <td
                          v-else-if="row?.status === 2"
                          style="min-width: 50px"
                        >
                          <div class="pending"></div>
                        </td>
                        <td v-else></td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-kiosk-slaves"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="
                                () => handleModalFormUpdate(row?.hwid, row?.id)
                              "
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onOpenDeleteConfirm(row?.hwid)"
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
            v-if="listKioskSlaves?.length"
            class="d-flex flex-md-row flex-column justify-content-between align-items-center"
          >
            <DatasetInfo class="py-3 fs-sm" />
            <el-pagination
              v-if="visible"
              v-model:current-page="currentPage"
              @current-change="onFetchList"
              background
              v-model:page-size="limit"
              layout="prev, pager, next"
              prev-text="Previous"
              next-text="Next"
              :total="total"
            />
          </div>
        </div>
        <EListEmpty v-if="!listKioskSlaves?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form @submit.prevent="onSubmitKioskSlaves">
    <EModal
      id="modal-kiosk-slaves"
      :title="idModal ? 'Update kiosk slaves' : 'Add new kiosk slaves'"
      :idModal="idModal"
      size="modal-xl"
      ok-text="Confirm"
      ok-text-add="Confirm & New"
      ok-type="submit"
      :close-on-submit="false"
      @confirm="() => onSubmitKioskSlaves()"
      @confirmNew="(val) => confirmNew(val)"
      @closeModal="() => onCloseKioskSlaves()"
    >
      <template v-slot:childrenComponent>
        <ModalFormKioskSlaves
          :idModal="idModal"
          :v$="vformKioskSlaves$"
          :state="state"
          :idKiosk="idKiosk"
          :optionsStore="optionsStoreSelect"
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
.online {
  width: 20px;
  height: 20px;
  background-color: green;
  border-radius: 50%;
}
.offline {
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
}
.pending {
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 50%;
}
</style>
