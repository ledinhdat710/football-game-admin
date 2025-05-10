<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import {categoryService} from "@/services/category.service";

const route = useRoute()
const router = useRouter()

const props = route.params
const id = props?.id

const category = ref()
const errorMessage = ref()

const optionsPrint = reactive([
  { value: null, text: 'Please select' },
  { value: '1', text: 'Print 1' },
  { value: '2', text: 'Print 2' },
  { value: '3', text: 'Print 3' },
  { value: '4', text: 'Print 4' }
])

const optionsTicket = reactive([
  { value: null, text: 'Please select' },
  { value: '1', text: 'Ticket 1' },
  { value: '2', text: 'Ticket 2' },
  { value: '3', text: 'Ticket 3' },
  { value: '4', text: 'Ticket 4' }
])

let state = reactive({
  name: null,
  id: null,
  priority: null
})

const rules = computed(() => {
  return {
    name: {
      required,
      minLength: minLength(3)
    },
  }
})

let v$ = useVuelidate(rules, state)

async function onSubmit() {
  const result = await v$.value.$validate()

  if (!result) {
    return
  }

  const payload = {
    name: state.name,
    priority: state.priority,
    type: 'product'
  }

  try {
    const response = id ? await categoryService.edit(id, payload) : await categoryService.create(payload)
    if (!response?.error) {
      await router.push('/merchant/categories')
    }
  } catch (e) {
    console.log(e)
  }

  // perform async actions
}

const apiGetPrinter = () => {
  const res = {
    id: 1,
    name: 'printer 1',
    printId: '1',
    ticketId: '2'
  }
  category.value = res

  state = reactive({
    name: res.name,
    id: res.id,
    printId: res.printId,
    ticketId: res.ticketId
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
    :title="id ? 'Update category' : 'Add new category'"
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
            <router-link to="/merchant/categories">List Categories</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>{{ id ? 'Update category' : 'Add new category' }}</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock :title="id ? `Update Category ${category?.id}` : 'Add Category'">
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
                    >Category name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="block-form-name"
                    name="block-form-name"
                    placeholder="Enter name.."
                    :class="{
                      'is-invalid': v$.name.$errors.length
                    }"
                    v-model="state.name"
                    @blur="v$.name.$touch"
                  />
                  <div v-if="v$.name.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter name
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="block-form-priority"
                    >Priority</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="block-form-priority"
                    placeholder="Enter priority"
                    v-model="state.priority"
                  />
                </div>

                <div class="mb-4" :style="{ textAlign: 'end' }">
                  <button type="submit" class="btn btn-sm btn-primary" :style="{ color: '#fff' }">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </BaseBlock>
        </form>
      </div>
    </div>

    <div
        id="toast_alert"
        class="toast fade hide"
        data-delay="4000"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
      <div class="toast-header">
        <i class="si si-bubble text-primary me-2"></i>
        <strong class="me-auto">Title</strong>
        <small class="text-muted">just now</small>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{errorMessage}}
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
