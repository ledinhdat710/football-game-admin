<script setup>
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { printerSlavesService } from "@/services/printerSlaves.service";
import { restaurantService } from "@/services/restaurant.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormPrinterSlaves from "@/views/admin/PrinterSlaves/PrinterSlavesForm.vue";
import useVuelidate from "@vuelidate/core";
import { printerService } from "@/services/printer.service";

import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  Dataset,
  DatasetInfo,
  DatasetItem,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

const store = useTemplateStore();
const { setNotify } = useNotify();
let state = reactive({
  store_id: null,
});

const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
});

const rules = computed(() => {
  return {};
});

let vformPrinterSlaves$ = useVuelidate(rules, state);

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
    name: "Store",
    field: "Store",
    sort: "",
  },
  {
    name: "Is Default",
    field: "IsDefault",
    sort: "",
  },
  {
    name: "Last Online",
    field: "Last Online",
    sort: "",
  },
  {
    name: "Is Online",
    field: "IsOnline",
    sort: "",
  },
  {
    name: "Status",
    field: "Status",
    sort: "",
  },
]);

const listPrinterSlaves = ref([]);
const limit = ref(10);
const currentPage = ref(1);
const total = ref();
const visible = ref(true);
const idModal = ref(null);

const optionsStore = ref([]);
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
      optionsStore.value = [{ value: null, name: "No Store" }, ...newArray];
    }
  } catch (e) {
    console.log(e);
  }
};
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await printerSlavesService.getListPrinter({
      // store_id: valueSearchStore.value,
      page: currentPage.value,
      limit: limit.value,
    });
    if (!response?.error) {
      listPrinterSlaves.value = response?.data?.data || [];
      total.value = response?.data?.meta?.total;
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const onSyncList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await printerSlavesService.syncPrinter();
    if (!response?.error) {
      onFetchList();
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const reloadData = () => {
  onSyncList();
};

watch(limit, async () => {
  currentPage.value = 1;
  await onFetchList();
});

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

async function testPrinter(id) {
  try {
    const response = await printerSlavesService.testPrinter(id);
    if (!response?.error) {
      return setNotify({
        title: "Success",
        message: `${response?.message}`,
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

async function onSubmitPrinterSlaves() {
  await onSubmitAttachStore();
}

const handleAttachStore = async (id, store_id) => {
  idModal.value = id;
  if (store_id) {
    state.store_id = store_id;
  } else {
    state.store_id = null;
  }
  store.pageLoader({ mode: "on" });
  store.pageLoader({ mode: "off" });
};

const onSubmitAttachStore = async () => {
  try {
    const result = await vformPrinterSlaves$.value.$validate();
    if (!result) return;
    let payload = {
      store_id: state.store_id,
    };
    const response = await printerSlavesService.attachStore(
      idModal.value,
      payload
    );
    if (!response?.error) {
      onFetchList();
      refBtn.value.click();
      return setNotify({
        title: "Success",
        message: "Attach Store Success",
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

const onClosePrinterSlaves = () => {
  vformPrinterSlaves$.value.$reset();
};
</script>

<template>
  <BasePageHeading
    title="List Printer Slaves"
    subtitle="View and manage all your printer slaves."
    :go-back="true"
  >
    <template #extra>
      <div class="flex flex-col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)">Manages</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">
              List Printer Slaves
            </li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Printer Slaves" :isReload="true" @reloadData="reloadData">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listPrinterSlaves"
        :ds-search-in="['id', 'name']"
      >
        <div>
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <div v-show="listPrinterSlaves?.length">
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
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listPrinterSlaves?.length">
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
                        <td style="min-width: 100px">
                          {{ row?.store?.name }}
                        </td>
                        <td style="min-width: 50px">
                          {{ row?.is_default }}
                        </td>
                        <td style="min-width: 100px">{{ row?.last_online }}</td>
                        <td v-if="row?.is_online" style="min-width: 50px">
                          <div class="online"></div>
                        </td>
                        <td v-else style="min-width: 50px">
                          <div class="offline"></div>
                        </td>
                        <td v-if="row?.status === 1" style="min-width: 50px">
                          Available
                        </td>
                        <td
                          v-else-if="row?.status === 0"
                          style="min-width: 50px"
                        >
                          UnAvailable
                        </td>
                        <td v-else></td>
                        <td class="text-end">
                          <div class="btn-group">
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
                              data-bs-toggle="modal"
                              data-bs-target="#modal-printer-slaves"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="
                                () => handleAttachStore(row?.id, row?.store?.id)
                              "
                            >
                              <i class="fa-solid fa-paperclip"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="testPrinter(row?.id)"
                            >
                              <i class="fa fa-print"></i>
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
            v-if="listPrinterSlaves?.length"
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
        <EListEmpty v-if="!listPrinterSlaves?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form @submit.prevent="onSubmitPrinterSlaves">
    <EModal
      id="modal-printer-slaves"
      :title="'Attach Store'"
      :idModal="idModal"
      size="modal-xl"
      ok-text="Confirm"
      ok-text-add="Confirm & New"
      ok-type="submit"
      :close-on-submit="false"
      @confirm="() => onSubmitPrinterSlaves()"
      @closeModal="() => onClosePrinterSlaves()"
    >
      <template v-slot:childrenComponent>
        <ModalFormPrinterSlaves
          :idModal="idModal"
          :v$="vformPrinterSlaves$"
          :state="state"
          :optionsStore="optionsStore"
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
