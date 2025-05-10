<script setup>
import {reactive} from "vue";
import { default as FlatPicker } from 'vue-flatpickr-component'
import moment from 'moment'
const props = defineProps(['v$','state'])
const {v$, state} = props;
const flatPickerState = reactive({
  configTimeStandalone: {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true
  }
})

const handleChangeTime = (time) => {
  const timeFormat = moment(time, 'HH:mm:ss').format('HH:mm')
  state.time = timeFormat;
}
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <div class="mb-4">
          <label class="form-label" for="block-form-name"
          >Time<span class="text-danger">*</span></label
          >
          <FlatPicker
              id="flat-picker-time-standalone"
              class="form-control"
              v-model="state.time"
              :config="flatPickerState.configTimeStandalone"
              @on-change="(e) => handleChangeTime(e[0])"
          />
          <div v-if="v$.time.$errors" class="invalid-feedback animated fadeIn">
            <span v-for="(itm, index) in v$.time.$errors" :key="`username-${index}`">
              <span v-if="index === 0">
                {{ itm?.$validator === 'minLength' ? 'UserName should be at least 3 characters long' : 'Please enter user name'}}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import 'flatpickr/dist/flatpickr.css';
@import '@/assets/scss/vendor/flatpickr';
</style>