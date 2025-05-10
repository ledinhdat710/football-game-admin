<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { tableService } from '@/services/table.service'
import { useTemplateStore } from '@/stores/template'

const store = useTemplateStore()

const route = useRoute()
const router = useRouter()

const props = route.params
const id = props?.id

const table = ref()

let state = reactive({
  name: null
})

const rules = computed(() => {
  return {
    name: {
      required,
      minLength: minLength(3)
    },
    table_id: {
      required
    }
  }
})

let v$ = useVuelidate(rules, state)

async function onSubmit() {
  try {
    const result = await v$.value.$validate()

    if (!result) return
    store.pageLoader({ mode: 'on' })

    if (id) {
      await tableService.update(id, state)
    } else {
      await tableService.create(state)
    }

    router.push({ name: 'merchant-tables-list' })
  } catch (e) {
    console.log(e)
    store.pageLoader({ mode: 'off' })
  }
}

const apiGetUser = async () => {
  store.pageLoader({ mode: 'on' })
  const response = await tableService.get(id)
  console.log('🚀 ~ apiGetUser ~ response:', response)
  table.value = response.data

  state = reactive({
    name: response.data.name,
    table_id: response.data.id
  })

  v$ = useVuelidate(rules, state)
  store.pageLoader({ mode: 'off' })
}

onMounted(async () => {
  try {
    if (id) apiGetUser()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <BasePageHeading
    :title="id ? 'Update table' : 'Add new table'"
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
            <router-link to="/merchant/tables">List tables</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>{{ id ? 'Update table' : 'Add new table' }}</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock :title="id ? `Update table ${table?.id}` : 'Add Table'">
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
                    >Table Name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="block-form-name"
                    name="block-form-name"
                    placeholder="Enter your name.."
                    :class="{
                      'is-invalid': v$.name.$errors.length
                    }"
                    v-model="state.name"
                    @blur="v$.name.$touch"
                  />
                  <div v-if="v$.name.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter name table
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label" for="block-form-table-id"
                    >Table ID<span class="text-danger">*</span></label
                  >
                  <input
                    :disabled="id"
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="block-form-table-id"
                    name="block-form-table-id"
                    placeholder="Enter id table.."
                    :class="{
                      'is-invalid': v$.table_id.$errors.length
                    }"
                    v-model="state.table_id"
                    @blur="v$.table_id.$touch"
                  />
                  <div v-if="v$.table_id.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter id table
                  </div>
                </div>
                <div class="mb-4" :style="{ textAlign: 'end' }">
                  <button type="submit" class="btn btn-sm btn-primary" :style="{ color: '#fff' }">
                    {{ id ? 'Save Table' : 'Add Table' }}
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
