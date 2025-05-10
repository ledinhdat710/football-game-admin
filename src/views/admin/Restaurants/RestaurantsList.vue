<script setup>
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import Swal from "sweetalert2";
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import EButton from "@/components/Elements/EButton.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import { restaurantService } from "@/services/restaurant.service";
import { useTemplateStore } from "@/stores/template";
import EModal from "@/components/Elements/EModal.vue";
import { SMSService } from "@/services/sms.service";
import ModalConfigSMS from "@/views/admin/Restaurants/ModalConfigSMS.vue";
import useVuelidate from "@vuelidate/core";
import useNotify from "@/composables/useNotify";

const store = useTemplateStore();
const { width } = useWindowSize();
const isMobile = width.value <= 768;
let toast = Swal.mixin({
  buttonsStyling: false,
  target: "#page-container",
  customClass: {
    confirmButton: "btn btn-success m-1",
    cancelButton: "btn btn-danger m-1",
    input: "form-control",
  },
});
const router = useRouter();
const onNavForm = () => {
  router.push({ name: "admin-restaurants-form" });
};

const cols = reactive([
  {
    name: "Name",
    field: "name",
    sort: "",
  },
  {
    name: "Email",
    field: "email",
    sort: "",
  },
  {
    name: "Slug",
    field: "slug",
    sort: "",
  },
  {
    name: "SMS",
    field: "SMS",
    sort: "",
  },
]);

const listRestaurants = ref();
const onFetchList = async () => {
  store.pageLoader({ mode: "on" });
  const response = await restaurantService.getList({
    page: 1,
    limit: -1,
  });
  store.pageLoader({ mode: "off" });
  if (!response?.error) {
    listRestaurants.value = response.data?.data || [];
  }
};

onMounted(async () => {
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });
  let selectLength = document.querySelector("#datasetLength select");
  selectLength.classList = "";
  selectLength.classList.add("form-select");
  selectLength.style.width = "80px";

  // await onFetchList();
});

const onNavKiosk = (id) => {
  router.push(`/admin/restaurants/kiosk/${id}`);
};

const onNavKitchen = (id) => {
  router.push(`/admin/restaurants/kitchen/${id}`);
};

const onNavBankTerminal = (id) => {
  router.push(`/admin/restaurants/bank/${id}`);
};

const onNavPrinter = (id) => {
  router.push(`/admin/restaurants/printer/${id}`);
};

const onNavUser = (id) => {
  router.push(`/admin/restaurants/user/${id}`);
};

const onNavMedia = (id) => {
  router.push(`/admin/restaurants/media/${id}`);
};

const onNavEdit = (id) => {
  router.push(`/admin/restaurants/form/${id}`);
};

const onOpenDeleteConfirm = (id) => {
  toast
    .fire({
      title: "Are you sure?",
      text: "You will not be able to recover this restaurant!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return restaurantService.delete(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Restaurant has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Restaurant is safe", "error");
      }
    });
};

const onRedirectLogin = async (id) => {
  const response = await restaurantService.loginWithId(id);
  if (isMobile) {
    window.location.href = `${
      import.meta.env.VITE_DOMAIN_MERCHANT
    }/en/auth/check/sign-in?access_token=${encodeURIComponent(
      response?.data?.access_token
    )}`;
  } else {
    window.open(
      `${
        import.meta.env.VITE_DOMAIN_MERCHANT
      }/en/auth/check/sign-in?access_token=${encodeURIComponent(
        response?.data?.access_token
      )}`,
      "_blank"
    );
  }
};

const handleGetDetailSMS = async (row) => {
  state.store_id = row?.id;
  if (row?.sms_config) {
    state.id_sms = row?.sms_config?.id;
    state.message = row?.sms_config?.message;
    state.sender = row?.sms_config?.sender;
  } else {
    state.id_sms = null;
    state.message = null;
    state.sender = null;
  }
};

let state = reactive({
  id_sms: null,
  message: null,
  sender: null,
  store_id: null,
});

