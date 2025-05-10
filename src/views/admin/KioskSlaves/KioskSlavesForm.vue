<script setup>
import { printerService } from "@/services/printer.service";
import { useTemplateStore } from "@/stores/template";
import { onMounted, ref, watch } from "vue";
import { BankTerminalService } from "@/services/bank.service";
const store = useTemplateStore();

const props = defineProps([
  "v$",
  "state",
  "idModal",
  "idKiosk",
  "optionsStore",
]);

const optionBankTerminal = ref([
  { value: null, text: "Please select" },
  { value: "no_bank", text: "No bank terminal" },
]);

const { v$, state } = props;

const optionsPrint = ref([]);
const onFetchLisPrinter = async () => {
  try {
    const response = await printerService.getList({ store_id: state.store_id });
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
    label: "Dine In & Takeaway",
    value: 3,
  },
  {
    label: "Products",
    value: 4,
  },
  {
    label: "Dine in with table",
    value: 5,
  },
];

const optionScreen = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    store.pageLoader({ mode: "off" });
    state.name = "";
    state.hwid = "";
    state.screenInch = "";
    state.resetTimer = "";
    state.autoScreenOff = 0;
    state.isAutoScreenOff = false;
    state.idleTimeout = "";
    state.store_id = null;
  } catch (error) {
    store.pageLoader({ mode: "off" });
  }
});

watch(
  () => state.store_id,
  () => {
    onFetchLisPrinter(state.store_id);
    if (props.idKiosk) {
      onFetchListBankTerminal(props.idKiosk);
    }
  },
  { immediate: true, deep: true }
);

const onFetchListBankTerminal = async (idKiosk) => {
  const response = await BankTerminalService.getAll({
    store_id: state.store_id,
    kiosk_id: idKiosk,
  });
  if (!response?.error) {
    const newArray = response?.data.map((item) => ({
      value: item.id,
      text: item.id,
    }));
    optionBankTerminal.value = [
      { value: null, text: "Please select" },
      { value: "no_bank", text: "No bank terminal" },
      ...newArray,
    ];
  }
};

const isUseCash = ref(false);
const changeUseCash = () => {
  isUseCash.value = !isUseCash.value;
  state.use_cash = isUseCash.value ? 1 : 0;
};

const changeActive = () => {
  state.isAutoScreenOff = !state.isAutoScreenOff;
  state.autoScreenOff = state.isAutoScreenOff ? 1 : 0;
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
              <label class="form-label" for="block-form-name-id"
                >HWID <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-name-id"
                name="block-form-name-id"
                placeholder="Enter hwid.."
                :class="{
                  'is-invalid': v$.hwid.$errors.length,
                }"
                v-model="state.hwid"
              />
              <div
                v-if="v$.hwid.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please fill hwid
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-email-id"
                >ScreenInch <span class="text-danger">*</span></label
              >
              <input
                type="number"
                min="0"
                step="0.01"
                class="form-control"
                id="block-form-email-id"
                name="block-form-email-id"
                placeholder="Enter ScreenInch.."
                v-model="state.screenInch"
                :class="{
                  'is-invalid': v$.screenInch.$errors.length,
                }"
              />
              <div
                v-if="v$.screenInch.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please fill ScreenInch
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-name-id"
                >ResetTimer</label
              >
              <input
                type="text"
                class="form-control"
                id="block-form-name-id"
                name="block-form-name-id"
                placeholder="Enter reset timer.."
                v-model="state.resetTimer"
              />
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-email-id"
                >Auto Screen Off</label
              >
              <!-- <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="changeActive"
                  :checked="state.autoScreenOff === 1 ? true : false"
                />
              </div> -->
              <select
                id="val-screen-id"
                class="form-select"
                v-model="state.autoScreenOff"
                placeholder="Select "
              >
                <option
                  v-for="(screen, index) in optionScreen"
                  :value="screen.value"
                  :key="`screen-${index}`"
                >
                  {{ screen.label }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="form-label" for="block-form-name-id"
                >Idle Timeout</label
              >
              <input
                type="number"
                class="form-control"
                id="block-form-name-id"
                name="block-form-name-id"
                placeholder="Enter idle timeout.."
                v-model="state.idleTimeout"
              />
            </div>
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
            <div class="mb-4">
              <label class="form-label" for="val-print-id"
                >Receipt Printer</label
              >
              <select
                id="val-print-id"
                class="form-select"
                v-model="state.printer_id"
              >
                <option
                  v-for="(print, index) in optionsPrint"
                  :value="print.value"
                  :key="`print-${index}`"
                >
                  {{ print.text }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-print-id">Bank Terminal</label>
              <select
                id="val-print-id"
                class="form-select"
                v-model="state.bank_terminal"
              >
                <option
                  v-for="(print, index) in optionBankTerminal"
                  :value="print.value"
                  :key="`print-${index}`"
                >
                  {{ print.text }}
                </option>
              </select>
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
                <option
                  v-for="(type, index) in listKioskTypes"
                  :value="type.value"
                  :key="`type-${index}`"
                >
                  {{ type.label }}
                </option>
              </select>
              <div
                v-if="v$.type.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                Please select type!
              </div>
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
