import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const MyRouter = [
  {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
    path: '/',
    component: () => import('./layouts/main/Main.vue'),
    meta: {
      rule: 'admin',
      authRequired: true
    },
    children: [
      // =============================================================================
      // Theme Routes
      {
        path: '/dashboard/analytics',
        name: 'dashboard-analytics',
        component: () => import('./views/DashboardAnalytics.vue'),
        meta: {
          rule: 'admin',
          authRequired: true
        }
      },
      {
        path: '/dashboard/ecommerce',
        name: 'dashboard-ecommerce',
        component: () => import('./views/DashboardECommerce.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('./views/Users/User.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('./views/Role/Role.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/role/:id/functionality',
        name: 'rolesFunctionality',
        component: () => import('./views/RoleFunctionality/RoleFunctionality.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/functionality',
        name: 'functionality',
        component: () => import('./views/Functionality/Functionality.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/admins',
        name: 'admins',
        component: () => import('./views/Admins/Admins.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/comments',
        name: 'comments',
        component: () => import('./views/Comments/Comments.vue'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      },
      {
        path: '/courses',
        name: 'courses',
        component: () => import('./views/Courses/Courses'),
        meta: {
          rule: 'admin',
          authRequired: true

        }
      }
    ]
  },
  // =============================================================================
  // FULL PAGE LAYOUTS
  // =============================================================================
  {
    path: '/',
    component: () => import('@/layouts/full-page/FullPage.vue'),
    children: [
      // =============================================================================
      // PAGES
      // =============================================================================
      {
        path: '/callback',
        name: 'auth-callback',
        component: () => import('@/views/Callback.vue'),
        meta: {
          rule: 'admin',
          authRequired: false
        }
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/login/Login'),
        meta: {
          authRequired: false,
          rule: 'admin'
        }
      },

      {
        path: '/pages/forgot-password',
        name: 'page-forgot-password',
        component: () => import('@/views/pages/ForgotPassword.vue'),
        meta: {
          rule: 'editor',
          authRequired: false
        }
      },
      {
        path: '/pages/reset-password',
        name: 'page-reset-password',
        component: () => import('@/views/pages/ResetPassword.vue'),
        meta: {
          rule: 'editor',
          authRequired: false
        }
      },
      {
        path: '/pages/lock-screen',
        name: 'page-lock-screen',
        component: () => import('@/views/pages/LockScreen.vue'),
        meta: {
          rule: 'editor',
          authRequired: true
        }
      },
      {
        path: '/pages/comingsoon',
        name: 'page-coming-soon',
        component: () => import('@/views/pages/ComingSoon.vue'),
        meta: {
          rule: 'editor',
          authRequired: true
        }
      },
      {
        path: '/pages/error-404',
        name: 'page-error-404',
        component: () => import('@/views/pages/Error404.vue'),
        meta: {
          rule: 'editor',
          authRequired: false
        }
      },
      {
        path: '/pages/error-500',
        name: 'page-error-500',
        component: () => import('@/views/pages/Error500.vue'),
        meta: {
          rule: 'editor',
          authRequired: false
        }
      },
      {
        path: '/pages/not-authorized',
        name: 'page-not-authorized',
        component: () => import('@/views/pages/NotAuthorized.vue'),
        meta: {
          rule: 'editor',
          authRequired: false
        }
      },
      {
        path: '/pages/maintenance',
        name: 'page-maintenance',
        component: () => import('@/views/pages/Maintenance.vue'),
        meta: {
          rule: 'editor',
          authRequired: false
        }
      }
    ]
  },

  // Redirect to 404 page, if no match found
  {
    path: '*',
    redirect: '/pages/error-404'
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return {
      x: 0,
      y: 0
    }
  },
  routes: MyRouter
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
router.beforeResolve((to, from, next) => {
  next()
})
router.beforeEach((to, from, next) => {
  return next()
})

export default router
