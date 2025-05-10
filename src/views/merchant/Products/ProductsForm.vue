<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from "vue-router";
import useVuelidate from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";
import EButton from "@/components/Elements/EButton.vue";
import ProductsDndConstituentRemoveItem
  from "@/views/merchant/Products/Components/ProductsDndConstituentRemoveItem.vue";
import ProductsDndConstituentChooseItem
  from "@/views/merchant/Products/Components/ProductsDndConstituentChooseItem.vue";

const route = useRoute()
const idProduct = ref(route.params?.id || null)
const title = ref('Add new product')
const data = ref(
    [
      {
        type: 'remove',
        title: 'Remove Item 1',
        description: 'Description remove 1',
        items: [
          {
            id: 1,
            name: 'Cheese',
            arrangement: 1,
            amount: 1,
            cost: 1,
            retail: 1,
          },
          {
            id: 2,
            name: 'Phô mai',
            arrangement: 2,
            amount: 2,
            cost: 2,
            retail: 2,
          },
          {
            id: 3,
            name: 'Salad',
            arrangement: 3,
            amount: 3,
            cost: 3,
            retail: 3,
          }
        ]
      },
      {
        type: 'choose',
        title: 'Choose Item 1',
        description: 'Description choose 1',
        items: [
          {
            id: 11,
            name: 'Cheese 11',
            arrangement: 1,
            amount: 1,
            cost: 1,
            retail: 1,
          },
          {
            id: 22,
            name: 'Phô mai 22',
            arrangement: 2,
            amount: 2,
            cost: 2,
            retail: 2,
          },
          {
            id: 3,
            name: 'Salad 33',
            arrangement: 3,
            amount: 3,
            cost: 3,
            retail: 3,
          }
        ]
      }
    ]
)
const router = useRouter()
onMounted(() => {
  if (idProduct.value) {
    title.value = 'Update product'
  }
})
const formData = ref({
  name: '',
  category_id: null,
  item_no: '',
  preparation_time: '',
  code: '',
  description: '',
  supplier: '',
  producer: '',
  purchase_price: null,
  cost_price: null,
  vat_rate: null,
  offer_price: null,
  offer_price_ex_vat: null,
  offer_price_including_vat: null,
  quantity: null,
  in_stock: true,
  on_sale: true,
  show_in_kiosk: true,
  show_in_table_kiosk: true,
  show_in_takeaway: true,
})
const rules = ref({
  name: {
    required,
    minLength: minLength(3),
  },
  category_id: {
    required,
  },
})
const v$ = useVuelidate(rules, formData);

async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    // notify user form is invalid
    return;
  }

  console.log(data.value)
  // perform async actions
}
</script>

