<script setup>
import VInputText from '@/components/ElementPlus/VInputText.vue'
import VElementDateTimePicker from '@/components/ElementPlus/VElementDateTimePicker.vue'
import VSwitch from '@/components/ElementPlus/VSwitch.vue'
import CKEditor from '@/components/ElementPlus/CKEditor.vue';
import { onMounted } from 'vue';
const emit = defineEmits(['modalMounted'])


onMounted(() => {
  emit('modalMounted')
})


</script>
<template>
  <CKEditor style="padding: 25px 25px 0 25px;" label="Announcement content" name="content"></CKEditor>
  <el-form class="custom-container" label-position="top">
    <VElementDateTimePicker label="Start time" name="start_time" placeholder="Please choose start time" format="DD/MM/YYYY HH:mm"/>
    <VElementDateTimePicker label="End time" name="end_time" placeholder="Please choose end time" format="DD/MM/YYYY HH:mm"/>
    <div style="color: #212529; font-size: 15px; font-weight: 500;"><span style="color: #f56c6c;">*</span> Is show</div>
    <VSwitch name="is_show"/>
  </el-form>
</template>
<style scoped>
.custom-container {
  padding: 25px;
}
</style>