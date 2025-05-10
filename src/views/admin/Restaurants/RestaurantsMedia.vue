<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { kioskSlavesService } from "@/services/kioskSlaves.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormMedia from "@/views/admin/Restaurants/ModalFormMedia.vue";
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
import { useRoute } from "vue-router";

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
const route = useRoute();
const id = route.params?.id;
let state = reactive({
  name: "",
  media: null,
  startIdle: "",
  endIdle: "",
  isActive: 0,
  active: false,
  isDefault: 0,
  default: false,
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
    startIdle: {
      required: (v) => (!state.isDefault ? !!v : true),
    },
    endIdle: {
      required: (v) => (!state.isDefault ? !!v : true),
    },
    media: {
      required,
    },
  };
});

let vformMedia$ = useVuelidate(rules, state);

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
    name: "Start Idle",
    field: "Start Idle",
    sort: "",
  },
  {
    name: "End Idle",
    field: "End Idle",
    sort: "",
  },
  {
    name: "Is Active",
    field: "Is Active",
    sort: "",
  },
  {
    name: "Is Default",
    field: "Is Default",
    sort: "",
  },
]);

const listKioskSlaves = ref([]);
const idModal = ref(null);
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await kioskSlavesService.getListMedia({
      store_id: id,
      limit: -1,
    });
    if (!response?.error) {
      listKioskSlaves.value = response?.data || [];
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const handleModalForm = async () => {
  idModal.value = undefined;
  state.name = "";
  state.media = null;
  state.startIdle = "";
  state.endIdle = "";
  state.isActive = 0;
  state.active = false;
  state.isDefault = 0;
  state.default = false;
  vformMedia$.value.$reset();
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
  const response = await kioskSlavesService.getDetailMedia(id);
  state.name = response?.data?.name;
  state.startIdle = response?.data?.start_idle;
  state.endIdle = response?.data?.end_idle;
  state.active = response?.data?.is_active;
  state.isActive = response?.data?.is_active ? 1 : 0;
  state.default = response?.data?.is_default;
  state.isDefault = response?.data?.is_default ? 1 : 0;
  state.media = response?.data?.media;
  vformMedia$.value.$reset();
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
      text: "You will not be able to recover this media!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return kioskSlavesService.deleteMedia(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Media has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Media is safe", "error");
      }
    });
};

async function onSubmitMedia() {
  if (idModal.value) {
    await onSubmitUpdateMedia();
  } else {
    await onSubmitCreateMedia();
  }
}
async function confirmNew(val) {
  await onSubmitCreateMedia(val);
}

async function onSubmitCreateMedia(val) {
  try {
    const result = await vformMedia$.value.$validate();
    if (!result) return;
    let payload = {};
    if (state.isDefault) {
      payload = {
        name: state.name,
        store_id: id,
        media: state.media,
        is_active: 0,
        is_default: state.isDefault,
      };
    } else {
      payload = {
        name: state.name,
        store_id: id,
        media: state.media,
        start_idle: state.startIdle,
        end_idle: state.endIdle,
        is_active: state.isActive,
        is_default: state.isDefault,
      };
    }
    const response = await kioskSlavesService.createMedia(payload);
    if (!response?.error) {
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      (state.name = ""),
        (state.media = null),
        (state.startIdle = ""),
        (state.endIdle = ""),
        (state.isActive = 0),
        (state.active = false),
        (state.isDefault = 0),
        (state.default = false);
      vformMedia$.value.$reset();
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

async function onSubmitUpdateMedia() {
  try {
    const result = await vformMedia$.value.$validate();
    if (!result) return;
    let payload = {};
    if (state.isDefault) {
      payload = {
        name: state.name,
        store_id: id,
        media: state.media,
        is_active: 0,
        is_default: state.isDefault,
        _method: "PUT",
      };
    } else {
      payload = {
        name: state.name,
        store_id: id,
        media: state.media,
        start_idle: state.startIdle,
        end_idle: state.endIdle,
        is_active: state.isActive,
        is_default: state.isDefault,
        _method: "PUT",
      };
    }
    const response = await kioskSlavesService.updateMedia(
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

const changeActive = async (id) => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await kioskSlavesService.updateMediaActive(id);
    if (!response?.error) {
      setNotify({
        title: "Success",
        message: "Update success",
        type: "success",
      });
    }
    onFetchList();
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const onCloseMedia = () => {
  vformMedia$.value.$reset();
};
</script>

<template>
  <BasePageHeading
    title="List Media"
    subtitle="View and manage all your media."
    :go-back="true"
  >
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2">
          <EButton
            type="info"
            size="sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-media"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New Media</EButton
          >
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)">Manages</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">List Media</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Media">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listKioskSlaves"
        :ds-search-in="['id', 'name']"
      >
        <div v-show="listKioskSlaves?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
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
                        <td style="min-width: 100px">{{ row?.start_idle }}</td>
                        <td style="min-width: 100px">{{ row?.end_idle }}</td>
                        <td style="min-width: 100px">
                          <div class="form-check form-switch">
                            <input
                              @click="changeActive(row?.id)"
                              class="form-check-input"
                              type="checkbox"
                              :checked="row?.is_active"
                            />
                          </div>
                        </td>
                        <td style="min-width: 50px">{{ row?.is_default }}</td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-media"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalFormUpdate(row?.id)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onOpenDeleteConfirm(row?.id)"
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
        <EListEmpty v-if="!listKioskSlaves?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitMedia">
    <EModal
      id="modal-media"
      :title="idModal ? 'Update media' : 'Add new media'"
      :idModal="idModal"
      size="modal-xl"
      ok-text="Confirm"
      ok-text-add="Confirm & New"
      ok-type="submit"
      :close-on-submit="false"
      @confirm="() => onSubmitMedia()"
      @confirmNew="(val) => confirmNew(val)"
      @closeModal="() => onCloseMedia()"
    >
      <template v-slot:childrenComponent>
        <ModalFormMedia :idModal="idModal" :v$="vformMedia$" :state="state" />
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
