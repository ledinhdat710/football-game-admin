<script setup>
import { ref } from 'vue';
import { useField } from 'vee-validate';
const props = defineProps(['name', 'placeholder', 'label'])

const { value, errorMessage } = useField(props.name);
const error = ref({
  error: null || errorMessage,
  validateEvent: false,
});

</script>
<template>
  <el-form-item size="large"  :required="true" v-bind="error" :label="props.label" :style="'w-full'">
    <el-input type="textarea" v-model="value" :placeholder="props.placeholder"/>
  </el-form-item>
</template>
<style scoped>
.w-full {
    width: 100%;
}
</style>