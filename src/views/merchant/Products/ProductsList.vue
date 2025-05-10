<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";

const router = useRouter()
const onNavForm = () => {
  console.log(123123)
  router.push({name: 'merchant-products-form'})
}

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

// Get example data
import users from "@/data/usersDataset.json";
import EButton from "@/components/Elements/EButton.vue";
import {productService} from "@/services/product.service";
import EListEmpty from "@/components/Elements/EListEmpty.vue";

const cols = reactive([
  {
    name: "Product",
    field: "product",
    sort: "",
  },
  {
    name: "Category",
    field: "category",
    sort: "",
  },
  {
    name: "In Stock",
    field: "stock",
    sort: "",
  },
  {
    name: "Printer",
    field: "printer",
    sort: "",
  },
  {
    name: "Price",
    field: "price",
    sort: "",
  },
]);

const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
    }
    return acc;
  }, []);
});

// On sort th click
function onSort(event, i) {
  let toset;
  const sortEl = cols[i];

  if (!event.shiftKey) {
    cols.forEach((o) => {
      if (o.field !== sortEl.field) {
        o.sort = "";
      }
    });
  }

  if (!sortEl.sort) {
    toset = "asc";
  }

  if (sortEl.sort === "desc") {
    toset = event.shiftKey ? "" : "asc";
  }

  if (sortEl.sort === "asc") {
    toset = "desc";
  }

  sortEl.sort = toset;
}

const listProducts = ref()
const onFetchList = async () => {
  const response = await productService.getList({
    page: 1,
    pageSize: 10
  })
  if (!response?.error) {
    listProducts.value = response.data?.data || []
  }
}

onMounted(async () => {
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });
  let selectLength = document.querySelector("#datasetLength select");
  selectLength.classList = "";
  selectLength.classList.add("form-select");
  selectLength.style.width = "80px";

  await onFetchList()
});
</script>

<template>
  <BasePageHeading title="List products" subtitle="Custom functionality to further enrich your tables.">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">List products</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Dataset">
      <template #options>
        <e-button type="info" size="sm" @click="onNavForm"><i class="fa fa-plus opacity-50 me-1"></i>
          New product</e-button>
      </template>
      <Dataset
          v-slot="{ ds }"
          :ds-data="listProducts"
          :ds-sortby="sortBy"
          :ds-search-in="['name', 'email', 'company', 'birthdate']"
      >
        <template v-if="listProducts?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow/>
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..."/>
            </div>
          </div>
          <hr/>
          <div class="row">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table table-striped mb-0">
                  <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th
                        v-for="(th, index) in cols"
                        :key="th.field"
                        :class="['sort', th.sort]"
                        @click="onSort($event, index)"
                    >
                      {{ th.name }} <i class="gg-select float-end"></i>
                    </th>
                    <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row, rowIndex }">
                      <tr>
                        <th scope="row">{{ rowIndex + 1 }}</th>
                        <td style="min-width: 150px">{{ row.name }}</td>
                        <td>{{ row.email }}</td>
                        <td style="min-width: 150px">{{ row.company }}</td>
                        <td style="min-width: 150px">{{ row.birthdate }}</td>
                        <td style="min-width: 150px">{{ row.birthdate }}</td>
                        <td class="text-center">
                          <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-alt-secondary">
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
          <div
              class="d-flex flex-md-row flex-column justify-content-between align-items-center"
          >
            <DatasetInfo class="py-3 fs-sm"/>
            <DatasetPager class="flex-wrap py-3 fs-sm"/>
          </div>
        </template>
        <EListEmpty v-else />
      </Dataset>
    </BaseBlock>
  </div>
</template>
