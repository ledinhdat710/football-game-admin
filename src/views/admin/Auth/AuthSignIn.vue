<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { authService } from "@/services/auth.service";
import { useCookies } from "vue3-cookies";
import useNotify from "@/composables/useNotify";

// Main store and Router
const store = useTemplateStore();
const router = useRouter();
const { cookies } = useCookies();
const { setNotify } = useNotify();
// Input state variables
const state = reactive({
  email: null,
  password: null,
});

// Validation rules
const rules = computed(() => {
  return {
    email: {
      required,
      minLength: minLength(3),
    },
    password: {
      required,
      minLength: minLength(5),
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    // notify user form is invalid
    return;
  }

  try {
    store.pageLoader({ mode: "on" });
    const response = await authService.login({
      email: state.email,
      password: state.password,
    });
    if (response?.user && response?.token) {
      const _tmpUser = {
        ...response?.user,
      };
      cookies.set("user", _tmpUser);
      cookies.set("token", response?.token);
      await router.push({ name: "admin-list-user" });
    }
  } catch (e) {
    console.log(e);
    setNotify({
      title: "Error",
      message: e?.message,
    });
  } finally {
    store.pageLoader({ mode: "off" });
  }
}
</script>

<template>
  <!-- Page Content -->
  <BaseBackground image="/assets/media/photos/photo28@2x.jpg">
    <div id="page-loader" :class="{ show: store.settings.pageLoader }">
      <img
        src="@/assets/images/icon_loading.svg"
        width="60"
        height="60"
        alt=""
      />
    </div>
    <div class="row g-0 bg-primary-dark-op">
      <!-- Meta Info Section -->
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <!-- <div class="w-100">
            <RouterLink
              :to="{ name: 'admin-restaurants-list' }"
              class="link-fx fw-semibold fs-2 text-white"
            >
              <img
                class="img-fluid"
                src="@/assets/images/dark.png"
                width="130"
                height="100"
                alt=""
              />
            </RouterLink>
          </div> -->
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <!-- <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p> -->
          <!--          <ul class="list list-inline mb-0 py-2">-->
          <!--            <li class="list-inline-item">-->
          <!--              <a class="text-white-75 fw-medium" href="javascript:void(0)"-->
          <!--                >Legal</a-->
          <!--              >-->
          <!--            </li>-->
          <!--            <li class="list-inline-item">-->
          <!--              <a class="text-white-75 fw-medium" href="javascript:void(0)"-->
          <!--                >Contact</a-->
          <!--              >-->
          <!--            </li>-->
          <!--            <li class="list-inline-item">-->
          <!--              <a class="text-white-75 fw-medium" href="javascript:void(0)"-->
          <!--                >Terms</a-->
          <!--              >-->
          <!--            </li>-->
          <!--          </ul>-->
        </div>
      </div>
      <!-- END Meta Info Section -->

      <!-- Main Section -->
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
          <RouterLink
            :to="{ name: 'admin-restaurants-list' }"
            class="link-fx fw-semibold fs-3 text-dark"
          >
            <img
              class="img-fluid"
              src="@/assets/images/light.png"
              width="130"
              height="100"
              alt=""
            />
            <!-- Nord<span class="fw-normal">Pay</span> -->
          </RouterLink>
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <!-- <p class="mb-3">
                <img
                  class="img-fluid"
                  src="@/assets/images/icon_signin.svg"
                  width="32"
                  height="33"
                  alt=""
                />
              </p> -->
              <h1 class="fw-bold mb-2">Sign In</h1>
            </div>
            <!-- END Header -->

            <!-- Sign In Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="login-username"
                      name="login-username"
                      placeholder="Email"
                      :class="{
                        'is-invalid': v$.email.$errors.length,
                      }"
                      v-model="state.email"
                      @blur="v$.email.$touch"
                    />
                    <div
                      v-if="v$.email.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter your email
                    </div>
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="login-password"
                      name="login-password"
                      placeholder="Password"
                      :class="{
                        'is-invalid': v$.password.$errors.length,
                      }"
                      v-model="state.password"
                      @blur="v$.password.$touch"
                    />
                    <div
                      v-if="v$.password.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter your password
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <div>
                      <!-- <a
                        href="mailto:Support@nordpay.no"
                        class="text-muted fs-sm fw-medium d-block d-lg-inline-block mb-1"
                      >
                        Forgot Password?
                      </a> -->
                    </div>
                    <div>
                      <button type="submit" class="btn btn-lg btn-alt-primary">
                        <i class="fa fa-fw fa-sign-in-alt me-1 opacity-50"></i>
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Sign In Form -->
          </div>
        </div>
        <!-- <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div> -->
      </div>
      <!-- END Main Section -->
    </div>
  </BaseBackground>
  <!-- END Page Content -->
</template>
