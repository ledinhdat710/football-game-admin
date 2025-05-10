<script setup>
const props = defineProps(['v$','state'])
const {v$, state} = props;

</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="mb-4">
          <label class="form-label" for="block-form-name"
          >User Name<span class="text-danger">*</span></label
          >
          <input type="text" class="form-control" id="form-user-name" placeholder="Enter username..." :class="{
            'is-invalid': v$.username.$errors.length
            }"
            v-model="state.username"
            @blur="v$.username.$touch"
          />
          <div v-if="v$.username.$errors" class="invalid-feedback animated fadeIn">
            <span v-for="(itm, index) in v$.username.$errors" :key="`username-${index}`">
              <span v-if="index === 0">
                {{ itm?.$validator === 'minLength' ? 'UserName should be at least 3 characters long' : 'Please enter user name'}}
              </span>
            </span>
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label" for="block-form-table-id">{{state.id ? 'New Password' : 'Password'}} <span class="text-danger">*</span></label>
          <input type="password" class="form-control" id="form-password" name="form-password" placeholder="New password ..."
            :class="{
              'is-invalid': v$.password.$errors.length
            }"
            v-model="state.password"
            @blur="v$.password.$touch"
          />
          <div v-if="v$.password.$errors.length" class="invalid-feedback animated fadeIn">
            <span v-if="v$.password.$errors[0].$params.type === 'required'">
              {{ state.id ? 'Please provide a new password' : 'Please provide a password'}}
            </span>
            <span v-else>
              {{ state.id ? 'New Password min length 6' : 'Password min length 6' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>