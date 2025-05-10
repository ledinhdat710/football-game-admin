<script setup>
import EButton from "@/components/Elements/EButton.vue";
import EIcon from "@/components/Elements/EIcon.vue";
import users from "@/data/usersDataset.json";
import { reactive } from "vue";
import { Dataset, DatasetItem } from "vue-dataset";
const colsTransactions = reactive([
  {
    name: "ID",
    field: "id",
  },
  {
    name: "Amount",
    field: "amount",
  },
  {
    name: "Order",
    field: "order",
  },
  {
    name: "Status",
    field: "status",
  },
]);
</script>

<template>
  <BasePageHeading title="Dashboard">
  </BasePageHeading>
  <div class="content">
    <div class="row">
      <div class="col-12 col-md-4">
        <BaseBlock title="Dagens salg">
          <div class="d-flex align-items-start justify-content-start space-x-3 mb-3">
            <e-button type="warning" size="lg" class="mt-1">
              <e-icon name="circle-dollar-to-slot" />
            </e-button>
            <div>
              <div class="fw-bold fs-3 text-dual">00.00-kr</div>
              <div class="text-muted fs-sm">0 Totale bestillinger</div>
            </div>
          </div>
        </BaseBlock>
      </div>
      <div class="col-12 col-md-4">
        <BaseBlock title="Active Device">
          <div class="d-flex align-items-start justify-content-start space-x-3 mb-3">
            <e-button type="warning" size="lg" class="mt-1">
              <e-icon name="computer" />
            </e-button>
            <div>
              <div class="fw-bold fs-3 text-dual">0</div>
              <div class="text-muted fs-sm">Last update 10 seconds ago</div>
            </div>
          </div>
        </BaseBlock>
      </div>
      <div class="col-12 col-md-4">
        <BaseBlock title="SMS">
          <div class="d-flex align-items-start justify-content-start space-x-3 mb-3">
            <e-button type="warning" size="lg" class="mt-1">
              <e-icon name="comment-sms" />
            </e-button>
            <div>
              <div class="fw-bold fs-3 text-dual">0</div>
              <div class="text-muted fs-sm">Sent</div>
            </div>
          </div>
        </BaseBlock>
      </div>
      <div class="col-12 col-md-4">
        <BaseBlock title="Recent Transactions">
          <template #subtitle>
            <div><small>Last update 10 seconds ago</small></div>
          </template>
          <Dataset
              :ds-data="users"
              :ds-search-in="['name', 'email', 'company', 'birthdate']"
          >
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-striped mb-0">
                    <thead>
                    <tr>
                      <th
                          v-for="th in colsTransactions"
                          :key="th.field"
                          :class="['sort']"
                      >
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </th>
                    </tr>
                    </thead>
                    <DatasetItem tag="tbody" class="fs-sm">
                      <template #default="{ row, rowIndex }">
                        <tr>
                          <th scope="row">{{ rowIndex + 1 }}</th>
                          <td style="min-width: 150px">{{ row.name }}</td>
                          <td style="min-width: 80px;">{{ row.email }}</td>
                          <td style="max-width: 80px;">{{ row.company }}</td>
                        </tr>
                      </template>
                    </DatasetItem>
                  </table>
                </div>
              </div>
            </div>
          </Dataset>
        </BaseBlock>
      </div>
      <div class="col-12 col-md-4">
        <BaseBlock title="Recent Orders">
          <template #subtitle>
            <div><small>Showing10 out of 1446 orders</small></div>
          </template>
          <Dataset
              :ds-data="users"
              :ds-search-in="['name', 'email', 'company', 'birthdate']"
          >
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-striped mb-0">
                    <thead>
                    <tr>
                      <th
                          v-for="th in colsTransactions"
                          :key="th.field"
                          :class="['sort']"
                      >
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </th>
                    </tr>
                    </thead>
                    <DatasetItem tag="tbody" class="fs-sm">
                      <template #default="{ row, rowIndex }">
                        <tr>
                          <th scope="row">{{ rowIndex + 1 }}</th>
                          <td style="min-width: 150px">{{ row.name }}</td>
                          <td style="min-width: 80px;">{{ row.email }}</td>
                          <td style="max-width: 80px;">{{ row.company }}</td>
                        </tr>
                      </template>
                    </DatasetItem>
                  </table>
                </div>
              </div>
            </div>
          </Dataset>
        </BaseBlock>
      </div>
      <div class="col-12 col-md-4">
        <BaseBlock title="Kiosik Devices">
          <template #subtitle>
            <div><small>Registered Screens</small></div>
          </template>
          <Dataset
              :ds-data="users"
              :ds-search-in="['name', 'email', 'company', 'birthdate']"
          >
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-striped mb-0">
                    <thead>
                    <tr>
                      <th
                          v-for="th in colsTransactions"
                          :key="th.field"
                          :class="['sort']"
                      >
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </th>
                    </tr>
                    </thead>
                    <DatasetItem tag="tbody" class="fs-sm">
                      <template #default="{ row, rowIndex }">
                        <tr>
                          <th scope="row">{{ rowIndex + 1 }}</th>
                          <td style="min-width: 150px">{{ row.name }}</td>
                          <td style="min-width: 80px;">{{ row.email }}</td>
                          <td style="max-width: 80px;">{{ row.company }}</td>
                        </tr>
                      </template>
                    </DatasetItem>
                  </table>
                </div>
              </div>
            </div>
          </Dataset>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>