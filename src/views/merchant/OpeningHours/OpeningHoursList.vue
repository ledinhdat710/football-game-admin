<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow
} from 'vue-dataset'
import { transactionService } from '@/services/transaction.service'
import EListEmpty from '@/components/Elements/EListEmpty.vue'
import { useTemplateStore } from '@/stores/template'
import EButton from '@/components/Elements/EButton.vue'
import FlatPicker from 'vue-flatpickr-component'

const store = useTemplateStore()

// Helper variables
const cols = reactive([
  {
    name: 'Date',
    field: 'date',
    sort: ''
  },
  {
    name: 'Day',
    field: 'day',
    sort: ''
  },
  {
    name: 'Open At',
    field: 'open_at',
    sort: ''
  },
  {
    name: 'Close At',
    field: 'close_at',
    sort: ''
  },
  {
    name: 'Closed',
    field: 'closed',
    sort: ''
  }
])

const tables = [
  {
    date: '01 February',
    day: 'Thursday',
    open_at: '09:00',
    close_at: '20:00',
    closed: false
  }
]

// Sort by functionality
const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === 'asc' ? acc.push(o.field) : acc.push('-' + o.field)
    }
    return acc
  }, [])
})

// On sort th click
function onSort(event, i) {
  let toset
  const sortEl = cols[i]

  if (!event.shiftKey) {
    cols.forEach((o) => {
      if (o.field !== sortEl.field) {
        o.sort = ''
      }
    })
  }

  if (!sortEl.sort) {
    toset = 'asc'
  }

  if (sortEl.sort === 'desc') {
    toset = event.shiftKey ? '' : 'asc'
  }

  if (sortEl.sort === 'asc') {
    toset = 'desc'
  }

  sortEl.sort = toset
}

const listTransactions = ref()

const flatPickerState = reactive({
  configTimeStandalone: {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'h:i K'
  }
})

const onFetchList = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await transactionService.getList({
    page: 1,
    pageSize: 10
  })

  if (!response?.error) {
    const newTables = tables.map((item) => ({
      ...item,
      bgColor: item.status === 'Authorized' ? '#D8EDD9' : '#FFBDB8'
    }))
    listTransactions.value = response.data?.data || newTables
  }
  store.pageLoader({ mode: 'off' })
}

const handleReset = () => {
  console.log('reset')
}

const handleChangePicker = (time) => {
  console.log(time)
}

// Apply a few Bootstrap 5 optimizations
onMounted(async () => {
  await onFetchList()

  // Remove labels from
  document.querySelectorAll('#datasetLength label').forEach((el) => {
    el.remove()
  })

  // Replace select classes
  let selectLength = document.querySelector('#datasetLength select')

  if (selectLength) {
    selectLength.classList = ''
    selectLength.classList.add('form-select')
    selectLength.style.width = '80px'
  }
})
</script>

<template>
  <BasePageHeading title="Transactions">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List transactions</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Transactions">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listTransactions"
        :ds-sortby="sortBy"
        :ds-search-in="['date', 'day', 'close_at', 'open_at', 'closed_at']"
      >
        <template v-if="listTransactions?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th
                        v-for="(th, index) in cols"
                        :key="th.field"
                        :class="['sort', th.sort]"
                        @click="onSort($event, index)"
                      >
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </th>
                      <th class="text-end" scope="col">Action</th>
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row }">
                      <tr>
                        <td style="min-width: 50px">{{ row.date }}</td>
                        <td style="min-width: 150px">{{ row.day }}</td>
                        <td style="min-width: 150px">
                          <FlatPicker
                            id="flat-picker-time-standalone"
                            class="form-control"
                            v-model="row.open_at"
                            :config="flatPickerState.configTimeStandalone"
                            style="width: 100px"
                            @on-change="(e) => handleChangePicker(e[0])"
                          />
                        </td>
                        <td style="min-width: 150px">
                          <FlatPicker
                            id="flat-picker-time-standalone"
                            class="form-control"
                            v-model="row.close_at"
                            :config="flatPickerState.configTimeStandalone"
                            style="width: 100px"
                            @on-change="(e) => handleChangePicker(e[0])"
                          />
                        </td>
                        <td style="min-width: 150px">
                          <div class="form-check form-switch">
                            <input
                              :style="{ opacity: 1 }"
                              class="form-check-input"
                              type="checkbox"
                              :checked="row.closed"
                              disabled
                            />
                          </div>
                        </td>
                        <td style="min-width: 50px" class="text-end">
                          <div class="form-check form-switch">
                            <EButton type="info" size="sm" @click="handleReset">Reset</EButton>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </DatasetItem>
                </table>
              </div>
            </div>
          </div>
          <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
            <DatasetInfo class="py-3 fs-sm" />
            <DatasetPager class="flex-wrap py-3 fs-sm" /></div
        ></template>

        <EListEmpty v-else />
      </Dataset>
    </BaseBlock>
  </div>
</template>

<style lang="scss">
@import 'flatpickr/dist/flatpickr.css';
@import '@/assets/scss/vendor/flatpickr';
</style>

<style lang="scss" scoped>
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
  content: '';
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
