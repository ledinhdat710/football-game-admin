<script setup>
const props = defineProps(['v$','state'])
const {v$, state} = props;

</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
        <label class="text-danger">Supported variables: {$order_no} {$receipt} {$store_name} {$order_nr}
        </label>
        <div class="mb-4">
          <label class="form-label" for="block-form-name"
          >Message:</label
          >
          <textarea type="text" class="form-control" id="form-user-name" placeholder="Enter message..." :class="{
            'is-invalid': v$.message.$errors.length
            }"
                 @input="(e) => emit('handleChangeValue', e.target.value, 'message')"
                 v-model="state.message"
          />
        </div>
        <div class="mb-4">
          <label class="form-label" for="block-form-table-id">Sender:</label>
          <input type="text" class="form-control" id="form-user-name" placeholder="Enter sender..." :class="{
            'is-invalid': v$.sender.$errors.length
            }"
                 @input="(e) => emit('handleChangeValue', e.target.value, 'sender')"
                 v-model="state.sender"
                 @blur="v$.sender.$touch"
          />
        </div>
      </div>
    </div>
  </div>
</template>