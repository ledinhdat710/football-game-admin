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
import { toppingService } from '@/services/topping.service'
import EListEmpty from '@/components/Elements/EListEmpty.vue'
import { useTemplateStore } from '@/stores/template'

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
    name: 'Product Group',
    field: 'category_id',
    sort: ''
  },
  {
    name: 'In Stock',
    field: 'in_stock',
    sort: ''
  },
  {
    name: 'Unit',
    field: 'unit_id',
    sort: ''
  },
  {
    name: 'Suppliers',
    field: 'supplier',
    sort: ''
  },
  {
    name: 'Price',
    field: 'price',
    sort: ''
  }
])

const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === 'asc' ? acc.push(o.field) : acc.push('-' + o.field)
    }
    return acc
  }, [])
})

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

const idTopingDelete = ref()
const listToppings = ref()

const onFetchList = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await toppingService.getList({
    page: 1,
    pageSize: 10
  })
  if (!response?.error) {
    listToppings.value = response.data?.data || []
  }
  store.pageLoader({ mode: 'off' })
}

const apiDelete = async () => {
  try {
    store.pageLoader({ mode: 'on' })
    await toppingService.delete(idTopingDelete.value)
    const newToppings = listToppings.value.filter((item) => item.id !== idTopingDelete.value)
    listToppings.value = newToppings
    idTopingDelete.value = null
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
  <BasePageHeading
    title="Toppings"
    subtitle="Custom functionality to further enrich your toppings."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List toppings</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Toppings">
      <template #options>
        <e-button
          type="info"
          size="sm"
          @click="() => router.push({ name: 'merchant-toppings-create' })"
          ><i class="fa fa-plus opacity-50 me-1"></i> New topping</e-button
        >
      </template>
      <Dataset
        v-slot="{ ds }"
        :ds-data="listToppings"
        :ds-sortby="sortBy"
        :ds-search-in="['id', 'name', 'category_id', 'in_stock', 'unit_id', 'supplier', 'price']"
      >
        <template v-if="listToppings?.length">
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
                        <td style="min-width: 50px">{{ row.id }}</td>
                        <td style="min-width: 150px">{{ row.name }}</td>
                        <td style="min-width: 150px">
                          <div class="productGroup">
                            {{ row.category_id }}
                          </div>
                        </td>
                        <td style="min-width: 150px">
                          <div class="form-check form-switch">
                            <input
                              :style="{ opacity: 1 }"
                              class="form-check-input"
                              type="checkbox"
                              :checked="row.in_stock"
                              disabled
                            />
                          </div>
                        </td>
                        <td style="min-width: 150px">{{ row.unit_id }}</td>
                        <td style="min-width: 150px">{{ row.supplier }}</td>
                        <td style="min-width: 150px">{{ row.price }}</td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              @click="() => router.push(`toppings/${row.id}/update`)"
                            >
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-alt-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-delete"
                              @click="() => (idTopingDelete = row.id)"
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

  <div
    class="modal"
    id="modal-delete"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-delete"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <BaseBlock :title="`Delete Item ${idTopingDelete}`" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-sm">
              <p>Are you sure to delete it?</p>
            </div>
            <div class="block-content block-content-full text-end bg-body">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-1"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                data-bs-dismiss="modal"
                @click="apiDelete"
              >
                Agree
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
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

.productGroup {
  background-color: #111827bd;
  color: #fff;
  padding: 6px 8px;
  text-align: center;
  display: inline-flex;
  border-radius: 0.5rem;
}
</style>
