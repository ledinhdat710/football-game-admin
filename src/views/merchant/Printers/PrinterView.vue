<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { id } = route.params

const printer = ref()
const title = ref('View Printer')

const apiGetPrinter = () => {
  printer.value = {
    id: 1,
    printerName: 'printer 1',
    username: 'username',
    accessKey: 'access key'
  }
}

onMounted(async () => {
  try {
    apiGetPrinter()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <BasePageHeading
    :title="title"
    :go-back="true"
    subtitle="Custom functionality to further enrich your tables."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Manages</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/merchant/printers">List printers</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>View printer</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock title="Add Printer">
            <template #options>
              <e-icon
                @click="() => router.back()"
                name="arrow-left"
                role="button"
                class="icon_arrow_left"
              />
            </template>

            <div class="row justify-content-center py-sm-3 py-md-5">
              <div class="col-sm-10 col-md-8">
                <div class="mb-4">
                  <label class="form-label" for="form-printer-name">Printer Name</label>
                  <div class="text_printer">
                    {{ printer?.printerName }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-printer-id">Printer ID</label>
                  <div class="text_printer">
                    {{ printer?.id }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-printer-username">Username</label>
                  <div class="text_printer">
                    {{ printer?.username }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-printer-access-key">Access Key</label>
                  <div class="text_printer">
                    {{ printer?.accessKey }}
                  </div>
                </div>

                <div class="mb-4" :style="{ textAlign: 'end' }">
                  <button
                    class="btn btn-sm btn-primary"
                    :style="{ color: '#fff' }"
                    @click="() => router.push(`${id}/update`)"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </BaseBlock>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text_printer {
  background-color: rgb(244, 244, 244);
  border: 1px solid #e9dddd;
  border-radius: 4px;
  padding: 10px;
	
}

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
