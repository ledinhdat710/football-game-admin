<script setup>
import { onMounted, reactive, ref } from "vue";
import { Dataset, DatasetItem } from "vue-dataset";
import EListEmpty from "@/components/Elements/EListEmpty.vue";
import { dashBoardService } from "@/services/dashboard.service";
import { computed, watch } from "vue";
import moment from "moment";
import FlatPickr from "vue-flatpickr-component";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();

const cols = reactive([
  {
    name: "STT",
    field: "index",
    sort: "",
  },
  {
    name: "Name Store",
    field: "name_stores",
    sort: "",
  },
  {
    name: "Revenue",
    field: "revenue",
    sort: "",
  },
  {
    name: "SMS Sendt",
    field: "cost_sms",
    sort: "",
  },
]);

const listDashBoard = ref();
const dateRange = ref(defaultDateRange());
const configRange = ref({
  mode: "range",
  locale: {
    firstDayOfWeek: 1,
  },
});

const onFetchList = async () => {
  let start_date;
  let end_date;
  const dates = [];
  if (dateRange.value?.includes("to")) {
    const [startDateString, endDateString] = dateRange.value.split(" to ");
    start_date = moment(startDateString, "YYYY-MM-DD");
    end_date = moment(endDateString, "YYYY-MM-DD");
    let currentDate = moment(startDateString, "YYYY-MM-DD").clone();
    while (
      currentDate.isSameOrBefore(moment(endDateString, "YYYY-MM-DD"), "day")
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }
  }
  store.pageLoader({ mode: "on" });
  const response = await dashBoardService.getList({
    start_date: start_date?._i,
    end_date: end_date?._i,
  });
  store.pageLoader({ mode: "off" });
  if (!response?.error) {
    listDashBoard.value = response.data || [];
  }
};

watch(dateRange, async () => {
  if (dateRange.value?.includes("to")) {
    await onFetchList();
  }
});

function defaultDateRange() {
  const startDate = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endDate = moment().endOf("isoWeek").format("YYYY-MM-DD");
  return `${startDate} to ${endDate}`;
}

const itemData = computed(() => {
  return listDashBoard.value.store_data;
});

onMounted(async () => {
  // await onFetchList();
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });
  let selectLength = document.querySelector("#datasetLength select");
  if (selectLength) {
    selectLength.classList = "";
    selectLength.classList.add("form-select");
    selectLength.style.width = "80px";
  }
});
</script>

<template>
  <BasePageHeading title="Dashboard"> </BasePageHeading>
  <div class="content">
    Welcome
    <!-- <div class="row">
      <div class="col-12 col-md-6">
        <BaseBlock title="Total revenue">
          <div
            class="d-flex align-items-start justify-content-start space-x-3 mb-3"
          >
            <div class="fw-bold fs-3 text-dual">
              {{ Number(listDashBoard?.total_incomes).toFixed(2) + ",-kr" }}
            </div>
          </div>
        </BaseBlock>
      </div>
      <div class="col-12 col-md-6">
        <BaseBlock title="Total SMS">
          <div
            class="d-flex align-items-start justify-content-start space-x-3 mb-3"
          >
            <div>
              <div class="d-flex align-items-center fw-bold fs-3 text-dual">
                {{ listDashBoard?.total_sms + " sms" }}
              </div>
            </div>
          </div>
        </BaseBlock>
      </div>
    </div>
    <BaseBlock>
      <div class="row">
        <div class="col-md-4 py-2">
          <FlatPickr
            class="form-control"
            id="example-flatpickr-range"
            placeholder="Select Date Range"
            v-model="dateRange"
            :config="configRange"
          />
        </div>
      </div>
      <hr />
      <Dataset
        v-if="listDashBoard && listDashBoard.store_data"
        :ds-data="itemData"
      >
        <div v-show="itemData?.length">
          <div class="row">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th
                        v-for="th in cols"
                        :key="th.field"
                        :class="['sort', th.sort]"
                      >
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </th>
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row, index }">
                      <tr>
                        <td>{{ index + 1 }}</td>
                        <td>{{ row.name }}</td>
                        <td>
                          {{
                            (
                              Number(row?.total_income) -
                              Number(row?.total_refund)
                            ).toFixed(2) + ",-kr"
                          }}
                        </td>
                        <td>{{ row.total_sms }}</td>
                      </tr>
                    </template>
                  </DatasetItem>
                </table>
              </div>
            </div>
          </div>
        </div>
        <EListEmpty v-if="!itemData?.length" />
      </Dataset>
    </BaseBlock> -->
  </div>
</template>
<style lang="scss">
@import "flatpickr/dist/flatpickr.css";
@import "@/assets/scss/vendor/flatpickr";
</style>
