<script setup>
import { ref } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import { useField } from 'vee-validate';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const props = defineProps(['name', 'label'])
const { value, errorMessage } = useField(props.name);
let ckeditor = CKEditor.component;
const editorConfig = ref({});

</script>
<template>
    <div>
    <div class="contaier">
        <div style="color: #212529; font-size: 15px; font-weight: 500;"><span style="color: #f56c6c;">*</span> {{ label }}</div>
        <div :class="`${errorMessage ? 'textBox' : ''}`">
        <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="value" />
        </div>
    </div>
    <div class="err-mess" v-if="errorMessage" >{{errorMessage}}</div>
</div>
</template>
<style scoped>
.contaier {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.textBox {
  border: 1px solid #f56c6c;
}
.err-mess {
    color: #f56c6c;
    font-size: 13px;
}
</style>
