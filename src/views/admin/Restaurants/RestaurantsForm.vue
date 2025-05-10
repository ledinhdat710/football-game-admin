<script setup>
import { useTemplateStore } from "@/stores/template";
import useNotify from "@/composables/useNotify";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { required, sameAs } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { restaurantService } from "@/services/restaurant.service";
import { planService } from "@/services/plan.service";
import EButton from "@/components/Elements/EButton.vue";
import EModal from "@/components/Elements/EModal.vue";
import ChangePassword from "@/views/admin/Restaurants/ChangePassword.vue";
import { default as FlatPicker } from "vue-flatpickr-component";

const store = useTemplateStore();

const flatPickerState = reactive({
  configTimeStandalone: {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i:S",
    time_24hr: true,
    enableSeconds: true,
  },
});

const route = useRoute();
const router = useRouter();
const { setNotify } = useNotify();
const typeSubmit = ref();
const id = route.params?.id;
const restaurantDetail = ref();
const errorMessage = ref();
const isCheckSizeLogo = ref(false);
const isCheckSizeBanner = ref(false);
const initialVal = ref({
  name: null,
  slug: null,
  org_number: null,
  language: "en",
  email: null,
  contact_person: null,
  address: null,
  user_name: null,
  user_email: null,
  password: null,
  custom_footer: null,
  plans: [],
  stripe: {
    stripe_key: "",
    stripe_secret: "",
  },
  vipps: {
    vipps_client_id: "",
    vipps_client_secret: "",
    vipps_merchant_serial_number: "",
    vipps_subscription_key: "",
  },
  bambora: {
    api_key: "",
    md5_key: "",
  },
  logo: null,
  banner: null,
  slogan: "",
  stripe_apple_payment: false,
  stripe_google_payment: false,
  phone_number: null,
  dark_mode: false,
  use_dinein: false,
  dinein_name: null,
  dinein_fee: "0",
  reconsultation_at: "04:00:00",
  reconsultation_last_at: "",
});
const formData = ref(initialVal.value);

let stateChangePassword = reactive({
  newPassword: null,
  confirmPassword: null,
});
const rulesChangePassword = computed(() => {
  let output = {
    newPassword: {
      required,
    },
    confirmPassword: {
      required,
      sameAs: sameAs(computed(() => stateChangePassword.newPassword)),
    },
  };
  return output;
});
const isCheckValidSizeLogo = (value) => {
  if (value && value?.size) {
    if (value?.size > 1024 * 1024 * 10 && !!value) {
      isCheckSizeLogo.value = true;
    } else {
      isCheckSizeLogo.value = false;
    }
    return value.size < 1024 * 1024 * 10;
  }
  return true;
};
const isCheckValidSizeBanner = (value) => {
  if (value && value?.size) {
    if (value?.size > 1024 * 1024 * 10 && !!value?.size) {
      isCheckSizeBanner.value = true;
    } else {
      isCheckSizeBanner.value = false;
    }
    return value.size < 1024 * 1024 * 10;
  }
  return true;
};
const rules = computed(() => {
  const baseRules = {
    name: {
      required,
    },
    slug: {
      required,
    },
    org_number: {
      required,
    },
    email: {
      required,
    },
    contact_person: {
      required,
    },
    address: {
      required,
    },
    user_name: {
      required,
    },
    user_email: {
      required,
    },
    password: {
      required,
    },
    phone_number: {
      required,
    },
    logo: {
      isCheckValidSizeLogo,
    },
    banner: {
      isCheckValidSizeBanner,
    },
  };
  if (id) {
    delete baseRules.user_name;
    delete baseRules.user_email;
    delete baseRules.password;
  }
  return baseRules;
});

let v$ = useVuelidate(rules, formData.value);

