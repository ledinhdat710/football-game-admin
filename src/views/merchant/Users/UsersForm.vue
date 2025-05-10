<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'

const route = useRoute()
const router = useRouter()

const props = route.params
const id = props?.id

const user = ref()

let state = reactive({
  name: null,
  role: null,
  email: null,
  password: null
})

const rules = computed(() => {
  return {
    name: {
      required,
      minLength: minLength(3)
    },
    role: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required
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

const apiGetUser = () => {
  const res = {
    id: '1',
    name: 'username',
    role: 'role 1',
    email: 'email@example.com',
    password: null
  }
  user.value = res

  state = reactive({
    name: res.name,
    role: res.role,
    email: res.email,
    password: res.password
  })

  v$ = useVuelidate(rules, state)
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
    :title="id ? 'Update user' : 'Add new user'"
    :go-back="true"
    subtitle="Custom functionality to further enrich your users."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/merchant/users">List users</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>{{ id ? 'Update user' : 'Add new user' }}</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock :title="id ? `Update User ${user?.id}` : 'Add User'">
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
                  <label class="form-label" for="form-name"
                    >User Name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="form-name"
                    name="form-name"
                    placeholder="Enter your name.."
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

                <div class="mb-4">
                  <label class="form-label" for="form-id"
                    >Role<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    :style="{ height: '46px', backgroundColor: '#F4F4F4' }"
                    class="form-control form-control-alt"
                    id="form-role"
                    name="form-role"
                    placeholder="Accountant"
                    :class="{
                      'is-invalid': v$.role.$errors.length
                    }"
                    v-model="state.role"
                    @blur="v$.role.$touch"
                  />
                  <div v-if="v$.role.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter role customer
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-id"
                    >Email<span class="text-danger">*</span></label
                  >
                  <input
                    type="email"
                    class="form-control form-control-lg form-control-alt"
                    id="form-email"
                    name="form-email"
                    placeholder="Email"
                    :class="{
                      'is-invalid': v$.email.$errors.length
                    }"
                    v-model="state.email"
                    @blur="v$.email.$touch"
                  />
                  <div v-if="v$.email.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter a valid email address
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-id"
                    >Password<span class="text-danger">*</span></label
                  >
                  <input
                    type="password"
                    class="form-control form-control-lg form-control-alt"
                    id="form-password"
                    name="form-password"
                    placeholder="Password"
                    :class="{
                      'is-invalid': v$.password.$errors.length
                    }"
                    v-model="state.password"
                    @blur="v$.password.$touch"
                  />
                  <div v-if="v$.password.$errors.length" class="invalid-feedback animated fadeIn">
                    Please provide a password
                  </div>
                </div>

                <div class="mb-4" :style="{ textAlign: 'end' }">
                  <button type="submit" class="btn btn-sm btn-primary" :style="{ color: '#fff' }">
                    {{ id ? 'Save User' : 'Add User' }}
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
