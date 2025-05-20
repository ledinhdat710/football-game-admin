<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { multiTenantService } from "@/services/multiTenant.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormMultiTenant from "@/views/admin/MultiTenant/MultiTenantForm.vue";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
import { userService } from "@/services/user.service";
import Swal from "sweetalert2";
import { computed, onMounted, reactive, ref, watch } from "vue";
import ChangePassword from "@/views/admin/MultiTenant/ChangePassword.vue";
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
const searchManager = ref(0);
let state = reactive({
  name: "",
  email: "",
  password: "",
  store: null,
  role: 3,
  coin: 5,
  manager: 0,
  is_active: 1,
  isActive: true,
});

const refBtn = ref(null);
const refBtnPassword = ref(null);
const domModal = ref("changePassword");
onMounted(() => {
  refBtn.value = document.getElementById("closeModal");
  refBtnPassword.value = document.getElementById("closeModal" + domModal.value); // Gán refBtn cho một phần tử DOM
});

const rules = computed(() => {
  return {
    name: {
      required,
    },
    email: {
      required,
    },
  };
});

let vformMultiTenant$ = useVuelidate(rules, state);

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
    name: "User Name",
    field: "Email",
    sort: "",
  },
  {
    name: "Active",
    field: "Active",
    sort: "",
  },
  {
    name: "Số lần kích mã",
    field: "Số lần kích mã",
    sort: "",
  },
  {
    name: "Tổng Coin được kích",
    field: "Tổng Coin được kích",
    sort: "",
  },
  {
    name: "Số coin hiện tại",
    field: "Số coin hiện tại",
    sort: "",
  },
  {
    name: "Thuộc manager",
    field: "Thuộc manager",
    sort: "",
  },
  {
    name: "Last Login",
    field: "Last Login",
    sort: "",
  },
]);

const limit = ref(10);
const visible = ref(true);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref();
const listMultiTenant = ref([]);
const idModal = ref(null);
watch([limit], async () => {
  currentPage.value = 1;
  await onFetchList();
});
watch([searchManager], async () => {
  currentPage.value = 1;
  await onFetchList();
});
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    let payload;
    if (searchManager.value) {
      payload = {
        page: currentPage.value,
        limit: limit.value,
        admin_id: searchManager.value,
      };
    } else {
      payload = {
        page: currentPage.value,
        limit: limit.value,
      };
    }
    const response = await multiTenantService.getList(payload);
    if (!response?.error) {
      listMultiTenant.value = response?.data || [];
      totalPage.value = response?.total_page;
      total.value = response?.total;
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
  state.email = "";
  state.store = null;
  state.role = 3;
  state.coin = 5;
  state.manager = 0;
  state.is_active = 1;
  state.isActive = true;
  vformMultiTenant$.value.$reset();
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
  const response = await multiTenantService.getDetail(id);
  state.name = response?.full_name;
  state.email = response?.email;
  state.coin = response?.coin;
  state.role = response?.role.id;
  state.manager = response?.admin_id;
  state.is_active = response?.is_active;
  state.isActive = response?.is_active === 1 ? true : false;
  vformMultiTenant$.value.$reset();
};

let stateChangePassword = reactive({
  newPassword: null,
  confirmPassword: null,
});

const rulesChangePassword = computed(() => {
  let output = {
    newPassword: {
      required,
    },
    confirmPassword: {
      required,
      sameAs: sameAs(computed(() => stateChangePassword.newPassword)),
    },
  };
  return output;
});

let vChangePassword$ = useVuelidate(rulesChangePassword, stateChangePassword);
const idMultiTenant = ref();

const handleModalChangePassword = (id) => {
  idMultiTenant.value = id;
  Object.assign(stateChangePassword, {
    newPassword: null,
    confirmPassword: null,
  });
  vChangePassword$.value.$reset();
};

