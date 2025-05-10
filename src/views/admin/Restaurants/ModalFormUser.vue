<script setup>
import { roleService } from "@/services/role.service";
import { useTemplateStore } from '@/stores/template';
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import VueSelect from "vue-select";

const store = useTemplateStore()
const route = useRoute();
const id_store = route.params?.id;
const props = defineProps(['v$','state','id'])
const {v$, state} = props;

const listRoles = ref([])

const onFetchListRoles = async () => {
  try {
    const response = await roleService.getList({store_id: id_store})
    if (!response?.error) {
      listRoles.value = response.data?.map(item => item.name) || []
    }
    store.pageLoader({ mode: 'off' })
  } catch (error) {
    console.log(error)
    store.pageLoader({ mode: 'off' })
  }
}

onMounted(async () => {
  try {
    await onFetchListRoles()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
            <div class="row justify-content-center">
              <div class="col-sm-10 col-md-12">
                <div class="mb-4">
                  <label class="form-label" for="form-name"
                    >User Name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="form-name"
                    name="form-name"
                    placeholder="Enter UserName..."
                    :class="{
                      'is-invalid': v$.name.$errors.length
                    }"
                    v-model="state.name"
                    @blur="v$.name.$touch"
                  />
                  <div v-if="v$.name.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter your name
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-role"
                    >Role<span class="text-danger">*</span></label
                  >
                  <VueSelect
                      multiple
                      v-model="state.roles"
                      @option:selected="onFileChange"
                      :options="listRoles"
                      placeholder="Select role"
                      id="form-role"
                      @blur="v$.roles.$touch"
                      :class="{
                        'is-invalid': v$.roles.$errors.length
                      }"
                  />
                  <div v-if="v$.roles.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter roles
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-id"
                    >Email<span class="text-danger">*</span></label
                  >
                  <input
                    type="email"
                    class="form-control"
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

                <div class="mb-4" v-if="!id">
                  <label class="form-label" for="form-id"
                    >Password<span class="text-danger">*</span></label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="form-password"
                    name="form-password"
                    placeholder="Enter your password"
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
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @import "vue-select/dist/vue-select.css"; 
  @import "@/assets/scss/vendor/vue-select"; 
.is-invalid > div {
  border-color: #d61f47;
}
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
