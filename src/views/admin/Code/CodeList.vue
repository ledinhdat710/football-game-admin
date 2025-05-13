<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { codeService } from "@/services/code.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormCode from "@/views/admin/Code/CodeFormCreate.vue";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
import { userService } from "@/services/user.service";
import Swal from "sweetalert2";
import { computed, onMounted, reactive, ref } from "vue";
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
let state = reactive({
  code: "",
  value: null,
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
    code: {
      required,
    },
    value: {
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
    name: "Code",
    field: "Code",
    sort: "",
  },
  {
    name: "Value",
    field: "Value",
    sort: "",
  },
  {
    name: "User",
    field: "User",
    sort: "",
  },
]);

const listMultiTenant = ref([]);
const idModal = ref(null);
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await codeService.getList({
      page: 1,
      limit: 10,
    });
    if (!response?.error) {
      listMultiTenant.value = response?.data || [];
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: "off" });
  }
};

const handleModalForm = async () => {
  idModal.value = undefined;
  state.code = "";
  state.value = null;
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
  const response = await codeService.getDetail(id);
  state.code = response?.code;
  state.value = response?.value;
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

async function onSubmitPassword() {
  try {
    const result = await vChangePassword$.value.$validate();
    if (!result) return;
    let payload = {
      new_password: stateChangePassword.newPassword,
      new_password_confirmation: stateChangePassword.confirmPassword,
      user_id: idMultiTenant.value,
    };

    const response = await userService.changePassword(payload);
    if (!response?.error) {
      refBtnPassword.value.click();
      return setNotify({
        title: "Success",
        message: response?.message,
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

async function onSubmitCreateMultiTenant(val) {
  try {
    const result = await vformMultiTenant$.value.$validate();
    if (!result) return;
    let payload = {};
    payload = {
      code: state.code,
      value: state.value,
      // store_ids: JSON.stringify(paramsStore),
    };
    const response = await codeService.create(payload);
    if (!response?.error) {
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      (state.code = ""), (state.value = null), vformMultiTenant$.value.$reset();
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
        name: "Admin",
      };
    } else {
      role.value = {
        id: state.role,
        name: "User",
      };
    }
    let payload = {
      full_name: state.name,
      email: state.email,
      coin: state.coin,
      role: role.value,
    };
    const response = await codeService.update(idModal.value, payload);
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

const onCloseMultiTenant = () => {
  vformMultiTenant$.value.$reset();
};
</script>

<template>
  <BasePageHeading
    title="List Code"
    subtitle="View and manage all your code."
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
            ><i class="fa fa-plus opacity-50 me-1"></i> New Code</EButton
          >
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)">Manages</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">List Code</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Code">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listMultiTenant"
        :ds-search-in="['id', 'code']"
      >
        <div v-show="listMultiTenant?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
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
                      <!-- <th class="text-end" scope="col">Action</th> -->
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row }">
                      <tr>
                        <td style="min-width: 100px">{{ row?.id }}</td>
                        <td style="min-width: 150px">{{ row?.code }}</td>
                        <td style="min-width: 150px">{{ row?.value }}</td>
                        <td style="min-width: 150px">
                          {{ row?.user?.full_name }}
                        </td>
                        <!-- <td class="text-end">
                          <div class="btn-group">
                          
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-multi-tenant"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalFormUpdate(row?.id)"
                            >
                              <i class="fa fa-fw fa-eye"></i>
                            </button>
                         
                          </div>
                        </td> -->
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
        <ModalFormCode
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
