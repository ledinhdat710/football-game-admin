<script setup>
import { useRouter } from 'vue-router'
import { reactive, computed, onMounted } from 'vue'
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow
} from 'vue-dataset'
import EButton from '@/components/Elements/EButton.vue'

const router = useRouter()

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
    name: 'Role',
    field: 'role',
    sort: ''
  },
  {
    name: 'Email',
    field: 'email',
    sort: ''
  }
])

const tables = [
  {
    id: 1,
    name: 'name 1',
    role: 'role 1',
    email: 'emai1@example.com'
  },
  {
    id: 2,
    name: 'name 2',
    role: 'role 2',
    email: 'emai2@example.com'
  },
  {
    id: 3,
    name: 'name 3',
    role: 'role 3',
    email: 'emai3@example.com'
  },
  {
    id: 4,
    name: 'name 4',
    role: 'role 4',
    email: 'emai4@example.com'
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

// Apply a few Bootstrap 5 optimizations
onMounted(() => {
  // Remove labels from
  document.querySelectorAll('#datasetLength label').forEach((el) => {
    el.remove()
  })

  // Replace select classes
  let selectLength = document.querySelector('#datasetLength select')

  selectLength.classList = ''
  selectLength.classList.add('form-select')
  selectLength.style.width = '80px'
})
</script>

<template>
  <BasePageHeading title="Users" subtitle="Custom functionality to further enrich your users.">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List users</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Users">
      <template #options>
        <e-button
          type="info"
          size="sm"
          @click="() => router.push({ name: 'merchant-users-create' })"
          ><i class="fa fa-plus opacity-50 me-1"></i> New user</e-button
        >
      </template>
      <Dataset
        v-slot="{ ds }"
        :ds-data="tables"
        :ds-sortby="sortBy"
        :ds-search-in="['id', 'name', 'role', 'email']"
      >
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
                      <td style="min-width: 50px">
                        <RouterLink :to="`users/${row.id}`">
                          {{ row.id }}
                        </RouterLink>
                      </td>
                      <td style="min-width: 150px">{{ row.name }}</td>
                      <td style="min-width: 150px">{{ row.role }}</td>
                      <td style="min-width: 150px">{{ row.email }}</td>
                      <td class="text-end">
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
          <DatasetPager class="flex-wrap py-3 fs-sm" />
        </div>
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
