<script setup>
import { useTemplateStore } from "@/stores/template";
import BaseLayout from "@/layouts/BaseLayout.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import EIcon from "@/components/Elements/EIcon.vue";
import { useRouter } from "vue-router";
import useAuth from "@/composables/useAuth";
import { useCookies } from "vue3-cookies";

// Main store
const store = useTemplateStore();

// Set default elements for this layout
store.setLayout({
  header: true,
  sidebar: true,
  sideOverlay: true,
  footer: false,
});

// Set various template options for this layout variation
store.headerStyle({ mode: "light" });
store.mainContent({ mode: "narrow" });
const { userInfo, resetUser } = useAuth();
const user = JSON.parse(localStorage.getItem("user"));
// console.log(user);
const router = useRouter();
const { cookies } = useCookies();
const onSignOut = () => {
  resetUser();
  cookies.remove("token");
  cookies.remove("user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push({ name: "admin-auth-signin" });
};
</script>

<template>
  <BaseLayout>
    <!-- Side Overlay Content -->
    <!-- Using the available v-slot, we can override the default Side Overlay content from layouts/partials/SideOvelay.vue -->
    <template #side-overlay-content>
      <div class="content-side">
        <p>Side Overlay content..</p>
      </div>
    </template>
    <!-- END Side Overlay Content -->

    <!-- Sidebar Content -->
    <!-- Using the available v-slot, we can override the default Sidebar content from layouts/partials/Sidebar.vue -->
    <template #sidebar-content>
      <div class="">
        <div>
          <a
            class="d-flex py-4 px-4 flex-row-reverse"
            href="javascript:void(0)"
          >
            <div
              class="flex-shrink-0 me-3 ms-2 overlay-container overlay-bottom"
            >
              <img
                class="img-avatar img-avatar40"
                src="/assets/media/avatars/avatar3.jpg"
                alt="Avatar"
              />
            </div>
            <div class="flex-grow-1">
              <div class="fw-normal fs-sm text-white">{{ userInfo?.name }}</div>
              <div class="fw-normal fs-sm text-muted">Online</div>
            </div>
          </a>
        </div>
        <div class="px-4" v-if="user.role_id === 1">
          <BaseNavigation
            :nodes="[
              {
                name: 'List User',
                to: 'admin-list-user',
                icon: 'fa fa-user',
                module: 'multi-tenant',
              },
              {
                name: 'List Code',
                to: 'admin-list-code',
                icon: 'fa fa-fw fa-store',
                module: 'list-code',
              },
            ]"
          />
        </div>
        <div class="px-4" v-else>
          <BaseNavigation
            :nodes="[
              {
                name: 'List User',
                to: 'admin-list-user',
                icon: 'fa fa-user',
                module: 'multi-tenant',
              },
            ]"
          />
        </div>
      </div>
    </template>
    <!-- END Sidebar Content -->

    <!-- Header Content Left -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content-left>
      <!-- Toggle Sidebar -->
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary me-2 d-lg-none"
        @click="store.sidebar({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-bars"></i>
      </button>
      <!-- END Toggle Sidebar -->

      <!-- Toggle Mini Sidebar -->
      <!--      <button-->
      <!--        type="button"-->
      <!--        class="btn btn-sm btn-alt-secondary me-2 d-none d-lg-inline-block"-->
      <!--        @click="store.sidebarMini({ mode: 'toggle' })"-->
      <!--      >-->
      <!--        <i class="fa fa-fw fa-bars"></i>-->
      <!--      </button>-->
      <!-- END Toggle Mini Sidebar -->
    </template>
    <!-- END Header Content Left -->

    <!-- Header Content Right -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content-right>
      <!-- Toggle Side Overlay -->
      <!--      <form class="d-none d-md-inline-block me-4">-->
      <!--        <div class="input-group input-group-sm">-->
      <!--          <input-->
      <!--            type="text"-->
      <!--            class="form-control form-control-alt"-->
      <!--            placeholder="Search.."-->
      <!--            id="page-header-search-input2"-->
      <!--            name="page-header-search-input2"-->
      <!--          />-->
      <!--          <span class="input-group-text border-0">-->
      <!--            <i class="fa fa-fw fa-search"></i>-->
      <!--          </span>-->
      <!--        </div>-->
      <!--      </form>-->

      <!--      <EIcon name="bell" class="text-muted me-4" role="button" />-->
      <!--      <EIcon name="flag" class="text-muted me-4" role="button" />-->
      <EIcon
        name="right-from-bracket"
        class="text-muted"
        role="button"
        @click="onSignOut"
      />
      <!--      <button-->
      <!--        type="button"-->
      <!--        class="btn btn-sm btn-alt-secondary"-->
      <!--        @click="store.sideOverlay({ mode: 'toggle' })"-->
      <!--      >-->
      <!--        <i class="fa fa-fw fa-list-ul fa-flip-horizontal"></i>-->
      <!--      </button>-->
      <!-- END Toggle Side Overlay -->
    </template>
    <!-- END Header Content Right -->

    <!-- Footer Content Left -->
    <!-- Using the available v-slot, we can override the default Footer content from layouts/partials/Footer.vue -->
    <template #footer-content-left>
      <strong>My App</strong>
      &copy; {{ store.app.copyright }}
    </template>
    <!-- END Footer Content Left -->
  </BaseLayout>
</template>
