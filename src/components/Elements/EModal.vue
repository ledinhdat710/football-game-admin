<script setup>
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  idModal: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: "",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  okText: {
    type: String,
    default: "Confirm",
  },
  okTextAdd: {
    type: String,
    default: "Confirm & New",
  },
  isShowTextAdd: {
    type: Boolean,
    default: true,
  },
  okType: {
    type: String,
    default: "button",
  },
  okTypeNew: {
    type: String,
    default: "button",
  },
  position: {
    type: String,
    default: "modal-dialog-centered",
  },
  subtitle: {
    type: String,
    default: "",
  },
  closeOnSubmit: {
    type: Boolean,
    default: true,
  },
  handleConfirm: {
    type: Function,
  },
  domModal: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div
    class="modal"
    :id="props.id"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div :class="`modal-dialog ${props.position}`" role="document">
      <div class="modal-content">
        <BaseBlock :title="props.title" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              :id="'closeModal' + domModal"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="close"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div v-if="!!props.subtitle" class="block-content fs-sm">
              <p>{{ props.subtitle }}</p>
            </div>
            <slot name="childrenComponent"></slot>
            <div class="block-content block-content-full text-end bg-body">
              <slot name="footer">
                <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary me-1"
                  data-bs-dismiss="modal"
                  @click="close"
                >
                  {{ props.cancelText }}
                </button>
                <button
                  :type="props.okType"
                  class="btn btn-sm btn-primary text-white"
                  data-bs-dismiss="modal"
                  v-if="props.closeOnSubmit"
                  @click="emit('confirm')"
                >
                  {{ props.okText }}
                </button>
                <button
                  :type="props.okType"
                  class="btn btn-sm btn-primary text-white"
                  v-else
                >
                  {{ props.okText }}
                </button>
                <button
                  type="button"
                  style="margin-left: 4px"
                  class="btn btn-sm btn-primary text-white"
                  v-if="!idModal && isShowTextAdd"
                  @click="$emit('confirmNew', 'add')"
                >
                  {{ props.okTextAdd }}
                </button>
              </slot>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