async function onSubmitPassword() {
  try {
    const result = await vChangePassword$.value.$validate();
    if (!result) return;
    let payload = {
      password: stateChangePassword.newPassword,
    };
    const response = await multiTenantService.update(idModal.value, payload);

    if (response) {
      refBtnPassword.value.click();
      onFetchList();
      return setNotify({
        title: "Success",
        message: "Update Password Success",
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

const onCloseChangePassword = () => {
  vChangePassword$.value.$reset();
};
const listManager = ref([]);
onMounted(async () => {
  await onFetchList();
  await formTenantRef.value.onFetchListAdmin();
  console.log(formTenantRef.value.optionManager);
  listManager.value = [
    { value: 0, name: "Tất cả" },
    ...formTenantRef.value.optionManager,
  ];
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
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return multiTenantService.delete(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "User has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "User is safe", "error");
      }
    });
};

async function onSubmitMultiTenant() {
  if (idModal.value) {
    await onSubmitUpdateMultiTenant();
  } else {
    await onSubmitCreateMultiTenant();
  }
}
async function confirmNew(val) {
  await onSubmitCreateMultiTenant(val);
}

const formTenantRef = ref(null);

async function onSubmitCreateMultiTenant(val) {
  try {
    const result = await vformMultiTenant$.value.$validate();
    if (!result) return;
    // let paramsStore = [];
    // paramsStore = state.store.map((item) => item.value);
    const role = ref({});
    if (state.role === 1) {
      role.value = {
        id: state.role,
      };
    } else {
      role.value = {
        id: state.role,
      };
    }
    let payload = {};
    payload = {
      full_name: state.name,
      email: state.email,
      password: state.password,
      coin: state.coin,
      role: role.value,
      provider: "email",
      turn_index: 1,
      admin_id: state.manager,
      is_active: state.is_active,
      // store_ids: JSON.stringify(paramsStore),
    };
    const response = await multiTenantService.create(payload);
    if (!response?.error) {
      onFetchList();
      formTenantRef.value.onFetchListAdmin();
      if (!val) {
        refBtn.value.click();
      }
      (state.name = ""),
        (state.email = ""),
        (state.coin = 5),
        (state.role = 3),
        (state.manager = 0),
        (state.is_active = 1),
        vformMultiTenant$.value.$reset();
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

async function onSubmitUpdateMultiTenant() {
  try {
    const result = await vformMultiTenant$.value.$validate();
    if (!result) return;
    const role = ref();
    if (state.role === 1) {
      role.value = {
        id: state.role,
      };
    } else {
      role.value = {
        id: state.role,
      };
    }
    let payload = {
      full_name: state.name,
      email: state.email,
      coin: state.coin,
      role: role.value,
      admin_id: state.manager,
      is_active: state.is_active,
    };
    const response = await multiTenantService.update(idModal.value, payload);
    if (!response?.error) {
      onFetchList();
      formTenantRef.value.onFetchListAdmin();
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

const formatDateTime = (input) => {
  if (!input) {
    return "";
  }
  const date = new Date(input);

  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const onCloseMultiTenant = () => {
  vformMultiTenant$.value.$reset();
};
</script>

<template>
  <BasePageHeading
    title="List User"
    subtitle="View and manage all your user."
    :go-back="true"
  >
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2">
          <EButton
            type="info"
            size="sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-multi-tenant"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New User</EButton
          >
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)">Manages</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">List User</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="User">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listMultiTenant"
        :ds-search-in="['id', 'name', 'email']"
      >
        <div>
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-4 py-2">
              <DatasetShow v-show="false" :dsShowEntries="100" />
              <div class="form-inline">
                <select class="form-select" style="width: 80px" v-model="limit">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>
            </div>
            <div class="col-md-4 py-2">
              <select
                id="val-manager-id"
                class="form-select"
                v-model="searchManager"
                placeholder="Select "
              >
                <option
                  v-for="(role, index) in listManager"
                  :value="role.value"
                  :key="`role-${index}`"
                >
                  {{ role.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listMultiTenant?.length">
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
                        <td style="min-width: 100px">{{ row?.id }}</td>
                        <td style="min-width: 100px">{{ row?.full_name }}</td>
                        <td style="min-width: 100px">{{ row?.email }}</td>
                        <td style="min-width: 100px">
                          {{ row?.is_active === 1 ? "Hoạt động" : "Không" }}
                        </td>
                        <td style="min-width: 100px">
                          {{ row?.total_deposit_time }}
                        </td>
                        <td style="min-width: 100px">
                          {{ row?.total_deposit_coin }}
                        </td>
                        <td style="min-width: 100px">{{ row?.coin }}</td>
                        <td style="min-width: 100px">
                          {{ row?.admin?.full_name }}
                        </td>
                        <td style="min-width: 100px">
                          {{ formatDateTime(row?.last_login) }}
                        </td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-change-password-multi-tenant"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalChangePassword(row?.id)"
                            >
                              <i class="fa fa-fw fa-rotate"></i>
                            </button>
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-multi-tenant"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalFormUpdate(row?.id)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <!-- <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="onOpenDeleteConfirm(row?.id)"
                            >
                              <i class="fa fa-fw fa-times"></i>
                            </button> -->
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
            <!-- <DatasetPager class="flex-wrap py-3 fs-sm" /> -->
            <el-pagination
              v-if="visible"
              v-model:current-page="currentPage"
              @current-change="onFetchList"
              background
              v-model:page-size="limit"
              layout="prev, pager, next"
              prev-text="Prev"
              next-text="Next"
              :total="total"
            />
          </div>
        </div>
        <EListEmpty v-if="!listMultiTenant?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form @submit.prevent="onSubmitMultiTenant">
    <EModal
      id="modal-multi-tenant"
      :title="idModal ? 'Update user' : 'Add new user'"
      :idModal="idModal"
      size="modal-xl"
      ok-text="Confirm"
      ok-text-add="Confirm & New"
      ok-type="submit"
      :close-on-submit="false"
      @confirm="() => onSubmitMultiTenant()"
      @confirmNew="(val) => confirmNew(val)"
      @closeModal="() => onCloseMultiTenant()"
    >
      <template v-slot:childrenComponent>
        <ModalFormMultiTenant
          ref="formTenantRef"
          :idModal="idModal"
          :v$="vformMultiTenant$"
          :state="state"
        />
      </template>
    </EModal>
  </form>
  <form @submit.prevent="onSubmitPassword">
    <EModal
      id="modal-change-password-multi-tenant"
      title="Change Password"
      ok-text="Change Password"
      ok-type="submit"
      :close-on-submit="false"
      :is-show-text-add="false"
      :dom-modal="domModal"
      @confirm="() => onSubmitPassword()"
      @closeModal="() => onCloseChangePassword()"
    >
      <template v-slot:childrenComponent>
        <ChangePassword :v$="vChangePassword$" :state="stateChangePassword" />
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
