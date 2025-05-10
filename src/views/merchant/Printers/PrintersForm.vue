<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const route = useRoute()
const router = useRouter()

const props = route.params
const id = props?.id

const printer = ref()

let state = reactive({
  printerName: null,
  id: null,
  username: null,
  accessKey: null
})

const rules = computed(() => {
  return {
    printerName: {
      required,
      minLength: minLength(3)
    },
    id: {
      required
    },
    username: {
      required,
      minLength: minLength(3)
    },
    accessKey: {
      required,
      minLength: minLength(3)
    }
  }
})

let v$ = useVuelidate(rules, state)

async function onSubmit() {
  const result = await v$.value.$validate()

  if (!result) {
    return
  }

  console.log('🚀 ~ onSubmit ~ result:', state)

  // perform async actions
}

const apiGetPrinter = () => {
  const res = {
    id: 1,
    printerName: 'printer 1',
    username: 'username',
    accessKey: 'access key'
  }
  printer.value = res

  state = reactive({
    printerName: res.printerName,
    id: res.id,
    username: res.username,
    accessKey: res.accessKey
  })

  v$ = useVuelidate(rules, state)
}

onMounted(async () => {
  try {
    if (id) apiGetPrinter()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <BasePageHeading
    :title="id ? 'Update printer' : 'Add new printer'"
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
            <router-link to="/merchant/printers">List printers</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>Add new printer</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock :title="id ? `Update Printer ${printer?.id}` : 'Add Printer'">
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
                  <label class="form-label" for="form-printer-name"
                    >Printer Name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="form-printer-name"
                    name="form-printer-name"
                    placeholder="Enter printer name.."
                    :class="{
                      'is-invalid': v$.printerName.$errors.length
                    }"
                    v-model="state.printerName"
                    @blur="v$.printerName.$touch"
                  />
                  <div
                    v-if="v$.printerName.$errors.length"
                    class="invalid-feedback animated fadeIn"
                  >
                    Please enter name printer
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-id"
                    >Printer ID<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="form-id"
                    name="form-id"
                    placeholder="Enter id printer"
                    :class="{
                      'is-invalid': v$.id.$errors.length
                    }"
                    v-model="state.id"
                    @blur="v$.id.$touch"
                  />
                  <div v-if="v$.id.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter id printer
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-username"
                    >UserName<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="form-username"
                    name="form-username"
                    placeholder="Enter username printer"
                    :class="{
                      'is-invalid': v$.username.$errors.length
                    }"
                    v-model="state.username"
                    @blur="v$.username.$touch"
                  />
                  <div v-if="v$.username.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter username
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-access-key"
                    >Access Key<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="form-access-key"
                    name="form-access-key"
                    placeholder="Enter access key"
                    :class="{
                      'is-invalid': v$.accessKey.$errors.length
                    }"
                    v-model="state.accessKey"
                    @blur="v$.accessKey.$touch"
                  />
                  <div v-if="v$.accessKey.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter access key
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