let vChangePassword$ = useVuelidate(rulesChangePassword, stateChangePassword);
const refBtn = ref(null);
onMounted(() => {
  refBtn.value = document.getElementById("closeModal"); // Gán refBtn cho một phần tử DOM
});
async function onSubmit() {
  const result = await v$.value.$validate();
  if (isCheckSizeLogo.value || isCheckSizeBanner.value) {
    return;
  }
  if (!result) {
    return;
  }
  const payload = new FormData();
  const _formData = {
    name: formData.value.name,
    slug: formData.value.slug,
    org_number: formData.value.org_number,
    email: formData.value.email,
    contact_person: formData.value.contact_person,
    address: formData.value.address,
    custom_footer: formData.value.custom_footer,
    user_name: formData.value.user_name,
    user_email: formData.value.user_email,
    password: formData.value.password,
    logo: formData.value.logo,
    banner: formData.value.banner,
    language: formData.value.language,
    slogan: formData.value.slogan,
    phone_number: formData.value.phone_number,
    stripe_apple_payment: formData.value.stripe_apple_payment ? 1 : 0,
    stripe_google_payment: formData.value.stripe_google_payment ? 1 : 0,
    dark_mode: formData.value.dark_mode,
    use_dinein: formData.value.use_dinein,
    dinein_name: formData.value.dinein_name,
    dinein_fee: formData.value.dinein_fee,
    reconsultation_at: formData.value.reconsultation_at,
    reconsultation_last_at: formData.value.reconsultation_last_at,
  };
  for (let key in _formData) {
    const value = _formData[key];
    let valueAppend = null;
    if (value === true) {
      valueAppend = 1;
    } else if (value === false) {
      valueAppend = 0;
    } else if (value === null || value === undefined) {
      valueAppend = "";
    } else {
      valueAppend = value;
    }
    payload.append(key, valueAppend);
  }

  const newPlans = listPlans.value.map((oldPlan) => {
    const found = formData.value.plans.includes(oldPlan.id);
    return { plan_id: oldPlan.id, active: found ? true : false };
  });
  payload.append("plans", JSON.stringify(newPlans));
  payload.append(
    "payment_information",
    JSON.stringify({
      stripe: formData.value.stripe,
      vipps: formData.value.vipps,
      bambora: formData.value.bambora,
    })
  );
  if (id) {
    payload.append("_method", "PATCH");
  }

  try {
    store.pageLoader({ mode: "on" });
    const response = id
      ? await restaurantService.edit(id, payload)
      : await restaurantService.create(payload);
    store.pageLoader({ mode: "off" });
    if (!response?.error) {
      if (typeSubmit.value === "confirm") {
        return await router.push("/admin/restaurants");
      }
      formData.value = initialVal.value;
      v$.value.$reset();
    }
    store.pageLoader({ mode: "off" });
    setNotify({
      title: "Success",
      message: response?.message,
      type: "success",
    });
  } catch (e) {
    store.pageLoader({ mode: "off" });
    return setNotify({
      title: "Error",
      message: e?.message,
    });
  }

  // perform async actions
}

const onUploadBanner = (event) => {
  const files = event.target.files;
  if (files?.length) {
    formData.value.banner = files[0];
  } else {
    isCheckSizeBanner.value = false;
  }
};

const onUploadLogo = (event) => {
  const files = event.target.files;
  if (files?.length) {
    formData.value.logo = files[0];
  } else {
    isCheckSizeLogo.value = false;
  }
};

async function onSubmitPassword() {
  try {
    const result = await vChangePassword$.value.$validate();
    if (!result) return;
    let payload = {
      new_password: stateChangePassword.newPassword,
      new_password_confirmation: stateChangePassword.confirmPassword,
    };

    const response = await restaurantService.changePassword(
      restaurantDetail?.value?.manager_id,
      payload
    );
    if (!response?.error) {
      refBtn.value.click();
    }
    (stateChangePassword.newPassword = null),
      (stateChangePassword.confirmPassword = null),
      vChangePassword$.value.$reset();
    return setNotify({
      title: "Success",
      message: response?.message,
      type: "success",
    });
  } catch (e) {
    return setNotify({
      title: "Error",
      message: e?.message,
    });
  }
}

const listPlans = ref([]);
const onFetchListPlans = async () => {
  const response = await planService.getList();
  if (!response.error) {
    listPlans.value = response.data || [];
  } else {
    listPlans.value = [];
  }
};

