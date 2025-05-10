<script setup>
import { useRouter } from 'vue-router'
import { reactive, computed, onMounted, ref } from 'vue'
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow
} from 'vue-dataset'
import EButton from '@/components/Elements/EButton.vue'
import { kiosikService } from '@/services/kiosik.service'
import EListEmpty from '@/components/Elements/EListEmpty.vue'
import { useTemplateStore } from '@/stores/template'
import EModal from '@/components/Elements/EModal.vue'

const store = useTemplateStore()

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
    name: 'Receipt Printer',
    field: 'receipt_printer',
    sort: ''
  }
])

const tables = [
  {
    id: 1,
    name: 'Name 1',
    receipt_printer: 'Receipt Printer 1'
  },
  {
    id: 2,
    name: 'Name 2',
    receipt_printer: 'Receipt Printer 2'
  },
  {
    id: 3,
    name: 'Name 3',
    receipt_printer: 'Receipt Printer 3'
  },
  {
    id: 4,
    name: 'Name 4',
    receipt_printer: 'Receipt Printer 4'
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

const idKiosikDelete = ref()
const listKiosiks = ref()

const onFetchList = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await kiosikService.getList({
    page: 1,
    pageSize: 10
  })
  if (!response?.error) {
    listKiosiks.value = response.data?.data || tables
  }
  store.pageLoader({ mode: 'off' })
}

const apiDelete = async () => {
  try {
    store.pageLoader({ mode: 'on' })
    await kiosikService.delete(idKiosikDelete.value)
    const newKiosiks = listKiosiks.value.filter((item) => item.id !== idKiosikDelete.value)
    listKiosiks.value = newKiosiks
    idKiosikDelete.value = null
    store.pageLoader({ mode: 'off' })
  } catch (error) {
    console.log(error)
    store.pageLoader({ mode: 'off' })
  }
}

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
  <BasePageHeading title="Kiosik" subtitle="Custom functionality to further enrich your kiosiks.">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List kiosik</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Kiosiks">
      <template #options>
        <EButton
          type="info"
          size="sm"
          @click="() => router.push({ name: 'merchant-kiosiks-create' })"
          ><i class="fa fa-plus opacity-50 me-1"></i> New kiosik</EButton
        >
      </template>
      <Dataset
        v-slot="{ ds }"
        :ds-data="listKiosiks"
        :ds-sortby="sortBy"
        :ds-search-in="['id', 'name', 'receipt_printer']"
      >
        <template v-if="listKiosiks?.length">
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
                          <RouterLink :to="`kiosiks/${row.id}`">
                            {{ row.id }}
                          </RouterLink>
                        </td>
                        <td style="min-width: 150px">{{ row.name }}</td>
                        <td style="min-width: 150px">{{ row.receipt_printer }}</td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => router.push(`kiosiks/${row.id}/update`)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-delete"
                              @click="() => (idKiosikDelete = row.id)"
                            >
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
        </template>

        <EListEmpty v-else />
      </Dataset>
    </BaseBlock>
  </div>

  <EModal
    id="modal-delete"
    :title="`Delete Item ${idKiosikDelete}`"
    subtitle="Are you sure to delete it?"
    :handle-confirm="apiDelete"
  />
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
