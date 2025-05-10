<script setup>
import { printerService } from "@/services/printer.service";
import { useTemplateStore } from "@/stores/template";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const store = useTemplateStore();
const id_stores = route.params?.id;

const optionsPrint = ref([]);
const onFetchLisPrinter = async (id) => {
  try {
    const response = await printerService.getList({ store_id: id });
    if (!response?.error) {
      const newArray = response.data?.data.map((item) => ({
        value: item.id,
        text: item.name,
      }));
      optionsPrint.value = [
        { value: "", text: "Please select" },
        { value: "no_printer", text: "No Printer" },
        ...newArray,
      ];
    }
  } catch (e) {
    console.log(e);
  }
};
const optionsLanguage = ref([
  { value: "", text: "Please select language" },
  { value: "nor", text: "nor" },
  { value: "en", text: "en" },
]);

const props = defineProps(["v$", "state", "id", "id_store"]);

const { v$, state } = props;

const validateLengthPinCode = ref(false);

const changePinCode = () => {
  if (state.use_pin === 1) {
    if (state.pin_code.length < 4) {
      validateLengthPinCode.value = true;
    } else {
      validateLengthPinCode.value = false;
    }
  } else {
    validateLengthPinCode.value = false;
  }
  console.log(validateLengthPinCode.value);
};
onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    await onFetchLisPrinter(id_stores);
    store.pageLoader({ mode: "off" });
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});
const changeUsePin = () => {
  state.isUsePin = !state.isUsePin;
  state.use_pin = state.isUsePin ? 1 : 0;
  if (state.use_pin === 0) {
    validateLengthPinCode.value = false;
  }
};
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-12">
            <div class="mb-4">
              <label class="form-label" for="val-type">Use pin</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeUsePin"
                  :checked="state.use_pin === 1 ? true : false"
                />
              </div>
            </div>
            <div class="mb-4" v-if="state.use_pin === 1">
              <label class="form-label" for="block-form-table-id"
                >Pin Code</label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-table-id"
                name="block-form-table-id"
                placeholder="Enter pin code.."
                onkeypress="return (event.which == 8 || event.which == 0 || event.which == 13) ? null : event.which >= 48 && event.which <= 57"
                maxlength="4"
                v-model="state.pin_code"
                @keyup="changePinCode"
              />
              <div class="error" v-if="validateLengthPinCode">
                Please fill in all four characters for the pin code
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-table-id"
                >Language<span class="text-danger">*</span></label
              >
              <select
                id="val-print-id"
                class="form-select"
                :class="{
                  'is-invalid': v$.language.$errors.length,
                }"
                v-model="state.language"
                @blur="v$.language.$touch"
              >
                <option
                  v-for="(language, index) in optionsLanguage"
                  :value="language.value"
                  :key="`language-${index}`"
                >
                  {{ language.text }}
                </option>
              </select>
              <div
                v-if="v$.language.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please select language
              </div>
            </div>
            <div>
              <label
                style="color: red"
                class="form-label"
                for="block-form-table-id"
                >Supported variables: {$order_no} ${receipt}</label
              >
            </div>
            <div class="mb-4">
              <label
                style="color: red"
                class="form-label"
                for="block-form-table-id"
                >${$store_name} ${order_nr}</label
              >
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-table-id"
                >Receive SMS</label
              >
              <textarea
                type="text-area"
                class="form-control"
                id="form-slogan"
                placeholder="Enter receive sms.."
                v-model="state.receive_sms"
              ></textarea>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-table-id"
                >Complete SMS</label
              >
              <textarea
                type="text-area"
                class="form-control"
                id="form-slogan"
                placeholder="Enter complete sms.."
                v-model="state.complete_sms"
              ></textarea>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-print-id"
                >Printer ID<span class="text-danger">*</span></label
              >
              <select
                id="val-print-id"
                class="form-select"
                :class="{
                  'is-invalid': v$.printer_id.$errors.length,
                }"
                v-model="state.printer_id"
                @blur="v$.printer_id.$touch"
              >
                <option
                  v-for="(print, index) in optionsPrint"
                  :value="print.value"
                  :key="`print-${index}`"
                >
                  {{ print.text }}
                </option>
              </select>
              <div
                v-if="v$.printer_id.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please select a printer id!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
