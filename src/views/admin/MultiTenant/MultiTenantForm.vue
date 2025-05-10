<script setup>
import { restaurantService } from "@/services/restaurant.service";
import { useTemplateStore } from "@/stores/template";
import { onMounted, ref } from "vue";
import VueSelect from "vue-select";

const store = useTemplateStore();

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
      optionsStore.value = [...newArray];
    }
  } catch (e) {
    console.log(e);
  }
};

const props = defineProps(["v$", "state", "idModal"]);

const { v$, state } = props;

onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    // await onFetchListStore();
    store.pageLoader({ mode: "off" });
    state.email = "";
    state.password = "";
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});
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
                >Email <span class="text-danger">*</span></label
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
                Please fill email
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
