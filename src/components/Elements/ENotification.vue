<script setup>
import {onMounted, ref, computed} from "vue";
import useNotify from "@/composables/useNotify";

const toastElement = ref(null);
const {Title, Message, Type, IsToastVisible} = useNotify()
const classType = computed(() => `bg-${Type.value}`)
onMounted(() => {
  toastElement.value = new window.bootstrap.Toast(
      document.getElementById('common_notify')
  );
      }
  );

const show = () => {
  console.log("IsToastVisible", IsToastVisible)
  if(IsToastVisible.value){
    console.log("2")
    toastElement.value = new window.bootstrap.Toast(
        document.getElementById('common_notify'),
        {
          autohide: !IsToastVisible,
          delay: IsToastVisible ? 0 : 3000,
        }
    );
  }else {
    console.log("2")
    toastElement.value = new window.bootstrap.Toast(
        document.getElementById('common_notify'),
        {
          delay: 3000,
        }
    );
  }
  toastElement.value.show()
}
const hide = () => {

  toastElement.value.hide()
}
defineExpose({
  show,
  hide
})
</script>

<template>
  <div
      class="position-fixed bottom-0 end-0 p-3 space-y-3"
      style="z-index: 9999"
  >
    <div
        id="common_notify"
        class="toast fade hide"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
      <div class="toast-header text-white" :class="classType">
        <strong class="me-auto">{{Title}}</strong>
        <button
            type="button"
            class="btn-close text-white"
            data-bs-dismiss="toast"
            aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{Message}}
      </div>
    </div>
  </div>
</template>

<style>
</style>