const onFetchRestaurantDetail = async (id) => {
  const response = await restaurantService.getDetail(id);
  if (!response.error) {
    restaurantDetail.value = response?.data || [];
    formData.value = {
      ...formData.value,
      name: restaurantDetail.value?.name || null,
      slug: restaurantDetail.value?.slug || null,
      org_number: restaurantDetail.value?.org_number || null,
      custom_footer: restaurantDetail.value?.custom_footer || null,
      email: restaurantDetail.value?.email || null,
      contact_person: restaurantDetail.value?.contact_person || null,
      address: restaurantDetail.value?.address || null,
      user_name: restaurantDetail.value?.user_name || null,
      user_email: restaurantDetail.value?.user_email || null,
      plans: restaurantDetail.value?.plans
        ?.filter((plan) => plan?.active)
        ?.map((plan) => plan.id),
      logo: restaurantDetail.value?.logo,
      banner: restaurantDetail.value?.banner,
      language: restaurantDetail.value?.language,
      slogan: restaurantDetail.value?.slogan,
      phone_number: restaurantDetail.value?.phone_number,
      stripe_apple_payment: restaurantDetail.value?.stripe_apple_payment,
      stripe_google_payment: restaurantDetail.value?.stripe_google_payment,
      dark_mode: restaurantDetail.value?.dark_mode,
      use_dinein: restaurantDetail.value?.use_dinein,
      dinein_name: restaurantDetail.value?.dinein_name,
      dinein_fee: restaurantDetail.value?.dinein_fee,
      reconsultation_at: restaurantDetail.value?.reconsultation_at,
      reconsultation_last_at: restaurantDetail.value?.reconsultation_last_at,
    };
    if (restaurantDetail.value?.banner) {
      previewBanner.value = restaurantDetail.value?.banner;
    }
    if (restaurantDetail.value?.logo) {
      previewLogo.value = restaurantDetail.value?.logo;
    }
    if (restaurantDetail.value?.payment_information) {
      const paymentInfo = JSON.parse(
        restaurantDetail.value?.payment_information
      );
      formData.value.stripe = paymentInfo?.stripe
        ? { ...paymentInfo?.stripe }
        : null;
      formData.value.vipps = paymentInfo?.vipps
        ? { ...paymentInfo?.vipps }
        : null;
      formData.value.bambora = paymentInfo?.bambora
        ? { ...paymentInfo?.bambora }
        : {
            api_key: null,
            md5_key: null,
          };
    }
    v$ = useVuelidate(rules, formData.value);
  } else {
    restaurantDetail.value = null;
  }
};
const previewLogo = ref();
const previewBanner = ref();

onMounted(async () => {
  try {
    store.pageLoader({ mode: "on" });
    await onFetchListPlans();
    if (id) {
      await onFetchRestaurantDetail(id);
    }
    store.pageLoader({ mode: "off" });
  } catch (error) {
    store.pageLoader({ mode: "off" });
    console.error("Error fetching data:", error);
  }
});

const handleSubmit = (type) => {
  typeSubmit.value = type;
};

const handleChangeSwitch = (val, checked) => {
  console.log("checked", checked);
  if (checked) {
    formData.value.plans.push(val);
  } else {
    formData.value.plans = formData.value?.plans?.filter((itm) => itm !== val);
  }
  console.log("formData.value.plans", formData.value.plans);
};
</script>

