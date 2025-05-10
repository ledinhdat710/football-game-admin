<script setup>
import EButton from '@/components/Elements/EButton.vue';
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import { Dataset, DatasetItem,} from "vue-dataset";
import EModal from "@/components/Elements/EModal.vue";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import ModalFormBank from "@/views/admin/Restaurants/ModalFormBank.vue";
import ModalReconsultionTime from "@/views/admin/Restaurants/ModalReconsultionTime.vue";
import Swal from "sweetalert2";
import { default as FlatPicker } from 'vue-flatpickr-component'
import {useTemplateStore} from "@/stores/template";
import {BankTerminalService} from "@/services/bank.service";
import useNotify from "@/composables/useNotify";
import EListEmpty from "@/components/Elements/EListEmpty.vue";

const router = useRouter()
const route = useRoute();
const {setNotify} = useNotify()
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById('closeModal'); // Gán refBtn cho một phần tử DOM
});
const navigateRestaurent = () => {
  router.push(`/admin/restaurants`)
}

const cols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'Terminal ID',
    field: 'Terminal ID',
    sort: ''
  },
  {
    name: 'Assign Kiosk',
    field: 'Assign Kiosk',
    sort: ''
  },
  {
    name: 'Reconsultion time',
    field: 'Reconsultion time',
    sort: ''
  }
])
let state = reactive({
  username: null,
  password: null,
  time: null,
  id: null,
})

const rules = computed(() => {
  return {
    username: {
      required
    },
    password: {
      required
    },
  }
})

const rulesTime = computed(() => {
  return {
    time: {
      required
    }
  }
})

const listDataBank = ref([])
const configTime = ref();
const id = route.params?.id;
const isShowFormTime = ref();
let vformBank$ = useVuelidate(rules, state)
let vformTime$  = useVuelidate(rulesTime, state)
const store = useTemplateStore()

const handleModalForm = () => {
  isShowFormTime.value = false
  state.username = null
  state.password = null
  vformBank$.value.$reset()
}

const handleModalTime = () => {
  isShowFormTime.value = true
  state.time = configTime.value;
  vformTime$.value.$reset()
}

async function onSubmitBank() {
    if(isShowFormTime.value) {
      await onSubmitConfigTime();
    }else {
        await onSubmitCreateBank();
      }
}

async function onSubmitConfigTime() {
  try {
    const result = await vformTime$.value.$validate();
    console.log("")
    if(!result) return
    let payload = {
      time: state.time,
      store_id: id
    }
    const response = await BankTerminalService.configTime(payload);
    if (!response?.error) {
      onFetchList();
      refBtn.value.click();
      state.time = null;
      vformTime$.value.$reset();
      return setNotify({
        title: 'Success',
        message: "Config time success",
        type: 'success'
      })
    }
  } catch (e) {
    return setNotify({
      title: 'Error',
      message: e?.message
    })
  }
}

async function onSubmitCreateBank() {
  try {
    const result = await vformBank$.value.$validate();
    if(!result) return
    let payload = {
      username: state.username,
      password: state.password,
      store_id: id,
    }
    const response = state.id ? await BankTerminalService.edit(state.id, payload) : await BankTerminalService.create(payload);
    if (!response?.error) {
      onFetchList();
      refBtn.value.click();
      state.username = null,
      state.password = null,
      vformBank$.value.$reset();
      return setNotify({
        title: 'Success',
        message: state.id ? "Update success" : "Create success",
        type: 'success'
      })
    }
  } catch (e) {
    return setNotify({
      title: 'Error',
      message: e?.message
    })
  } finally {
    state.id = null;
  }
}

let toast = Swal.mixin({
  buttonsStyling: false,
  target: "#page-container",
  customClass: {
    confirmButton: "btn btn-success m-1",
    cancelButton: "btn btn-danger m-1",
    input: "form-control",
  },
});

const onOpenDeleteConfirm = (id) => {
  toast
      .fire({
        title: "Are you sure?",
        text: "You will not be able to recover this account terminal!",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn btn-danger m-1",
          cancelButton: "btn btn-info m-1",
        },
        confirmButtonText: "Yes, delete!",
        html: false,
        preConfirm: () => {
          return BankTerminalService.delete(id);
        },
      })
      .then((result) => {
        if (result.value && !result.value?.error) {
          toast.fire(
              "Deleted!",
              "Account has been deleted.",
              "success"
          );
          onFetchList()
        } else if (result.dismiss === "cancel") {
          toast.fire("Cancelled", "Account is safe", "error");
        }
      });
}

const handleModalGetDetail = async (id) => {
  store.pageLoader({ mode: 'on' })
  try {
    const response = await BankTerminalService.getDetail(id);
    state.username = response.data.username;
    state.password = null;
  } catch (err) {
    console.log("err", err)
  } finally {
    isShowFormTime.value = false;
    vformBank$.value.$reset()
    state.id = id;
    store.pageLoader({ mode: 'off' })

  }
}
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: 'on' })
    const response = await BankTerminalService.getList({
      store_id: id,
    })
    if(!response?.error){
      listDataBank.value = response?.data || [];
      configTime.value = response.data?.[0]?.reconsultation_time
    }
    store.pageLoader({ mode: 'off' })

  } catch (error) {
    console.log(error);
    store.pageLoader({ mode: 'off' })
  }
}
const flatPickerState = reactive({
  configTimeStandalone: {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true
  }
})