const rules = computed(() => {
  return {
    message: {
      // required,
    },
    sender: {
      // required
    },
  };
});
let vformSMS$ = useVuelidate(rules, state);
const onResetCache = async (id) => {
  try {
    toast
      .fire({
        title: "Are you sure?",
        text: "Are you sure to reset cache this restaurant!",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn btn-danger m-1",
          cancelButton: "btn btn-info m-1",
        },
        confirmButtonText: "Yes, reset!",
        html: false,
        preConfirm: () => {
          return restaurantService.resetCache(id);
        },
      })
      .then((result) => {
        if (result.value && !result.value?.error) {
          toast.fire("Reseted!", "Reset cache success.", "success");
          onFetchList();
        } else if (result.dismiss === "cancel") {
          toast.fire("Cancelled", "Restaurant is safe", "error");
        }
      });
  } catch (error) {
    console.log(error);
  }
};
const { setNotify } = useNotify();
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
});
const onSubmitConfig = async () => {
  try {
    let payload = {
      message: state.message,
      sender: state.sender,
      store_id: state.store_id,
    };
    const response = state.id_sms
      ? await SMSService.update(state.id_sms, payload)
      : await SMSService.post(payload);
    if (!response?.error) {
      onFetchList();
      refBtn.value.click();
      (state.id_sms = null),
        (state.store_id = null),
        (state.message = null),
        (state.sender = null),
        vformSMS$.value.$reset();
      return setNotify({
        title: "Success",
        message: "Update config message success",
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

const handleCloseModal = () => {
  state.store_id = null;
  state.id_sms = null;
  state.sender = null;
  state.message = null;
};
</script>

<template>
  <BasePageHeading
    title="List Restaurants"
    subtitle="Custom functionality to further enrich your tables."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List restaurants</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Dataset">
      <template #options>
        <e-button type="info" size="sm" @click="onNavForm"
          ><i class="fa fa-plus opacity-50 me-1"></i> New restaurant</e-button
        >
      </template>
      <Dataset
        v-slot="{ ds }"
        :ds-data="listRestaurants"
        :ds-search-in="['name']"
      >
        <div v-show="listRestaurants?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th
                        v-for="th in cols"
                        :key="th.field"
                        :class="['sort', th.sort]"
                      >
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </th>
                      <th style="width: 100px">Login</th>
                      <th style="text-align: right; width: 100px">Action</th>
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row }">
                      <tr>
                        <td>{{ row.name }}</td>
                        <td>{{ row.email }}</td>
                        <td>{{ row.slug }}</td>
                        <td>
                          <button
                            type="button"
                            class="btn btn-sm btn-link"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-config-sms"
                            data-target=".bd-example-modal-lg"
                            @click="handleGetDetailSMS(row)"
                          >
                            Config SMS
                          </button>
                        </td>
                        <td>
                          <a
                            style="cursor: pointer; color: var(--bs-primary)"
                            @click="onRedirectLogin(row?.manager_id)"
                            >Login</a
                          >
                        </td>
                        <td class="text-end">
                          <div class="btn-group items-center gap-1">
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavEdit(row.id)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              title="Bank Terminal"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavBankTerminal(row?.id)"
                            >
                              <i class="fa-solid fa-building-columns"></i>
                            </button>
                            <button
                              type="button"
                              title="Kiosk"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavKiosk(row?.id)"
                            >
                              <i class="fa fa-fw fa-store"></i>
                            </button>
                            <button
                              type="button"
                              title="Kitchen"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavKitchen(row?.id)"
                            >
                              <i class="fa-solid fa-kitchen-set"></i>
                            </button>
                            <button
                              type="button"
                              title="Printer"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavPrinter(row?.id)"
                            >
                              <i class="fa fa-fw fa-print"></i>
                            </button>
                            <button
                              type="button"
                              title="User"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavUser(row?.id)"
                            >
                              <i class="fa fa-fw fa-user"></i>
                            </button>
                            <button
                              type="button"
                              title="Media"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onNavMedia(row?.id)"
                            >
                              <i class="fa-solid fa-photo-film"></i>
                            </button>
                            <button
                              type="button"
                              title="Reset Cache"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onResetCache(row?.id)"
                            >
                              <i class="fa fa-fw fa-refresh"></i>
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
        <EListEmpty v-if="!listRestaurants?.length" />
        <form @submit.prevent="onSubmitConfig">
          <EModal
            id="modal-config-sms"
            title="Config SMS"
            id-modal="hidden"
            size="modal-xl"
            ok-text="Confirm"
            ok-type="submit"
            :close-on-submit="false"
            @confirm="() => onSubmitConfig()"
            @closeModal="() => handleCloseModal()"
          >
            <template v-slot:childrenComponent>
              <ModalConfigSMS :v$="vformSMS$" :state="state" />
            </template>
          </EModal>
        </form>
      </Dataset>
    </BaseBlock>
  </div>
</template>
