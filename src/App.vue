<template>
  <RouterView />
  <ENotification ref="ENotificationRef" />
</template>

<style lang="scss">
// Main Stylesheet
@import "@/assets/scss/main";

// All color themes are included and available by default
// Feel free to comment out any of them if you won't use them in your project
@import "@/assets/scss/oneui/themes/amethyst";
@import "@/assets/scss/oneui/themes/city";
@import "@/assets/scss/oneui/themes/flat";
@import "@/assets/scss/oneui/themes/modern";
@import "@/assets/scss/oneui/themes/smooth";
</style>
<script setup lang="ts">
import ENotification from "@/components/Elements/ENotification.vue";
import {ref, onMounted} from "vue";
import useNotify from "@/composables/useNotify";

const ENotificationRef = ref()
const {setNotifyElement} = useNotify()

onMounted(() => {
  setNotifyElement(ENotificationRef.value)
})
</script>