<template>
  <BasePageHeading :title="title" :go-back="true" subtitle="Custom functionality to further enrich your tables.">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/merchant/products">List products</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>Add new products</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock>
      <template #content>
        <form @submit.prevent="onSubmit">
          <ul class="nav nav-tabs nav-tabs-block" role="tablist">
            <li class="nav-item">
              <button
                  class="nav-link active"
                  id="btabs-static-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#btabs-static-home"
                  role="tab"
                  aria-controls="btabs-static-home"
                  aria-selected="true"
              >
                Generally
              </button>
            </li>
            <li class="nav-item">
              <button
                  class="nav-link"
                  id="btabs-static-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#btabs-static-profile"
                  role="tab"
                  aria-controls="btabs-static-profile"
                  aria-selected="false"
              >
                Constituents
              </button>
            </li>
          </ul>
          <div class="block-content tab-content">
            <div
                class="tab-pane active"
                id="btabs-static-home"
                role="tabpanel"
                aria-labelledby="btabs-static-home-tab"
                tabindex="0"
            >
              <div class="row">
                <div class="col-12 col-md-8">
                  <div class="mb-4">
                    <label class="form-label" for="val-name">Product name <span class="text-danger">*</span></label>
                    <input
                        type="text"
                        id="val-name"
                        class="form-control"
                        :class="{
                          'is-invalid': v$.name.$errors.length,
                        }"
                        v-model="formData.name"
                        @blur="v$.name.$touch"
                        placeholder="Enter..."
                    />
                    <div
                        v-if="v$.name.$errors.length"
                        class="invalid-feedback animated fadeIn"
                    >
                      Name is required
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-category_id">Category</label>
                    <select
                        v-model="formData.category_id"
                        class="form-select"
                        id="val-category_id"
                        name="category_id"
                        :class="{
                          'is-invalid': v$.category_id.$errors.length,
                        }"
                    >
                      <option :value="null" disabled>Select</option>
                      <option value="1">Option #1</option>
                    </select>
                    <div
                        v-if="v$.category_id.$errors.length"
                        class="invalid-feedback animated fadeIn"
                    >
                      Category is required
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-5">
                  <div class="mb-4">
                    <label class="form-label" for="val-item_no">Item no</label>
                    <input
                        type="number"
                        id="val-item_no"
                        class="form-control"
                        v-model="formData.item_no"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="mb-4">
                    <label class="form-label" for="val-preparation_time">Preparation time</label>
                    <input
                        type="number"
                        id="val-preparation_time"
                        class="form-control"
                        v-model="formData.preparation_time"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-code">Barcode</label>
                    <input
                        type="text"
                        id="val-code"
                        class="form-control"
                        v-model="formData.code"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-8">
                  <div class="mb-4">
                    <label class="form-label" for="val-description">Description</label>
                    <textarea
                        class="form-control"
                        id="val-description"
                        rows="7"
                        placeholder="Enter..."
                    ></textarea>
                  </div>
                </div>
                <div class="col-12 col-md-4"></div>
                <div class="col-12 col-md-8">
                  <div class="mb-4">
                    <label class="form-label" for="val-supplier">Supplier</label>
                    <input
                        type="text"
                        id="val-supplier"
                        class="form-control"
                        v-model="formData.supplier"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-producer">Producer</label>
                    <input
                        type="text"
                        id="val-producer"
                        class="form-control"
                        v-model="formData.producer"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-purchase_price">Purchase price (ex Tax)</label>
                    <input
                        type="text"
                        id="val-purchase_price"
                        class="form-control"
                        v-model="formData.purchase_price"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-cost_price">Cost price</label>
                    <input
                        type="text"
                        id="val-cost_price"
                        class="form-control"
                        v-model="formData.cost_price"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-vat_rate">VAT rate</label>
                    <input
                        type="text"
                        id="val-vat_rate"
                        class="form-control"
                        v-model="formData.vat_rate"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-offer_price">Offer price</label>
                    <input
                        type="text"
                        id="val-offer_price"
                        class="form-control"
                        v-model="formData.offer_price"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-offer_price_ex_vat">Offer price ex VAT</label>
                    <input
                        type="text"
                        id="val-offer_price_ex_vat"
                        class="form-control"
                        v-model="formData.offer_price_ex_vat"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="mb-4">
                    <label class="form-label" for="val-offer_price_including_vat">Offer price price including VAT</label>
                    <input
                        type="text"
                        id="val-offer_price_including_vat"
                        class="form-control"
                        v-model="formData.offer_price_including_vat"
                        placeholder="Enter..."
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-3">
                  <div class="space-y-2 mb-4">
                    <div class="form-check form-switch">
                      <input
                          v-model="formData.in_stock"
                          class="form-check-input"
                          type="checkbox"
                          id="val-in_stock"
                      />
                      <label class="form-check-label" for="val-in_stock"
                      >In stock</label
                      >
                    </div>
                    <div class="form-check form-switch">
                      <input
                          v-model="formData.on_sale"
                          class="form-check-input"
                          type="checkbox"
                          id="val-on_sale"
                      />
                      <label class="form-check-label" for="val-on_sale"
                      >On sale</label
                      >
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="space-y-2 mb-4">
                    <div class="form-check form-switch">
                      <input
                          v-model="formData.show_in_kiosk"
                          class="form-check-input"
                          type="checkbox"
                          id="val-show_in_kiosk"
                      />
                      <label class="form-check-label" for="val-show_in_kiosk"
                      >Show in kiosk</label
                      >
                    </div>
                    <div class="form-check form-switch">
                      <input
                          v-model="formData.show_in_table_kiosk"
                          class="form-check-input"
                          type="checkbox"
                          id="val-show_in_table_kiosk"
                      />
                      <label class="form-check-label" for="val-show_in_table_kiosk"
                      >Show in table kiosk</label
                      >
                    </div>
                    <div class="form-check form-switch">
                      <input
                          v-model="formData.show_in_takeaway"
                          class="form-check-input"
                          type="checkbox"
                          id="val-show_in_takeaway"
                      />
                      <label class="form-check-label" for="val-show_in_takeaway"
                      >Show in takeaway</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
                class="tab-pane"
                id="btabs-static-profile"
                role="tabpanel"
                aria-labelledby="btabs-static-profile-tab"
                tabindex="0"
            >
              <div class="overflow-x-auto">
                <div class="d-flex align-center justify-content-start space-x-3" style="width: max-content;">
                  <e-button type="danger">
                    Remove something
                  </e-button>
                  <e-button type="secondary">
                    Choose between
                  </e-button>
                  <e-button type="info">
                    Category for extras
                  </e-button>
                  <e-button type="warning">
                    Change with
                  </e-button>
                </div>
              </div>

              <hr/>

              <template v-for="(item, index) in data" :key="index">
                <products-dnd-constituent-remove-item v-if="item.type === 'remove'" v-model:title="item.title" v-model:description="item.description" v-model:items="item.items" />
                <products-dnd-constituent-choose-item v-if="item.type === 'choose'" v-model:title="item.title" v-model:description="item.description" v-model:items="item.items" />
              </template>
            </div>
          </div>
        </form>
      </template>
    </BaseBlock>
    <div class="d-flex justify-content-end mb-4 gap-2">
      <e-button type="outline-secondary" @click="() => router.back()">Cancel</e-button>
      <e-button type="primary">Submit</e-button>
    </div>
  </div>
</template>
