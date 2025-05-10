<script setup>
import { watch } from "vue";

const props = defineProps(["v$", "state", "validatePassword"]);
const { v$, state } = props;
watch(props, () => {});
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-12">
            <div class="mb-4">
              <label class="form-label" for="form-id"
                >New Password<span class="text-danger">*</span></label
              >
              <input
                type="password"
                class="form-control"
                id="form-password"
                name="form-password"
                placeholder="New password ..."
                :class="{
                  'is-invalid': v$.newPassword.$errors.length,
                }"
                v-model="state.newPassword"
                @blur="v$.newPassword.$touch"
              />
              <div
                v-if="v$.newPassword.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                <span
                  v-if="v$.newPassword.$errors[0].$params.type === 'required'"
                  >Please provide a new password</span
                >
                <span v-else>New password min length 6</span>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="form-id"
                >Confirm New Password<span class="text-danger">*</span></label
              >
              <input
                type="password"
                class="form-control"
                id="form-confirm-password"
                name="form-password"
                placeholder="Confirm new password ..."
                :class="{
                  'is-invalid': v$.confirmPassword.$errors.length,
                }"
                v-model="state.confirmPassword"
                @blur="v$.confirmPassword.$touch"
              />
              <div
                v-if="v$.confirmPassword.$errors.length"
                class="invalid-feedback animated fadeIn"
              >
                <!-- Please provide a confirm new password -->
              </div>
              <span
                v-if="
                  props.state.newPassword !== props.state.confirmPassword &&
                  props.state.newPassword !== '' &&
                  props.state.confirmPassword !== ''
                "
                class="invalid-feedback animated fadeIn"
                >Passwords do not match.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
