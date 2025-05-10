<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EIcon from "@/components/Elements/EIcon.vue";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import EModal from "@/components/Elements/EModal.vue";
import useNotify from "@/composables/useNotify";
import { userService } from "@/services/user.service";
import { useTemplateStore } from "@/stores/template";
import ModalFormUser from "@/views/admin/Restaurants/ModalFormUser.vue";
import useVuelidate from "@vuelidate/core";
import { email, minLength, required, sameAs } from "@vuelidate/validators";
import Swal from "sweetalert2";
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  Dataset,
  DatasetInfo,
  DatasetItem,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import { useRoute, useRouter } from "vue-router";
import ChangePassword from "./ChangePassword.vue";

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
const idUser = ref(null);
const refBtn = ref(null);
const refBtnPassword = ref(null);
const domModal = ref("changePassword");
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
  refBtnPassword.value = document.getElementById("closeModal" + domModal.value);
});

let state = reactive({
  name: null,
  roles: null,
  email: null,
  password: null,
});

let rules = computed(() => {
  let output = {
    name: {
      required,
      minLength: minLength(3),
    },
    roles: {
      required,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  };
  return output;
});
let vformUser$ = useVuelidate(rules, state);

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

// Helper variables
const cols = reactive([
  {
    name: "Id",
    field: "id",
    sort: "",
  },
  {
    name: "Name",
    field: "name",
    sort: "",
  },
  {
    name: "Role",
    field: "role",
    sort: "",
  },
  {
    name: "Email",
    field: "email",
    sort: "",
  },
]);

const listUsers = ref([]);
const idModal = ref();
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: "on" });
    const response = await userService.getList({
      store_id: id,
      limit: -1,
    });
    if (!response?.error) {
      listUsers.value = response?.data?.data;
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
  state.roles = null;
  state.email = null;
  state.password = null;
  vformUser$.value.$reset();
};
const handleModalFormUpdate = async (id) => {
  idModal.value = id;
  await apiGetPrinter(id);
};
const handleModalChangePassword = (id) => {
  idUser.value = id;
  Object.assign(stateChangePassword, {
    newPassword: null,
    confirmPassword: null,
  });
  vChangePassword$.value.$reset();
};
const apiGetPrinter = async (id) => {
  try {
    const response = await userService.get(id);
    state.name = response.data?.user?.name;
    state.roles = response.data.roles;
    state.email = response.data?.user?.email;
    state.password = response.data?.roles || [];
    vformUser$.value.$reset();
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

watch(
  () => idModal.value,
  () => {
    if (idModal.value) {
      rules = computed(() => {
        let output = {
          name: {
            required,
            minLength: minLength(3),
          },
          roles: {
            required,
          },
          email: {
            required,
            email,
          },
        };
        return output;
      });
    }
  }
);

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
        return userService.delete(id);
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire("Deleted!", "Kiosk has been deleted.", "success");
        onFetchList();
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "User is safe", "error");
      }
    });
};

const onSubmitUser = async () => {
  if (idModal.value) {
    await onSubmitUpdateUser();
  } else {
    await onSubmitCreateUser();
  }
};

async function confirmNew(val) {
  await onSubmitCreateUser(val);
}

const onSubmitCreateUser = async (val) => {
  try {
    const result = await vformUser$.value.$validate();
    if (!result) return;
    let payload = {
      name: state.name,
      email: state.email,
      password: state.password,
      roles: state.roles,
      store_id: id,
    };
    const response = await userService.create(payload);
    if (!response?.error) {
      onFetchList();
      if (!val) {
        refBtn.value.click();
      }
      state.name = null;
      state.roles = null;
      state.email = null;
      state.passwor = null;
      vformUser$.value.$reset();
      return setNotify({
        title: "Success",
        message: "Create user success",
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

const onSubmitUpdateUser = async () => {
  try {
    const result = await vformUser$.value.$validate();
    if (!result) return;
    let payload = {
      name: state.name,
      email: state.email,
      roles: state.roles,
      store_id: id,
    };
    const response = await userService.update(idModal.value, payload);
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

async function onSubmitPassword() {
  try {
    const result = await vChangePassword$.value.$validate();
    if (!result) return;
    let payload = {
      new_password: stateChangePassword.newPassword,
      new_password_confirmation: stateChangePassword.confirmPassword,
      user_id: idUser.value,
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
    return setNotify({
      title: "Error",
      message: response?.message,
    });
  } catch (e) {
    return setNotify({
      title: "Error",
      message: e?.message,
    });
  }
}
const navigateRestaurent = () => {
  router.push(`/admin/restaurants`);
};
</script>

<template>
  <BasePageHeading
    title="User Detail"
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
            data-bs-target="#modal-user"
            data-target=".bd-example-modal-lg"
            @click="() => handleModalForm()"
            ><i class="fa fa-plus opacity-50 me-1"></i> New User</EButton
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
            <li class="breadcrumb-item" aria-current="page">List User</li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Users">
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
        :ds-data="listUsers"
        :ds-search-in="['id', 'name']"
      >
        <div v-show="listUsers?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listUsers?.length">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th v-for="th in cols" :key="th.field">
                        {{ th?.name }}
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
                        <td style="min-width: 150px">{{ row?.name }}</td>
                        <td style="min-width: 150px">
                          {{
                            row?.roles?.map((item) => item?.name)?.join(", ")
                          }}
                        </td>
                        <td style="min-width: 150px">{{ row?.email }}</td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-change-password"
                              title="change password"
                              data-target=".bd-example-modal-lg"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalChangePassword(row?.id)"
                            >
                              <i class="fa fa-fw fa-rotate"></i>
                            </button>
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-user"
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
        <EListEmpty v-if="!listUsers?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitUser">
    <EModal
      id="modal-user"
      :title="idModal ? 'Update user' : 'Add new user'"
      :idModal="idModal"
      size="modal-xl"
      ok-type="submit"
      ok-text-add="Confirm & New"
      :close-on-submit="false"
      @confirm="() => onSubmitUser()"
      @confirmNew="(val) => confirmNew(val)"
    >
      <template v-slot:childrenComponent>
        <ModalFormUser :id="idModal" :v$="vformUser$" :state="state" />
      </template>
    </EModal>
  </form>
  <form v-if="!!id" @submit.prevent="onSubmitPassword">
    <EModal
      id="modal-change-password"
      title="Change Password"
      ok-text="Change Password"
      ok-type="submit"
      :close-on-submit="false"
      :is-show-text-add="false"
      :dom-modal="domModal"
      @confirm="() => onSubmitPassword()"
    >
      <template v-slot:childrenComponent>
        <ChangePassword :v$="vChangePassword$" :state="stateChangePassword" />
      </template>
    </EModal>
  </form>
</template>

<style lang="scss">
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
