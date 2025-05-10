<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { kiosikService } from '@/services/kiosik.service'
import { useTemplateStore } from '@/stores/template'

const store = useTemplateStore()

const route = useRoute()
const router = useRouter()

const props = route.params
const id = props?.id

const kiosik = ref()

const optionsPrint = reactive([
  { value: null, text: 'Please select' },
  { value: '1', text: 'Print 1' },
  { value: '2', text: 'Print 2' },
  { value: '3', text: 'Print 3' },
  { value: '4', text: 'Print 4' }
])

let state = reactive({
  name: null,
  id: null,
  printId: null
})

const rules = computed(() => {
  return {
    name: {
      required,
      minLength: minLength(3)
    },
    id: {
      required
    },
    printId: {
      required
    }
  }
})

let v$ = useVuelidate(rules, state)

async function onSubmit() {
  try {
    const result = await v$.value.$validate()

    if (!result) {
      return
    }

    console.log('🚀 ~ onSubmit ~ result:', state)

    store.pageLoader({ mode: 'on' })

    if (id) {
      await kiosikService.update(id, state)
    } else {
      await kiosikService.create(state)
    }

    router.push({ name: 'merchant-kiosiks-list' })
  } catch (e) {
    console.log(e)
    store.pageLoader({ mode: 'off' })
  }
}

const apiGetPrinter = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await kiosikService.get(id)
  kiosik.value = response.data

  const res = {
    id: 1,
    name: 'printer 1',
    printId: '1'
  }
  kiosik.value = res

  state = reactive({
    name: res.name,
    id: res.id,
    printId: res.printId
  })

  v$ = useVuelidate(rules, state)
  store.pageLoader({ mode: 'off' })
}

onMounted(async () => {
  try {
    if (id) await apiGetPrinter()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <BasePageHeading
    :title="id ? 'Update kiosik' : 'Add new kiosik'"
    :go-back="true"
    subtitle="Custom functionality to further enrich your tables."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/merchant/kiosiks">List kiosiks</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>{{ id ? 'Update kiosik' : 'Add new kiosik' }}</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock :title="id ? `Update Kiokis ${kiosik?.id}` : 'Add Kiosik'">
            <template #options>
              <e-icon
                @click="() => router.back()"
                name="arrow-left"
                role="button"
                class="icon_arrow_left"
              />
            </template>

            <div class="row justify-content-center py-sm-3 py-md-5">
              <div class="col-sm-10 col-md-8">
                <div class="mb-4">
                  <label class="form-label" for="block-form-name"
                    >Kiosk Name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="block-form-name"
                    name="block-form-name"
                    placeholder="Enter kiosk name.."
                    :class="{
                      'is-invalid': v$.name.$errors.length
                    }"
                    v-model="state.name"
                    @blur="v$.name.$touch"
                  />
                  <div v-if="v$.name.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter name kiosik
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="block-form-id"
                    >Kiosik ID<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="block-form-id"
                    name="block-form-id"
                    placeholder="Enter id kiosik"
                    :class="{
                      'is-invalid': v$.id.$errors.length
                    }"
                    v-model="state.id"
                    @blur="v$.id.$touch"
                  />
                  <div v-if="v$.id.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter id kiosik
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="val-print-id"
                    >Receipt Printer<span class="text-danger">*</span></label
                  >
                  <select
                    id="val-print-id"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-select"
                    :class="{
                      'is-invalid': v$.printId.$errors.length
                    }"
                    v-model="state.printId"
                    @blur="v$.printId.$touch"
                  >
                    <option
                      v-for="(print, index) in optionsPrint"
                      :value="print.value"
                      :key="`print-${index}`"
                    >
                      {{ print.text }}
                    </option>
                  </select>
                  <div v-if="v$.printId.$errors.length" class="invalid-feedback animated fadeIn">
                    Please select a print id!
                  </div>
                </div>

                <div class="mb-4" :style="{ textAlign: 'end' }">
                  <button type="submit" class="btn btn-sm btn-primary" :style="{ color: '#fff' }">
                    {{ id ? 'Save Printer' : 'Add Printer' }}
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
