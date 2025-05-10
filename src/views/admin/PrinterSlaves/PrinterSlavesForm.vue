<script setup>
import { useTemplateStore } from "@/stores/template";
import { onMounted, watch } from "vue";

const store = useTemplateStore();

const props = defineProps(["v$", "state", "idModal", "optionsStore"]);

const { state } = props;

onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    store.pageLoader({ mode: "off" });
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});

watch(
  () => state.store_id,
  () => {},
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-12">
            <div class="mb-4">
              <label class="form-label" for="val-store-id">Store ID</label>
              <select
                id="val-store-id"
                class="form-select"
                v-model="state.store_id"
                placeholder="Select store"
              >
                <option
                  v-for="(store, index) in props.optionsStore"
                  :value="store.value"
                  :key="`store-${index}`"
                >
                  {{ store.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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
