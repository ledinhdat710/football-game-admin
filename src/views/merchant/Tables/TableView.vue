<script setup>
import EIcon from '@/components/Elements/EIcon.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { tableService } from '@/services/table.service'
import { useTemplateStore } from '@/stores/template'

const store = useTemplateStore()

const router = useRouter()
const route = useRoute()
const { id } = route.params

const table = ref()
const title = ref('View table')

const apiGetUser = async () => {
  try {
    store.pageLoader({ mode: 'on' })
    const response = await tableService.get(id)
    table.value = response.data
    store.pageLoader({ mode: 'off' })
  } catch (error) {
    console.log(error)
    store.pageLoader({ mode: 'off' })
  }
}

onMounted(async () => {
  try {
    await apiGetUser()
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
            <router-link to="/merchant/tables">List tables</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>View table</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="container">
    <div class="row justify-content-center py-sm-4 py-md-6">
      <div class="col-sm-10 col-md-8">
        <form @submit.prevent="onSubmit">
          <BaseBlock title="Add User">
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
                  <label class="form-label" for="form-table-name">Table Name</label>
                  <div class="text_table">
                    {{ table?.name }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label" for="form-table-id">Table Id</label>
                  <div class="text_table">
                    {{ table?.id }}
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
.text_table {
  background-color: rgb(244, 244, 244);
  border: 1px solid #e9dddd;
  border-radius: 4px;
  padding: 10px;
  height: 48px;
  align-items: center;
  display: flex;
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
