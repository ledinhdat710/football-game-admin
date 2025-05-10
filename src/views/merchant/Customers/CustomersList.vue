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
import { customerService } from '@/services/customer.service'
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
    name: 'Name',
    field: 'name',
    sort: ''
  },
  {
    name: 'Phone',
    field: 'phone',
    sort: ''
  },
  {
    name: 'Email',
    field: 'email',
    sort: ''
  },
  {
    name: 'SID',
    field: 'sid',
    sort: ''
  },
  {
    name: 'Orders',
    field: 'orders',
    sort: ''
  }
])

const tables = [
  {
    id: 1,
    name: 'Name 1',
    phone: 'Phone 1',
    email: 'Email 1',
    sid: 'Sid 1',
    orders: 'Order 1'
  },
  {
    id: 2,
    name: 'Name 2',
    phone: 'Phone 2',
    email: 'Email 2',
    sid: 'Sid 2',
    orders: 'Order 2'
  },
  {
    id: 3,
    name: 'Name 3',
    phone: 'Phone 3',
    email: 'Email 3',
    sid: 'Sid 3',
    orders: 'Order 3'
  },
  {
    id: 4,
    name: 'Name 4',
    phone: 'Phone 4',
    email: 'Email 4',
    sid: 'Sid 4',
    orders: 'Order 4'
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

const listCustomers = ref()

const onFetchList = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await customerService.getList({
    page: 1,
    pageSize: 10
  })

  if (!response?.error) {
    listCustomers.value = response.data?.data || tables
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
  <BasePageHeading title="Customers">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List customers</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Customers">
      <Dataset
        v-slot="{ ds }"
        :ds-data="listCustomers"
        :ds-sortby="sortBy"
        :ds-search-in="['id', 'name', 'phone', 'email', 'sid', 'orders']"
      >
        <template v-if="listCustomers?.length">
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
                        <td style="min-width: 150px">{{ row.name }}</td>
                        <td style="min-width: 150px">{{ row.phone }}</td>
                        <td style="min-width: 150px">{{ row.email }}</td>
                        <td style="min-width: 150px">{{ row.sid }}</td>
                        <td style="min-width: 50px">{{ row.orders }}</td>
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