const forceReconsultation = async(idReconsultaion) => {
  setNotify({
    title: 'Process',
    message: 'Starting recounclitation',
    type: 'warning',
    isToastVisible: true,
  })
  try {
    let payload = {
      store_id: id,
    }
    const response = await BankTerminalService.detailConfigTime(idReconsultaion, payload)
    if (!response?.error) {
      onFetchList();
      return setNotify({
        title: 'Success',
        message: "Update success",
        type: 'success'
      })
    }

  } catch (e) {
    return setNotify({
      title: 'Error',
      message: e?.message
    })
  } finally {
    store.pageLoader({ mode: 'off' })
  }
}

onMounted( async () =>{
  await onFetchList();
})
</script>

<template>
  <BasePageHeading title="Bank Terminal Detail" subtitle="Custom functionality to further enrich your tables.">
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2 gap-1">
          <EButton
              :ref="refButton"
              type="info"
              size="sm"
              data-bs-toggle="modal"
              data-bs-target="#modal-kiosik"
              data-target=".bd-example-modal-lg"
              @click="() => handleModalForm()"
          ><i class="fa fa-plus opacity-50 me-1"></i> Add account</EButton
          >
          <EButton
              :ref="refButton"
              type="info"
              size="sm"
              data-bs-toggle="modal"
              data-bs-target="#modal-kiosik"
              data-target=".bd-example-modal-lg"
              @click="() => handleModalTime()"
          >
            <i class="fa-regular fa-clock me-1"></i> Set Reconsultion time</EButton
          >
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt d-flex justify-content-end">
            <li class="breadcrumb-item">
              <a class="link-fx" @click="navigateRestaurent" href="javascript:void(0)">Store</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">List bank terminals </li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>
  <div class="content" v-for="(item, index) in listDataBank" :key="`bank-terminal-${index}`">
      <BaseBlock :title="item.username" >
        <template #options>
          <div class="d-flex justify-content-end mb-2 gap-1">
            <EButton
                :ref="refButton"
                type="info"
                size="sm"
                data-bs-toggle="modal"
                data-bs-target="#modal-kiosik"
                data-target=".bd-example-modal-lg"
                @click="() => handleModalGetDetail(item?.id)"
            > <i class="fa fa-fw fa-pencil-alt"></i> Edit account</EButton
            >
            <EButton
                type="info"
                size="sm"
                @click="onOpenDeleteConfirm(item?.id)"
            >
              <i class="fa fa-fw fa-times"></i> Delete account</EButton
            >
          </div>
        </template>
      <Dataset :v-slot="{ ds }" :ds-data="item?.terminals" >
          <div class="row" v-if="item?.terminals?.length">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th
                        v-for="(th) in cols"
                        :key="th.field"
                      >
                        {{ th.name }}
                      </th>
                      <th class="text-end" scope="col">Action</th>
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row, index }">
                      <tr>
                        <td style="min-width: 50px">
                          {{index +1}}
                        </td>
                        <td style="min-width: 150px">{{ row?.id }}</td>
                        <td style="min-width: 150px">{{ row?.kiosk?.name }}</td>
                        <td style="min-width: 150px">
                          <FlatPicker
                              id="flat-picker-time-standalone"
                              class="form-control"
                              v-model="item.reconsultation_time"
                              :config="flatPickerState.configTimeStandalone"
                              style="width: 100px"
                              disabled
                          />
                        </td>
                        <td class="text-end">
                          <div class="btn-group items-center gap-1">
                            <button
                                type="button"
                                class="btn btn-sm btn-alt-secondary"
                                @click="forceReconsultation(row?.id)"
                                title="Force reconsultion"
                            >
                              <i class="fa-solid fa-rotate"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </DatasetItem>
                </table>
              </div>
            </div>
          </div>
          <EListEmpty v-else/>
      </Dataset>
      </BaseBlock>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitBank">
    <EModal
        id="modal-kiosik"
        :id-modal="id"
        :title="isShowFormTime ? 'Config Reconsultion time': state.id ? 'Update account' : 'Create account'"
        size="modal-xl"
        ok-text="Confirm"
        ok-type="submit"
        :close-on-submit="false"
        @confirm="onSubmitBank"
    >
      <template v-slot:childrenComponent>
        <ModalReconsultionTime v-if="isShowFormTime" :v$="vformTime$" :state="state"/>
        <ModalFormBank v-else :v$="vformBank$" :state="state"/>
      </template>
    </EModal>
  </form>
</template>
<style lang="scss">
@import 'flatpickr/dist/flatpickr.css';
@import '@/assets/scss/vendor/flatpickr';
</style>
