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
        { value: null, text: "Please select" },
        { value: "no_printer", text: "No Printer" },
        ...newArray,
      ];
    }
  } catch (e) {
    console.log(e);
  }
};
const listKioskTypes = [
  {
    label: "Dine in",
    value: 1,
  },
  {
    label: "Takeaway",
    value: 2,
  },
  {
    label: "Dine in takeaway",
    value: 3,
  },
  {
    label: "Dine in with table",
    value: 5,
  },
];
const props = defineProps([
  "v$",
  "state",
  "id",
  "id_store",
  "idReconsultionTime",
  "optionBankTerminal",
]);
const emit = defineEmits(["handleChangeValue"]);
const { v$, state } = props;
onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    await onFetchLisPrinter(id_stores);
    store.pageLoader({ mode: "off" });
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});
const changeUseCash = () => {
  state.isUseCash = !state.isUseCash;
  state.use_cash = state.isUseCash ? 1 : 0;
};
const changeUsePhoneNumber = () => {
  state.is_required_phone_number = !state.is_required_phone_number;
};
const changeUseQR = () => {
  state.isUseQR = !state.isUseQR;
  state.use_qr = state.isUseQR ? 1 : 0;
};
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-12">
            <div class="mb-4">
              <label class="form-label" for="block-form-name"
                >Kiosk Name<span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-name"
                name="block-form-name"
                placeholder="Enter kiosk name.."
                :class="{
                  'is-invalid': v$.name.$errors.length,
                }"
                @input="
                  (e) => emit('handleChangeValue', e.target.value, 'name')
                "
                v-model="state.name"
                @blur="v$.name.$touch"
              />
              <div
                v-if="v$.name.$errors"
                class="invalid-feedback animated fadeIn"
              >
                <span
                  v-for="(itm, index) in v$.name.$errors"
                  :key="`notification-${index}`"
                >
                  <span v-if="index === 0">
                    {{
                      itm?.$validator === "minLength"
                        ? "Name kiosk should be at least 3 characters long"
                        : "Please enter name kiosk"
                    }}
                  </span>
                </span>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-table-id"
                >Kiosk Id<span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-table-id"
                name="block-form-table-id"
                placeholder="Enter id kiosk.."
                :class="{
                  'is-invalid': v$.kiosk_id.$errors.length,
                }"
                v-model="state.kiosk_id"
                @blur="v$.kiosk_id.$touch"
              />
              <div
                v-if="v$.kiosk_id.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please enter id kiosk
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-print-id"
                >Receipt Printer<span class="text-danger">*</span></label
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
                Please select a print id!
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-print-id"
                >Service call printer<span class="text-danger">*</span></label
              >
              <select
                id="val-print-id"
                class="form-select"
                :class="{
                  'is-invalid': v$.serve_printer_id.$errors.length,
                }"
                v-model="state.serve_printer_id"
                @blur="v$.serve_printer_id.$touch"
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
                v-if="v$.serve_printer_id.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please select service call printer!
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-print-id"
                >Bank Terminal<span class="text-danger">*</span></label
              >
              <select
                id="val-print-id"
                class="form-select"
                :class="{
                  'is-invalid': v$.bank_terminal.$errors.length,
                }"
                v-model="state.bank_terminal"
                @blur="v$.bank_terminal.$touch"
              >
                <option
                  v-for="(print, index) in props.optionBankTerminal"
                  :value="print.value"
                  :key="`print-${index}`"
                >
                  {{ print.text }}
                </option>
              </select>
              <div
                v-if="v$.bank_terminal.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please select a bank terminal!
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-table-id"
                >Worldline Terminal ID</label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-table-id"
                name="block-form-table-id"
                placeholder="Enter worldline terminal id.."
                v-model="state.checkout_terminal_id"
              />
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-type"
                >Alternative Payment Method</label
              >
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeUseQR"
                  :checked="state.use_qr === 1 ? true : false"
                />
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-type">Pay with cash</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeUseCash"
                  :checked="state.use_cash === 1 ? true : false"
                />
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-type">Required phone number</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeUsePhoneNumber"
                  :checked="state.is_required_phone_number"
                />
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-type"
                >Type<span class="text-danger">*</span></label
              >
              <select
                id="val-type"
                class="form-select"
                :class="{
                  'is-invalid': v$.type.$errors.length,
                }"
                v-model="state.type"
                @blur="v$.type.$touch"
              >
                <option :value="4">Products</option>
                <option disabled>-- Resturant Options below --</option>
                <option
                  v-for="(type, index) in listKioskTypes"
                  :value="type.value"
                  :key="`type-${index}`"
                >
                  {{ type.label }}
                </option>
              </select>
              <div
                v-if="v$.printer_id.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please select a print id!
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
</style>
