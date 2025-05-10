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

const store = useTemplateStore()

// Helper variables
const cols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'Payment Ref',
    field: 'payment_ref',
    sort: ''
  },
  {
    name: 'Method',
    field: 'method',
    sort: ''
  },
  {
    name: 'Amount',
    field: 'amount',
    sort: ''
  },
  {
    name: 'SID',
    field: 'sid',
    sort: ''
  },
  {
    name: 'Order',
    field: 'order',
    sort: ''
  },
  {
    name: 'Status',
    field: 'status',
    sort: ''
  }
])

const tables = [
  {
    id: 1,
    payment_ref: 'Payment Ref 1',
    method: 'vipps 1',
    amount: '19,-kr 1',
    sid: 'Sid 1',
    order: '2023',
    status: 'Authorized'
  },
  {
    id: 2,
    payment_ref: 'Payment Ref 2',
    method: 'vipps 2',
    amount: '19,-kr 2',
    sid: 'Sid 2',
    order: '2023',
    status: 'TERMINATED'
  },
  {
    id: 3,
    payment_ref: 'Payment Ref 3',
    method: 'vipps 3',
    amount: '19,-kr 3',
    sid: 'Sid 3',
    order: '2023',
    status: 'Authorized'
  },
  {
    id: 4,
    payment_ref: 'Payment Ref 4',
    method: 'vipps 4',
    amount: '19,-kr 4',
    sid: 'Sid 4',
    order: '2023',
    status: 'TERMINATED'
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
        :ds-search-in="['id', 'payment_ref', 'method', 'amount', 'sid', 'order', 'status']"
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
                        <td :style="{ minWidth: '50px', backgroundColor: row.bgColor }">
                          {{ row.id }}
                        </td>
                        <td :style="{ minWidth: '150px', backgroundColor: row.bgColor }">
                          {{ row.payment_ref }}
                        </td>
                        <td :style="{ minWidth: '150px', backgroundColor: row.bgColor }">
                          {{ row.method }}
                        </td>
                        <td :style="{ minWidth: '150px', backgroundColor: row.bgColor }">
                          {{ row.amount }}
                        </td>
                        <td :style="{ minWidth: '150px', backgroundColor: row.bgColor }">
                          {{ row.sid }}
                        </td>
                        <td :style="{ minWidth: '50px', backgroundColor: row.bgColor }">
                          {{ row.order }}
                        </td>
                        <td :style="{ minWidth: '50px', backgroundColor: row.bgColor }">
                          {{ row.status }}
                        </td>
                        <td class="text-end" :style="{ backgroundColor: row.bgColor }">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => router.push(`users/${row.id}/update`)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-alt-secondary">
                              <i class="fa fa-fw fa-times"></i>
                            </button>
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
