<script setup>
import { ref } from 'vue';
import { useField } from 'vee-validate';
const props = defineProps(['name', 'placeholder', 'label', 'format'])

const { value, errorMessage } = useField(props.name);
const error = ref({
  error: null || errorMessage,
  validateEvent: false,
});
const disabledDate = (time) => {
  let now = new Date();
  return time < now;
  // :disabled-date="disabledDate"
};

</script>
<template>
  <el-form-item :required="true" v-bind="error" :label="props.label" :style="'w-full'">
    <el-date-picker  size="large" type="datetime" v-model="value" :format="props.format" :placeholder="props.placeholder"/>
  </el-form-item>
</template>
<style scoped>
.w-full {
    width: 100%;
}
</style>