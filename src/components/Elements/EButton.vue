<script setup>
import {computed} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: ''
  },
  bsToggle: {
    type: String,
    default: ''
  },
  bsTarget: {
    type: String,
    default: ''
  }
})

const typeButton = computed(() => `btn-${props.type}`)
const sizeButton = computed(() => props.size ? `btn-${props.size}` : '')
const emit = defineEmits(['click'])
const onClick = () => emit('click')
</script>

<template>
  <button :data-bs-toggle="props.bsToggle" :data-bs-target="props.bsTarget" type="button" class="btn" :class="[typeButton, sizeButton]" :disabled="props.disabled" @click="onClick"><slot /></button>
</template>

<style scoped>

</style>