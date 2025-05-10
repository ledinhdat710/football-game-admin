<script setup>
import EButton from '@/components/Elements/EButton.vue';
import EListEmpty from '@/components/Elements/EListEmpty.vue';
import moment from "moment";
import { useForm } from "vee-validate";
import * as yup from "yup";
import useNotify from '@/composables/useNotify';
import { announcementService } from '@/services/announcement.service';
import { useTemplateStore } from '@/stores/template';
import ModalFormAnnouncement from '@/views/admin/Announcement/ModalFormAnnouncement.vue';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';
import { computed, onMounted, reactive, ref } from 'vue';
import {
  Dataset,
  DatasetInfo,
  DatasetItem,
  DatasetPager,
  DatasetSearch,
  DatasetShow
} from 'vue-dataset';

let toast = Swal.mixin({
  buttonsStyling: false,
  target: "#page-container",
  customClass: {
    confirmButton: "btn btn-success m-1",
    cancelButton: "btn btn-danger m-1",
    input: "form-control",
  },
});
const store = useTemplateStore()
const { setNotify } = useNotify()
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById('closeModal'); // Gán refBtn cho một phần tử DOM
});
const validationSchema = yup.object({
  content: yup.string().required("Please enter announcements content").trim(),
  start_time: yup.string().required("Please choose start time").trim().nullable()
    .test("date-range", "The start time must not be later than the end time", function (value) {
      const { end_time } = this.parent;
      const date1 = moment(value);
      const date2 = moment(end_time);
      if (value && end_time) {
        return date1.isBefore(date2);
      }
      return true;
    }),
  end_time: yup.string().required("Please choose end time").trim(),
});
function stripHtml(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return (
    tmp.textContent.replace(/\n/g, ' ') ||
    tmp.innerText.replace(/\n/g, ' ') ||
    ''
  );
}
const { values, handleSubmit, setFieldValue, resetForm, setFieldError } = useForm({
  validationSchema,
  initialValues: {
    content: null
  }
});

// Helper variables
const cols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'Content',
    field: 'content',
    sort: ''
  },
  {
    name: 'Is Show',
    field: 'is_show',
    sort: ''
  },
  {
    name: 'Start Time',
    field: 'start_time',
    sort: ''
  },
  {
    name: 'End Time',
    field: 'start_time',
    sort: ''
  }
])

const listAnnouncements = ref([])
const dialogVisible = ref(false)
const onFetchList = async () => {
  try {
    store.pageLoader({ mode: 'on' })
    const response = await announcementService.getList()
    if (!response?.error) {
      listAnnouncements.value = response.data?.data || []
    }
    store.pageLoader({ mode: 'off' })
  } catch (error) {
    console.log(error)
    store.pageLoader({ mode: 'off' })
  }
}

const openForm = async () => {
  formType.value = 'add'
  dialogVisible.value = true
}
const itemId = ref()
const handleModalFormUpdate = async (id) => {
  store.pageLoader({ mode: 'on' })
  formType.value = 'edit'
  itemId.value = id
  const response = await announcementService.get(id)
  const data = response.data
  setFieldValue('content', data.content)
  setFieldValue('start_time', moment(data.start_time).toDate())
  setFieldValue('end_time', moment(data.end_time).toDate())
  setFieldValue('is_show', data.is_show)
  dialogVisible.value = true
  console.log(data);
  store.pageLoader({ mode: 'off' })
}

onMounted(async () => {
  await onFetchList()
  setFieldValue('is_show', false)
  document.querySelectorAll('#datasetLength label').forEach((el) => {
    el.remove()
  })
  let selectLength = document.querySelector('#datasetLength select')
  if (selectLength) {
    selectLength.classList = ''
    selectLength.classList.add('form-select')
    selectLength.style.width = '80px'
  }
})
const formType = ref()
const onOpenDeleteConfirm = (id) => {
  toast
    .fire({
      title: "Are you sure?",
      text: "You will not be able to recover this announcement!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger m-1",
        cancelButton: "btn btn-info m-1",
      },
      confirmButtonText: "Yes, delete!",
      html: false,
      preConfirm: () => {
        return announcementService.delete(id)
      },
    })
    .then((result) => {
      if (result.value && !result.value?.error) {
        toast.fire(
          "Deleted!",
          "Announcement has been deleted.",
          "success"
        );
        onFetchList()
      } else if (result.dismiss === "cancel") {
        toast.fire("Cancelled", "Announcement is safe", "error");
      }
    });
}
const onSubmitAnnouncement = handleSubmit(async () => {
  if (formType.value === 'add') {
    await onSubmitCreateAnnouncement();
  } else {
    await onSubmitUpdateAnnouncement();
  }
});
async function onSubmitCreateAnnouncement() {
  try {
    let payload = {
      content: values.content,
      start_time: moment(values.start_time).format('YYYY-MM-DD HH:mm'),
      end_time: moment(values.end_time).format('YYYY-MM-DD HH:mm'),
      is_show: values.is_show ? 1 : 0
    }
    store.pageLoader({ mode: 'on' })
    const response = await announcementService.create(payload)
    if (!response?.error) {
      await onFetchList();
      store.pageLoader({ mode: 'off' })
      closeForm()
      return setNotify({
        title: 'Success',
        message: "Create success",
        type: 'success'
      })
    }
  } catch (e) {
    store.pageLoader({ mode: 'off' })
    return setNotify({
      title: 'Error',
      message: e?.message,
    })
  }
}

