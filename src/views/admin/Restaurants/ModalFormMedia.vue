<script setup>
import { useTemplateStore } from "@/stores/template";
import { onMounted, watch, ref } from "vue";
const store = useTemplateStore();

const props = defineProps(["v$", "state", "idModal"]);

const { v$, state } = props;

onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    store.pageLoader({ mode: "off" });
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});

const inputFile = ref(null);

watch(
  () => state,
  () => {
    if (state.media === null) {
      const fileInput = document.getElementById("inputFile");
      if (fileInput) {
        fileInput.value = "";
      }
    }
  },
  { immediate: true, deep: true }
);

const changeActive = () => {
  state.active = !state.active;
  state.isActive = state.active ? 1 : 0;
};

const changeDefault = () => {
  state.default = !state.default;
  state.isDefault = state.default ? 1 : 0;
};

const uploadFile = (e) => {
  console.log(e);
  let file = e.target.files ? e.target.files : null;
  state.media = file[0];
};

const removeFile = () => {
  state.media = null;
};
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
                >Media <span class="text-danger">*</span></label
              >
              <input
                v-if="!state.media || typeof state.media !== 'string'"
                type="file"
                class="form-control"
                id="inputFile"
                ref="inputFile"
                :class="{
                  'is-invalid': v$.media.$errors.length,
                }"
                name="block-form-email-id"
                placeholder="Upload media.."
                @change="uploadFile($event)"
                format="DD/MM"
              />
              <div v-if="state.media && typeof state.media === 'string'">
                <a class="preview" :href="state.media" target="_blank"
                  >See preview</a
                >
                <i
                  @click="removeFile"
                  class="fa-solid fa-xmark"
                  style="color: red; margin-left: 10px"
                ></i>
              </div>
              <div
                v-if="v$.media.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please upload media
              </div>
            </div>
            <div class="mb-4" v-if="!state.default">
              <label class="form-label" for="block-form-email-id"
                >Start Idle <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-email-id"
                name="block-form-email-id"
                :class="{
                  'is-invalid': v$.startIdle.$errors.length,
                }"
                v-model="state.startIdle"
                placeholder="Please fill start idle format MM-DD"
              />
              <div
                v-if="v$.startIdle.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please fill start idle
              </div>
            </div>
            <div class="mb-4" v-if="!state.default">
              <label class="form-label" for="block-form-email-id"
                >End Idle <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-email-id"
                name="block-form-email-id"
                :class="{
                  'is-invalid': v$.endIdle.$errors.length,
                }"
                v-model="state.endIdle"
                placeholder="Please fill end idle format MM-DD"
              />
              <div
                v-if="v$.endIdle.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please fill end idle
              </div>
            </div>
            <div class="mb-4" v-if="!state.default">
              <label class="form-label" for="block-form-email-id"
                >Is Active</label
              >
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeActive"
                  :checked="state.isActive === 1 ? true : false"
                />
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-email-id"
                >Is Default</label
              >
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeDefault"
                  :checked="state.isDefault === 1 ? true : false"
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
@import "dropzone/dist/dropzone.css";
@import "@/assets/scss/vendor/dropzone";
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

.preview {
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
}
</style>
