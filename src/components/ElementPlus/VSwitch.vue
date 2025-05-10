<script setup>
import { ref } from 'vue';
import { useField } from 'vee-validate';
const props = defineProps(['name', 'label'])

const { value, errorMessage } = useField(props.name);
const error = ref({
  error: null || errorMessage,
  validateEvent: false,
});

</script>
<template>
  <el-form-item :required="true" v-bind="error" :label="props.label" :style="'w-full'">
    <el-switch v-model="value" />
  </el-form-item>
</template>
<style scoped>
.w-full {
    width: 100%;
}
</style>