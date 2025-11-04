import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/api/authStore'

const routes = [
  {
    path: '/auth',
    name: 'AuthLayout',
    component: () => import('@/layouts/AuthLayout.vue'),
    redirect: 'auth/login',
    beforeEnter: async () => {
      const { getProfile } = useAuthStore()
      const { loggedUser } = storeToRefs(useAuthStore())
      const token = localStorage.getItem('token')

      if (!token) {
        return true
      } else if (loggedUser.value) {
        return { path: '/' }
      } else {
        await getProfile(token)
      }
      return true
    },
    children: [
      { path: 'login', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
    ],
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/layouts/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'Inicio',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: '/asistencia',
        name: 'TokenView',
        component: () => import('@/views/attendance/TokenView.vue'),
      },
      {
        path: '/historial',
        name: 'HistoryView',
        component: () => import('@/views/attendance/HistoryView.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const { getProfile } = authStore
  const { loggedUser } = storeToRefs(authStore)
  const token = localStorage.getItem('token')

  // Si voy a /auth/login pero ya tengo token intento cargar perfil
  if (to.path === '/auth/login' && token && !loggedUser.value) {
    await getProfile(token)
    if (loggedUser.value) {
      return { path: '/' }
    }
  }

  if (to.meta.requiresAuth) {
    if (token && loggedUser.value) {
      return true
    } else if (token && !loggedUser.value) {
      await getProfile(token)
      if (loggedUser.value) {
        return true
      } else {
        return { path: '/auth/login', query: { redirect: to.fullPath } }
      }
    } else {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }
  } else if (to.meta.guest && token && loggedUser.value) {
    return { path: '/' }
  }

  return true
})

export default router
