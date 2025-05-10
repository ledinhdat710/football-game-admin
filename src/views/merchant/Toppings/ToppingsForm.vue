<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { toppingService } from '@/services/topping.service'
import { useTemplateStore } from '@/stores/template'

const store = useTemplateStore()

const route = useRoute()
const router = useRouter()

const props = route.params
const id = props?.id

const topping = ref()

let state = reactive({
  name: null,
  category_id: null,
  unit_id: null,
  in_stock: false,
  in_kiosk: false,
  in_table_kiosk: false,
  in_takeaway: false,
  supplier: null,
  price: null,
  tax_rate: null,
  description: null
})

const rules = computed(() => {
  return {
    name: { required, minLength: minLength(3) },
    category_id: { required },
    unit_id: { required },
    in_stock: {},
    in_kiosk: {},
    in_table_kiosk: {},
    in_takeaway: {},
    supplier: { required },
    price: { required },
    tax_rate: { required },
    description: { required }
  }
})

let v$ = useVuelidate(rules, state)

async function onSubmit() {
  try {
    const result = await v$.value.$validate()

    if (!result) return
    store.pageLoader({ mode: 'on' })
    const data = { ...state, in_stock: state.in_stock ? 1 : 0, in_kiosk: state.in_kiosk ? 1 : 0 }

    let response
    if (id) {
      response = await toppingService.update(id, data)
    } else {
      response = await toppingService.create(data)
    }

    if (response.status !== 200) {
      switch (response.status) {
        case 422:
          alert(response?.error?.name?.[0])
          break
        default:
          console.log(response)
      }

      return store.pageLoader({ mode: 'off' })
    }
    router.push({ name: 'merchant-toppings-list' })
  } catch (e) {
    console.log(e)
    store.pageLoader({ mode: 'off' })
  }
}

const apiGetTopping = async () => {
  store.pageLoader({ mode: 'on' })
  const res = await toppingService.get(id)
  topping.value = res.data

  state = reactive({
    name: res.data.name,
    category_id: res.data.category_id,
    unit_id: res.data.unit_id,
    in_stock: res.data.in_stock,
    in_kiosk: res.data.in_kiosk,
    supplier: res.data.supplier,
    price: res.data.price,
    tax_rate: res.data.tax_rate,
    description: res.data.description
  })

  v$ = useVuelidate(rules, state)
  store.pageLoader({ mode: 'off' })
}

const imageUrl = ref()
const handleFileChange = (event) => {
  const file = event.target.files[0]

  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  } else imageUrl.value = null
}

