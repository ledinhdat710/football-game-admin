<script setup>
const props = defineProps(['v$','state','id'])

const {v$, state} = props;
</script>

<template>
  <div class="content">
    <div class="row justify-content-start">
      <div class="col-sm-12 col-md-12">
            <div class="row justify-content-center">
              <div class="col-sm-10 col-md-12">
                <div class="mb-4">
                  <label class="form-label" for="form-printer-name"
                    >Printer Name<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="form-printer-name"
                    name="form-printer-name"
                    placeholder="Enter printer name..."
                    :class="{
                      'is-invalid': v$.name.$errors.length
                    }"
                    v-model="state.name"
                    @blur="v$.name.$touch"
                  />
                  <div v-if="v$.name.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter name printer
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-printer-id"
                    >Printer Id<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="form-printer-id"
                    name="form-printer-id"
                    placeholder="Enter Printer Id..."
                    :class="{
                      'is-invalid': v$.printer_id.$errors.length
                    }"
                    v-model="state.printer_id"
                    @blur="v$.printer_id.$touch"
                  />
                  <div v-if="v$.printer_id.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter id printer
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-username"
                    >UserName<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="form-username"
                    name="form-username"
                    placeholder="Enter username printer"
                    :class="{
                      'is-invalid': v$.username.$errors.length
                    }"
                    v-model="state.username"
                    @blur="v$.username.$touch"
                  />
                  <div v-if="v$.username.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter username
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-access-key"
                    >Access key<span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="form-access-key"
                    name="form-access-key"
                    placeholder="Enter access key"
                    :class="{
                      'is-invalid': v$.access_key.$errors.length
                    }"
                    v-model="state.access_key"
                    @blur="v$.access_key.$touch"
                  />
                  <div v-if="v$.access_key.$errors.length" class="invalid-feedback animated fadeIn">
                    Please enter access key
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon_arrow_left {
  background-color: rgb(243, 235, 235);
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