<template>
  <BasePageHeading
    :title="id ? 'Update restaurant' : 'Add new restaurant'"
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
            <router-link to="/admin/restaurants">List Restaurants</router-link>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <span>{{ id ? "Update restaurant" : "Add new restaurant" }}</span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <div class="row">
      <div v-if="!!id" class="col-sm-12 col-md-12 text-end mb-4">
        <EButton
          type="info"
          size="sm"
          data-bs-toggle="modal"
          data-bs-target="#modal-change-password"
        >
          Change Password
        </EButton>
      </div>
      <div class="col-sm-12">
        <form @submit.prevent="onSubmit">
          <BaseBlock
            :title="
              id
                ? `Update restaurant ${restaurantDetail?.name}`
                : 'Add restaurant'
            "
          >
            <template #options>
              <e-icon
                @click="() => router.back()"
                name="arrow-left"
                role="button"
                class="icon_arrow_left"
              />
            </template>
            <ul class="nav nav-tabs nav-tabs-block" role="tablist">
              <li class="nav-item">
                <button
                  class="nav-link active"
                  id="btabs-business-information-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#btabs-business-information"
                  role="tab"
                  type="button"
                  aria-controls="btabs-business-information"
                  aria-selected="true"
                >
                  Business Information
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  id="btabs-payment-setting-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#btabs-payment-setting"
                  role="tab"
                  type="button"
                  aria-controls="btabs-payment-setting"
                  aria-selected="false"
                >
                  Payment Settings
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  id="btabs-dinein-fee-setting-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#btabs-dinein-fee-setting"
                  role="tab"
                  type="button"
                  aria-controls="btabs-dinein-fee-setting"
                  aria-selected="false"
                >
                  Dine-in fee
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  id="btabs-modules-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#btabs-modules"
                  role="tab"
                  type="button"
                  aria-controls="btabs-modules"
                  aria-selected="false"
                >
                  Modules
                </button>
              </li>
            </ul>
            <div class="block-content tab-content">
              <div
                class="tab-pane active"
                id="btabs-business-information"
                role="tabpanel"
                aria-labelledby="btabs-business-information-tab"
                tabindex="0"
              >
                <div class="row">
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-name"
                        >Name<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-name"
                        placeholder="Enter name"
                        :class="{
                          'is-invalid': v$.name.$errors.length,
                        }"
                        v-model="formData.name"
                        @blur="v$.name.$touch"
                      />
                      <div
                        v-if="v$.name.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter name
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-slug"
                        >Slug<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-slug"
                        placeholder="Enter slug"
                        v-model="formData.slug"
                        :class="{
                          'is-invalid': v$.slug.$errors.length,
                        }"
                        @blur="v$.slug.$touch"
                      />
                      <div
                        v-if="v$.slug.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter slug
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-org_number"
                        >Org number<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-org_number"
                        placeholder="Enter number"
                        v-model="formData.org_number"
                        :class="{
                          'is-invalid': v$.org_number.$errors.length,
                        }"
                        @blur="v$.org_number.$touch"
                      />
                      <div
                        v-if="v$.org_number.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter org number
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-email"
                        >Email<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-email"
                        placeholder="Enter email"
                        v-model="formData.email"
                        :class="{
                          'is-invalid': v$.email.$errors.length,
                        }"
                        @blur="v$.email.$touch"
                      />
                      <div
                        v-if="v$.email.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter email
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-contact_person"
                        >Contact person<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-contact_person"
                        placeholder="Enter contact person"
                        v-model="formData.contact_person"
                        :class="{
                          'is-invalid': v$.contact_person.$errors.length,
                        }"
                        @blur="v$.contact_person.$touch"
                      />
                      <div
                        v-if="v$.contact_person.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter contact person
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-address"
                        >Address<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-address"
                        placeholder="Enter address"
                        v-model="formData.address"
                        :class="{
                          'is-invalid': v$.address.$errors.length,
                        }"
                        @blur="v$.address.$touch"
                      />
                      <div
                        v-if="v$.address.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter address
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6" v-if="!id">
                    <div class="mb-2">
                      <label class="form-label" for="form-user_name"
                        >User name<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-user_name"
                        placeholder="Enter user name"
                        v-model="formData.user_name"
                        :class="{
                          'is-invalid': v$.user_name.$errors.length,
                        }"
                        @blur="v$.user_name.$touch"
                      />
                      <div
                        v-if="v$.user_name.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter user name
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6" v-if="!id">
                    <div class="mb-2">
                      <label class="form-label" for="form-user_email"
                        >User email<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-user_email"
                        placeholder="Enter user email"
                        v-model="formData.user_email"
                        :class="{
                          'is-invalid': v$.user_email.$errors.length,
                        }"
                        @blur="v$.user_email.$touch"
                      />
                      <div
                        v-if="v$.user_email.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter user email
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6" v-if="!id">
                    <div class="mb-2">
                      <label class="form-label" for="form-password"
                        >Password<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-password"
                        placeholder="Enter password"
                        v-model="formData.password"
                        :class="{
                          'is-invalid': v$.password.$errors.length,
                        }"
                        @blur="v$.password.$touch"
                      />
                      <div
                        v-if="v$.password.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter password
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-language"
                        >Language<span class="text-danger">*</span></label
                      >
                      <select
                        class="form-select"
                        id="form-language"
                        v-model="formData.language"
                      >
                        <option value="en">English</option>
                        <option value="nor">Norwegian</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-phone"
                        >Phone number<span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-phone"
                        placeholder="Enter password"
                        v-model="formData.phone_number"
                        :class="{
                          'is-invalid': v$.phone_number.$errors.length,
                        }"
                        @blur="v$.phone_number.$touch"
                      />
                      <div
                        v-if="v$.phone_number.$errors.length"
                        class="invalid-feedback animated fadeIn"
                      >
                        Please enter phone number
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-reconsultation-at"
                        >Reconsultation At</label
                      >
                      <FlatPicker
                        id="flat-picker-time-standalone"
                        class="form-control"
                        v-model="formData.reconsultation_at"
                        :config="flatPickerState.configTimeStandalone"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label
                        class="form-label"
                        for="form-reconsultation-last-at"
                        >Reconsultation Last At</label
                      >
                      <FlatPicker
                        id="flat-picker-time-standalone"
                        class="form-control"
                        v-model="formData.reconsultation_last_at"
                        :config="flatPickerState.configTimeStandalone"
                      />
                    </div>
                  </div>
                  <hr class="block my-4" />
                  <div class="fs-5 fw-semibold text-muted mb-3">Images</div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-logo-file"
                        >Logo</label
                      >
                      <input
                        class="form-control"
                        type="file"
                        id="form-logo-file"
                        @change="onUploadLogo"
                        :class="{
                          'is-invalid': isCheckSizeLogo,
                        }"
                      />
                      <div v-if="previewLogo" class="mt-2">
                        <img
                          :src="previewLogo"
                          width="100"
                          height="100"
                          class="object-fit-cover"
                        />
                      </div>
                      <div
                        v-if="isCheckSizeLogo"
                        class="invalid-feedback animated fadeIn"
                      >
                        {{ "Please upload image size < 10MB" }}
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-banner-file"
                        >Banner</label
                      >
                      <input
                        class="form-control"
                        type="file"
                        id="form-banner-file"
                        :class="{
                          'is-invalid': isCheckSizeBanner,
                        }"
                        @change="onUploadBanner"
                      />
                      <div v-if="previewBanner" class="mt-2">
                        <img
                          :src="previewBanner"
                          width="100"
                          height="100"
                          class="object-fit-cover"
                        />
                      </div>
                      <div
                        v-if="isCheckSizeBanner"
                        class="invalid-feedback animated fadeIn"
                      >
                        {{ "Please upload image size < 10MB" }}
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-slogan">Slogan</label>
                      <input
                        type="text"
                        class="form-control"
                        id="form-slogan"
                        placeholder="Enter..."
                        v-model="formData.slogan"
                      />
                    </div>
                  </div>
                </div>
                <div style="margin-top: 15px" class="col-sm-12 col-md-6">
                  <div class="mb-2">
                    <label class="form-label" for="form-slogan"
                      >Receipt text</label
                    >
                    <textarea
                      type="text-area"
                      class="form-control"
                      id="form-slogan"
                      placeholder="Enter..."
                      v-model="formData.custom_footer"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane"
                id="btabs-payment-setting"
                role="tabpanel"
                aria-labelledby="btabs-payment-setting-tab"
                tabindex="0"
              >
                <div class="row">
                  <div class="fs-5 fw-semibold text-muted mb-3">Vipps</div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-vipps_client_id"
                        >Client ID</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-vipps_client_id"
                        placeholder="Enter..."
                        v-model="formData.vipps.vipps_client_id"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-vipps_client_secret"
                        >Client Secret</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-vipps_client_secret"
                        placeholder="Enter..."
                        v-model="formData.vipps.vipps_client_secret"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label
                        class="form-label"
                        for="form-vipps_merchant_serial_number"
                        >Merchant serial number</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-vipps_merchant_serial_number"
                        placeholder="Enter..."
                        v-model="formData.vipps.vipps_merchant_serial_number"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label
                        class="form-label"
                        for="form-vipps_subscription_key"
                        >Subscription key</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-vipps_subscription_key"
                        placeholder="Enter..."
                        v-model="formData.vipps.vipps_subscription_key"
                      />
                    </div>
                  </div>
                  <hr class="block my-4" />
                  <div class="fs-5 fw-semibold text-muted mb-3">Stripe</div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-stripe_key"
                        >Key</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-stripe_key"
                        placeholder="Enter..."
                        v-model="formData.stripe.stripe_key"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-stripe_secret"
                        >Secret</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-stripe_secret"
                        placeholder="Enter..."
                        v-model="formData.stripe.stripe_secret"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="form-check form-switch">
                      <label
                        class="form-check-label"
                        for="val-is_stripe_apple_payment"
                        >Apple Pay</label
                      >
                      <input
                        v-model="formData.stripe_apple_payment"
                        class="form-check-input"
                        type="checkbox"
                        id="val-is_stripe_apple_payment"
                      />
                    </div>
                    <div class="form-check form-switch">
                      <label
                        class="form-check-label"
                        for="val-is_stripe_google_payment"
                        >Google Pay</label
                      >
                      <input
                        v-model="formData.stripe_google_payment"
                        class="form-check-input"
                        type="checkbox"
                        id="val-is_stripe_google_payment"
                      />
                    </div>
                  </div>
                  <hr class="block my-4" />
                  <div class="fs-5 fw-semibold text-muted mb-3">Bambora</div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-bambora_key"
                        >Api Key</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-bambora_key"
                        placeholder="Enter..."
                        v-model="formData.bambora.api_key"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-bambora_md5"
                        >MD5 Key</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-bambora_md5"
                        placeholder="Enter..."
                        v-model="formData.bambora.md5_key"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane"
                id="btabs-dinein-fee-setting"
                role="tabpanel"
                aria-labelledby="btabs-dinein-fee-setting-tab"
                tabindex="0"
              >
                <div class="row">
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-vipps_client_id"
                        >Name Tax</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="form-vipps_client_id"
                        placeholder="Enter..."
                        v-model="formData.dinein_name"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="mb-2">
                      <label class="form-label" for="form-vipps_client_secret"
                        >Price</label
                      >
                      <input
                        type="number"
                        class="form-control"
                        id="form-vipps_client_secret"
                        placeholder="Enter..."
                        v-model="formData.dinein_fee"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-12">
                    <div class="mb-2">
                      <div class="form-check form-switch">
                        Active
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :checked="formData.use_dinein"
                          v-model="formData.use_dinein"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane"
                id="btabs-modules"
                role="tabpanel"
                aria-labelledby="btabs-modules-tab"
                tabindex="0"
              >
                <div class="row">
                  <div class="col-sm-12 col-md-10">
                    <div class="mb-2">
                      <label class="form-label" for="form-plans">Plans</label>
                      <div class="row">
                        <div
                          v-for="(itm, idx) in listPlans.filter(
                            (plan) =>
                              !['Vipps', 'Stripe', 'Tip', 'Bambora'].includes(
                                plan.name
                              )
                          )"
                          :key="`node-${idx}`"
                          class="col-sm-12 col-md-4 mb-3"
                        >
                          <div class="form-check form-switch">
                            {{ itm?.name }}
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :checked="formData.plans?.includes(itm?.id)"
                              @change="
                                (e) =>
                                  handleChangeSwitch(
                                    itm?.id,
                                    e?.target?.checked
                                  )
                              "
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 mb-3">
                          <div class="form-check form-switch">
                            Dark Mode
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :checked="formData.dark_mode"
                              v-model="formData.dark_mode"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mb-2">
                      <label class="form-label" for="form-plans"
                        >Payment settings</label
                      >
                      <div class="row">
                        <div
                          v-for="(itm, idx) in listPlans.filter((plan) =>
                            ['Vipps', 'Stripe', 'Tip', 'Bambora'].includes(
                              plan.name
                            )
                          )"
                          :key="`node-${idx}`"
                          class="col-sm-12 col-md-4 mb-3"
                        >
                          <div class="form-check form-switch">
                            {{ itm?.name }}
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :checked="formData.plans?.includes(itm?.id)"
                              @change="
                                (e) =>
                                  handleChangeSwitch(
                                    itm?.id,
                                    e?.target?.checked
                                  )
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                class="my-4"
                :style="{
                  textAlign: 'end',
                  display: 'flex',
                  gap: '5px',
                  justifyContent: 'end',
                }"
              >
                <button
                  type="submit"
                  @click="handleSubmit('confirm')"
                  class="btn btn-primary"
                  :style="{ color: '#fff' }"
                >
                  Confirm
                </button>
                <button
                  v-if="!id"
                  type="submit"
                  @click="handleSubmit('confirm_add')"
                  class="btn btn-primary"
                  :style="{ color: '#fff' }"
                >
                  Confirm & New
                </button>
              </div>
            </div>
          </BaseBlock>
        </form>
      </div>
    </div>

    <div
      id="toast_alert"
      class="toast fade hide"
      data-delay="4000"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <i class="si si-bubble text-primary me-2"></i>
        <strong class="me-auto">Title</strong>
        <small class="text-muted">just now</small>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{ errorMessage }}
      </div>
    </div>
  </div>
  <form v-if="!!id" @submit.prevent="onSubmitPassword">
    <EModal
      id="modal-change-password"
      title="Change Password"
      ok-text="Change Password"
      ok-type="submit"
      :close-on-submit="false"
      :is-show-text-add="false"
      @confirm="() => onSubmitPassword()"
    >
      <template v-slot:childrenComponent>
        <ChangePassword :v$="vChangePassword$" :state="stateChangePassword" />
      </template>
    </EModal>
  </form>
</template>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";

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