onMounted(async () => {
  try {
    if (id) apiGetTopping()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <BasePageHeading
    :title="id ? 'Update topping' : 'Add new topping'"
    :go-back="true"
    subtitle="Custom functionality to further enrich your toppings."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/merchant/toppings">List toppings</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>{{ id ? 'Update topping' : 'Add new topping' }}</span>
          </li>
        </ol>
      </nav>
    </template> </BasePageHeading
  >

  <div class="container">
    <div class="row justify-content-center py-sm-3 py-md-4">
      <div>
        <form @submit.prevent="onSubmit">
          <BaseBlock :title="id ? `Update Topping ${topping?.id}` : 'Add Topping'">
            <template #options>
              <e-icon
                @click="() => router.back()"
                name="arrow-left"
                role="button"
                class="icon_arrow_left"
              />
            </template>

            <div class="row justify-content-center py-sm-1 py-md-2">
              <div>
                <div class="row mb-2">
                  <div class="col-md-6 mb-4 me-3">
                    <label class="form-label" for="form-name"
                      >Topping Name<span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-name"
                      name="form-name"
                      placeholder="Enter name.."
                      :class="{
                        'is-invalid': v$.name.$errors.length
                      }"
                      v-model="state.name"
                      @blur="v$.name.$touch"
                    />
                    <div v-if="v$.name.$errors.length" class="invalid-feedback animated fadeIn">
                      Please enter name customer
                    </div>
                  </div>

                  <div class="col-sm-8 col-md-4 mb-4">
                    <label class="form-label" for="form-id"
                      >Product group<span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-category-id"
                      name="form-category-id"
                      placeholder="Product group"
                      :class="{
                        'is-invalid': v$.category_id.$errors.length
                      }"
                      v-model="state.category_id"
                      @blur="v$.category_id.$touch"
                    />
                    <div
                      v-if="v$.category_id.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter category_id
                    </div>
                  </div>
                </div>

                <div class="row mb-2">
                  <div class="col-md-6 mb-4 me-3">
                    <label class="form-label" for="form-item-no">Item no</label>
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-item-no"
                      name="form-item-no"
                      placeholder="Enter your item-no.."
                      v-model="state.item_no"
                    />
                  </div>

                  <div class="col-sm-8 col-md-4 mb-4">
                    <label class="form-label" for="form-barcode">Barcode</label>
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-barcode"
                      name="form-barcode"
                      placeholder="Accountant"
                      v-model="state.barcode"
                    />
                  </div>
                </div>

                <div class="row mb-2">
                  <div class="col-md-7 mb-4 me-3">
                    <label class="form-label" for="form-description"
                      >Description<span class="text-danger">*</span></label
                    >
                    <textarea
                      :style="{ backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-description"
                      name="form-description"
                      :class="{
                        'is-invalid': v$.description.$errors.length
                      }"
                      v-model="state.description"
                      @blur="v$.description.$touch"
                      rows="5"
                      placeholder="Textarea content.."
                    ></textarea>
                    <div
                      v-if="v$.description.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter description
                    </div>
                  </div>

                  <div class="col-sm-6 col-md-3 mb-4">
                    <label class="form-label" for="form-picture">Picture</label>
                    <input
                      type="file"
                      id="form-picture"
                      name="form-picture"
                      @change="handleFileChange"
                    />
                    <div v-if="imageUrl">
                      <img
                        :style="{
                          width: '100%',
                          marginTop: '0.5rem',
                          maxHeight: '12vw',
                          objectFit: 'cover'
                        }"
                        :src="imageUrl"
                        alt="Uploaded Image"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mb-2">
                  <div class="col-md-6 mb-4 me-3">
                    <label class="form-label" for="form-supplier"
                      >Supplier<span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-supplier"
                      name="form-supplier"
                      placeholder="Enter supplier.."
                      :class="{
                        'is-invalid': v$.supplier.$errors.length
                      }"
                      v-model="state.supplier"
                      @blur="v$.supplier.$touch"
                    />
                    <div v-if="v$.supplier.$errors.length" class="invalid-feedback animated fadeIn">
                      Please enter supplier
                    </div>
                  </div>

                  <div class="col-sm-8 col-md-4 mb-4">
                    <label class="form-label" for="form-producer">Producer</label>
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-producer"
                      name="form-producer"
                      placeholder="Enter your producer.."
                      v-model="state.producer"
                    />
                  </div>
                </div>

                <div class="row mb-2">
                  <div class="col-sm-6 col-md-3 mb-4">
                    <label class="form-label" for="form-tax-rate"
                      >VAT rate<span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-tax-rate"
                      name="form-tax-rate"
                      placeholder="Enter your tax_rate.."
                      :class="{
                        'is-invalid': v$.tax_rate.$errors.length
                      }"
                      v-model="state.tax_rate"
                      @blur="v$.tax_rate.$touch"
                    />
                    <div v-if="v$.tax_rate.$errors.length" class="invalid-feedback animated fadeIn">
                      Please enter tax_rate
                    </div>
                  </div>

                  <div class="col-sm-6 col-md-3 mb-4">
                    <label class="form-label" for="form-price"
                      >Purchase price<span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-price"
                      name="form-price"
                      placeholder="Accountant"
                      :class="{
                        'is-invalid': v$.price.$errors.length
                      }"
                      v-model="state.price"
                      @blur="v$.price.$touch"
                    />
                    <div v-if="v$.price.$errors.length" class="invalid-feedback animated fadeIn">
                      Please enter price
                    </div>
                  </div>

                  <div class="col-sm-6 col-md-3 mb-4">
                    <label class="form-label" for="form-cost-price">Cost price</label>
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-cost-price"
                      name="form-cost-price"
                      placeholder="Accountant"
                      v-model="state.cost_price"
                    />
                  </div>

                  <div class="col-sm-6 col-md-3 mb-4">
                    <label class="form-label" for="form-unit-id">Unit Id</label>
                    <input
                      type="text"
                      :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                      class="form-control form-control-alt"
                      id="form-unit-id"
                      name="form-unit-id"
                      placeholder="unit"
                      :class="{
                        'is-invalid': v$.unit_id.$errors.length
                      }"
                      v-model="state.unit_id"
                      @blur="v$.unit_id.$touch"
                    />
                    <div v-if="v$.unit_id.$errors.length" class="invalid-feedback animated fadeIn">
                      Please enter unit id
                    </div>
                  </div>
                </div>

                <div class="row mb-2">
                  <div class="col-sm-5 col-md-3 mb-4">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="example-switch-default1"
                        name="example-switch-default1"
                        :checked="state.in_stock"
                        v-model="state.in_stock"
                      />
                      <label class="form-check-label" for="example-switch-default1">In Stock</label>
                    </div>
                  </div>

                  <div class="col-sm-5 col-md-3 mb-4">
                    <div class="form-check form-switch mb-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="example-switch-default1"
                        name="example-switch-default1"
                        :checked="state.in_kiosk"
                        v-model="state.in_kiosk"
                      />
                      <label class="form-check-label" for="example-switch-default1"
                        >Show in kiosk</label
                      >
                    </div>
                    <div class="form-check form-switch mb-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="example-switch-default1"
                        name="example-switch-default1"
                        :checked="state.in_table_kiosk"
                        v-model="state.in_table_kiosk"
                      />
                      <label class="form-check-label" for="example-switch-default1"
                        >Show in table kiosk</label
                      >
                    </div>
                    <div class="form-check form-switch mb-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="example-switch-default1"
                        name="example-switch-default1"
                        :checked="state.in_takeaway"
                        v-model="state.in_takeaway"
                      />
                      <label class="form-check-label" for="example-switch-default1"
                        >Show in takeaway</label
                      >
                    </div>
                  </div>
                </div>

                <div class="mb-4" :style="{ textAlign: 'end' }">
                  <button type="submit" class="btn btn-sm btn-primary" :style="{ color: '#fff' }">
                    {{ id ? 'Save Topping' : 'Add Topping' }}
                  </button>
                </div>
              </div>
            </div>
          </BaseBlock>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon_arrow_left {
  background-color: rgb(243, 235, 235);
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
