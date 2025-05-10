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
import { printerLogService } from '@/services/printerLog.service'
import EListEmpty from '@/components/Elements/EListEmpty.vue'
import { useTemplateStore } from '@/stores/template'

const store = useTemplateStore()

// Helper variables
const cols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'JOB ID',
    field: 'job_id',
    sort: ''
  },
  {
    name: 'Order Id',
    field: 'order_id',
    sort: ''
  },
  {
    name: 'Created At	',
    field: 'created_at',
    sort: ''
  },
  {
    name: 'Printer',
    field: 'printer',
    sort: ''
  }
])

const tables = [
  {
    id: 1,
    job_id: 'job_id 1',
    order_id: 'order_id 1',
    created_at: '2024-02-06 17:36:38',
    printer: 'printer 1'
  },
  {
    id: 2,
    job_id: 'job_id 2',
    order_id: 'order_id 2',
    created_at: '2024-02-06 17:36:38',
    printer: 'printer 2'
  },
  {
    id: 3,
    job_id: 'job_id 3',
    order_id: 'order_id 3',
    created_at: '2024-02-06 17:36:38',
    printer: 'printer 3'
  },
  {
    id: 4,
    job_id: 'job_id 4',
    order_id: 'order_id 4',
    created_at: '2024-02-06 17:36:38',
    printer: 'printer 4'
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

const listPrinterLogs = ref()

const onFetchList = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await printerLogService.getList({
    page: 1,
    pageSize: 10
  })

  if (!response?.error) {
    listPrinterLogs.value = response.data?.data || tables
  }
  store.pageLoader({ mode: 'off' })
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
  <BasePageHeading title="PrinterLogs">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List printer logs</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="PrinterLogs">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listPrinterLogs"
        :ds-sortby="sortBy"
        :ds-search-in="['id', 'job_id', 'order_id', 'email', 'created_at', 'printer']"
      >
        <template v-if="listPrinterLogs?.length">
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
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row }">
                      <tr>
                        <td style="min-width: 50px">{{ row.id }}</td>
                        <td style="min-width: 150px">{{ row.job_id }}</td>
                        <td style="min-width: 150px">{{ row.order_id }}</td>
                        <td style="min-width: 150px">{{ row.created_at }}</td>
                        <td style="min-width: 50px">{{ row.printer }}</td>
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
