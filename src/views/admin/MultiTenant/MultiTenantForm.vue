<script setup>
import { restaurantService } from "@/services/restaurant.service";
import { useTemplateStore } from "@/stores/template";
import { onMounted, ref, defineExpose } from "vue";
import VueSelect from "vue-select";
import { multiTenantService } from "@/services/multiTenant.service";

const store = useTemplateStore();

const optionManager = ref([]);
const onFetchListAdmin = async () => {
  try {
    const response = await multiTenantService.getList({
      role_id: 6,
    });
    if (response?.data) {
      const newArray = response?.data.map((item) => ({
        value: item.id,
        name: item.full_name,
      }));
      optionManager.value = [...newArray];
    }
  } catch (e) {
    console.log(e);
  }
};

const user = JSON.parse(localStorage.getItem("user"));
const optionRole = ref([]);

if (user.role_id === 1) {
  optionRole.value = [
    {
      value: 1,
      label: "Admin",
    },
    {
      value: 3,
      label: "User",
    },
    {
      value: 6,
      label: "Manager",
    },
  ];
} else {
  optionRole.value = [
    {
      value: 3,
      label: "User",
    },
  ];
}

const props = defineProps(["v$", "state", "idModal"]);

const { v$, state } = props;

const isActive = ref(false);
const changeActive = () => {
  state.isActive = !state.isActive;
  state.is_active = state.isActive ? 1 : 0;
};

onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    // await onFetchListStore();
    store.pageLoader({ mode: "off" });
    await onFetchListAdmin();
    state.email = "";
    state.password = "";
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});
defineExpose({ onFetchListAdmin });
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-12">
            <div class="mb-4">
              <label class="form-label" for="block-form-name-id"
                >Name <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-name-id"
                name="block-form-name-id"
                placeholder="Enter name.."
                :class="{
                  'is-invalid': v$.name.$errors.length,
                }"
                v-model="state.name"
              />
              <div
                v-if="v$.name.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please fill name
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-email-id"
                >User Name <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-email-id"
                name="block-form-email-id"
                placeholder="Enter email.."
                :class="{
                  'is-invalid': v$.email.$errors.length,
                }"
                v-model="state.email"
              />
              <div
                v-if="v$.email.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please fill user name
              </div>
            </div>
            <div class="mb-4" v-if="!idModal">
              <label class="form-label" for="block-form-password-id"
                >Password <span class="text-danger">*</span></label
              >
              <input
                type="password"
                class="form-control"
                id="block-form-password-id"
                name="block-form-password-id"
                placeholder="Enter password.."
                autocomplete="off"
                v-model="state.password"
              />
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-password-id"
                >Role <span class="text-danger">*</span></label
              >
              <select
                id="val-role-id"
                class="form-select"
                v-model="state.role"
                placeholder="Select "
              >
                <option
                  v-for="(role, index) in optionRole"
                  :value="role.value"
                  :key="`role-${index}`"
                >
                  {{ role.label }}
                </option>
              </select>
            </div>
            <div class="mb-4" v-if="state.role === 3">
              <label class="form-label" for="block-form-password-id"
                >Manager</label
              >
              <select
                id="val-role-id"
                class="form-select"
                v-model="state.manager"
                placeholder="Select "
              >
                <option
                  v-for="(role, index) in optionManager"
                  :value="role.value"
                  :key="`role-${index}`"
                >
                  {{ role.name }}
                </option>
              </select>
            </div>
            <div class="mb-4" v-if="state.role === 3">
              <label class="form-label" for="block-form-password-id"
                >Coin <span class="text-danger"></span
              ></label>
              <input
                :disabled="!idModal"
                type="number"
                class="form-control"
                id="block-form-coin-id"
                name="block-form-coin-id"
                placeholder="Enter coin.."
                autocomplete="off"
                v-model="state.coin"
              />
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-type">Active User</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeActive"
                  :checked="state.is_active === 1 ? true : false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
.icon_arrow_left {
  background-color: rgb(243, 235, 235);
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error {
  width: 100%;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: var(--bs-form-invalid-color);
}
</style>