async function onSubmitUpdateAnnouncement() {
  try {
    let payload = {
      content: values.content,
      start_time: moment(values.start_time).format('YYYY-MM-DD HH:mm'),
      end_time: moment(values.end_time).format('YYYY-MM-DD HH:mm'),
      is_show: values.is_show ? 1 : 0
    }
    store.pageLoader({ mode: 'on' })
    const response = await announcementService.update(itemId.value, payload)
    if (!response?.error) {
      await onFetchList();
      store.pageLoader({ mode: 'off' })
      closeForm()
      return setNotify({
        title: 'Success',
        message: "Create success",
        type: 'success'
      })
    }
  } catch (e) {
    store.pageLoader({ mode: 'off' })
    return setNotify({
      title: 'Error',
      message: e?.message,
    })
  }
}

const closeForm = () => {
  dialogVisible.value = false
  resetForm({ force: true })
  console.log('đã reset');
}
const modalMounted = () => {
  if (formType.value === 'add') {
    setFieldValue('is_show', false)
    setTimeout(() => {
      setFieldError('content', '')
    }, 100)
  }
}

</script>

<template>
  <BasePageHeading title="List Announcements" subtitle="View and manage all your announcement." :go-back="true">
    <template #extra>
      <div class="flex flex-col">
        <div class="d-flex justify-content-end mb-2">
          <EButton type="info" size="sm" @click="openForm"><i class="fa fa-plus opacity-50 me-1"></i> New announcements
          </EButton>
        </div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb breadcrumb-alt">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)">Manages</a>
            </li>
            <li class="breadcrumb-item" aria-current="page">List Announcements </li>
          </ol>
        </nav>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Announcements">
      <Dataset v-slot="{ ds }" :ds-data="listAnnouncements" :ds-search-in="['id', 'content']">
        <div v-show="listAnnouncements?.length">
          <div class="row" :data-page-count="ds.dsPagecount">
            <div id="datasetLength" class="col-md-8 py-2">
              <DatasetShow />
            </div>
            <div class="col-md-4 py-2">
              <DatasetSearch ds-search-placeholder="Search..." />
            </div>
          </div>
          <hr />
          <div class="row" v-if="listAnnouncements?.length">
            <div class="col-md-12">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th v-for="(th) in cols" :key="th.field">
                        {{ th.name }}
                      </th>
                      <th class="text-end" scope="col">Action</th>
                    </tr>
                  </thead>
                  <DatasetItem tag="tbody" class="fs-sm">
                    <template #default="{ row }">
                      <tr>
                        <td style="min-width: 50px">
                          {{ row.id }}
                        </td>
                        <td style="min-width: 150px">{{ stripHtml(row?.content) }}</td>
                        <td style="max-width: 150px">
                        <div class="form-check form-switch" >
                          <input
                            style="pointer-events: none;"
                            class="form-check-input"
                            type="checkbox"
                            :checked="row?.is_show"
                          />
                        </div>
                      </td>
                        <td style="min-width: 150px">{{ row?.start_time }}</td>
                        <td style="min-width: 150px">{{ row?.end_time }}</td>
                        <td class="text-end">
                          <div class="btn-group">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#modal-announcement"
                              data-target=".bd-example-modal-lg" class="btn btn-sm btn-alt-secondary"
                              @click="() => handleModalFormUpdate(row?.id)">
                              <i class="fa fa-fw fa-pencil-alt"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-alt-secondary"
                              @click="onOpenDeleteConfirm(row?.id)">
                              <i class="fa fa-fw fa-times"></i>
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
          <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
            <DatasetInfo class="py-3 fs-sm" />
            <DatasetPager class="flex-wrap py-3 fs-sm" />
          </div>
        </div>
        <EListEmpty v-if="!listAnnouncements?.length" />
      </Dataset>
    </BaseBlock>
  </div>
  <el-dialog :destroy-on-close="true" v-model="dialogVisible" :title="formType === 'add'  ? 'Add New Announcement' : 'Update Announcement'" width="500" @close="closeForm">
  <div class="dialog-container">
    <ModalFormAnnouncement @modalMounted="modalMounted"></ModalFormAnnouncement>
  </div>
    <template #footer>
      <div class="dialog-footer">
    <div class="cancel-button">
        <el-button @click="closeForm">Cancel</el-button>
      </div>
        <el-button type="primary" @click="onSubmitAnnouncement">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.gg-select {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}

.gg-select::after,
.gg-select::before {
  content: '';
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}

.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}

.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}

th.sort {
  cursor: pointer;
  user-select: none;

  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }

  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}
.cancel-button ::v-deep .el-button {
  background-color: #ebeef2 !important;
  color: #212529 !important;
  border-color: #ebeef2 !important;
}
.cancel-button{
  display: inline-block;
}
.dialog-container {
  padding: 20px 30px 0 30px;
}
</style>
