<script setup>
import {computed} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'fa'
  },
  size: {
    type: String,
    default: '1x'
  },
  name: {
    type: String,
    default: ''
  }
})

const sizeIcon = computed(() => props.size ? `fa-${props.size}` : '') //don vi 1x: 1rem, 2x: 2rem

const emit = defineEmits(['click'])
const onClick = () => emit('click')
</script>

<template>
  <i :class="`${props.type} ${sizeIcon} ${props.type}-${props.name}`" @click="onClick"></i>
</template>

<style scoped>

</style>