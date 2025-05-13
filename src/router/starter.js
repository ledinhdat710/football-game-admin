import { createRouter, createWebHistory } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import NProgress from 'nprogress/nprogress.js'
import LayoutAdmin from '@/layouts/variations/Admin.vue'
import LayoutSimple from '@/layouts/variations/Simple.vue'
import useAuth from '@/composables/useAuth'
const { resetUser, setUser } = useAuth()

const routes = [
  {
    path: '/',
    component: LayoutSimple,
    redirect: '/admin/admin-list-user'
  },
  {
    path: '/admin',
    redirect: '/admin/admin-list-user',
    component: LayoutAdmin,
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dasboard/DasboardList.vue'),
        meta: {
          module: 'dashboard'
        }
      },
      {
        path: 'admin-list-user',
        name: 'admin-list-user',
        component: () => import('@/views/admin/MultiTenant/MultiTenantList.vue'),
        meta: {
          module: 'admin-list-user'
        }
      },
      {
        path: 'admin-list-code',
        name: 'admin-list-code',
        component: () => import('@/views/admin/Code/CodeList.vue'),
        meta: {
          module: 'admin-list-code'
        }
      },
      {
        path: 'multi-tenant/form/:id?',
        name: 'admin-multi-tenant-form',
        component: () => import('@/views/admin/MultiTenant/MultiTenantForm.vue'),
        meta: {
          module: 'multi-tenant'
        }
      },
      {
        path: 'restaurants',
        name: 'admin-restaurants-list',
        component: () => import('@/views/admin/Restaurants/RestaurantsList.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/form/:id?',
        name: 'admin-restaurants-form',
        component: () => import('@/views/admin/Restaurants/RestaurantsForm.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/kiosk/:id?',
        name: 'admin-restaurants-kiosk',
        component: () => import('@/views/admin/Restaurants/RestaurantsKiosk.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/kitchen/:id?',
        name: 'admin-restaurants-kitchen',
        component: () => import('@/views/admin/Restaurants/RestaurantsKitchen.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/printer/:id?',
        name: 'admin-restaurants-printer',
        component: () => import('@/views/admin/Restaurants/RestaurantsPrinter.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/user/:id?',
        name: 'admin-restaurants-user',
        component: () => import('@/views/admin/Restaurants/RestaurantsUser.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/media/:id?',
        name: 'admin-restaurants-media',
        component: () => import('@/views/admin/Restaurants/RestaurantsMedia.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'restaurants/bank/:id?',
        name: 'admin-restaurants-bank',
        component: () => import('@/views/admin/Restaurants/RestaurantsBankTerminalList.vue'),
        meta: {
          module: 'restaurants'
        }
      },
      {
        path: 'announcement',
        name: 'admin-announcement-list',
        component: () => import('@/views/admin/Announcement/AnnouncementsList.vue'),
        meta: {
          module: 'announcement'
        }
      },
      {
        path: 'kiosk-slaves',
        name: 'admin-kiosk-slaves-list',
        component: () => import('@/views/admin/KioskSlaves/KioskSlavesList.vue'),
        meta: {
          module: 'kiosk-slaves'
        }
      },
      {
        path: 'kiosk-slaves/form/:id?',
        name: 'admin-kiosk-slaves-form',
        component: () => import('@/views/admin/KioskSlaves/KioskSlavesForm.vue'),
        meta: {
          module: 'kiosk-slaves'
        }
      },
      {
        path: 'printer-slaves',
        name: 'admin-printer-slaves-list',
        component: () => import('@/views/admin/PrinterSlaves/PrinterSlavesList.vue'),
        meta: {
          module: 'printer-slaves'
        }
      },
      {
        path: 'printer-slaves/form/:id?',
        name: 'admin-printer-slaves-form',
        component: () => import('@/views/admin/PrinterSlaves/PrinterSlavesForm.vue'),
        meta: {
          module: 'printer-slaves'
        }
      },
    ]
  },
  {
    path: '/auth/sign-in',
    name: 'admin-auth-signin',
    component: () => import('@/views/admin/Auth/AuthSignIn.vue')
  }
]

// Create Router
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
  routes
})

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false })

router.afterEach((to, from) => {
  NProgress.done()
})

const PageNoAuth = ['admin-auth-signin']

const { cookies } = useCookies()
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const toPage = to.name
  const cookieUserInfo = localStorage.getItem('user')
  const cookieToken = localStorage.getItem('token')
  if (!PageNoAuth.includes(toPage)) {
    if (!cookieUserInfo || !cookieToken) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      resetUser()
      return next('/auth/sign-in')
    } else {
      setUser(cookieUserInfo)
      return next()
    }
  } else {
    return next()
  }
})

/*eslint-enable no-unused-vars*/

export default router
