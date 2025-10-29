import axios from '@/axiosConfig'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertStore } from '@/stores/alert'

export const useAuthStore = defineStore('authStore', () => {
  const router = useRouter()
  const { showAlert } = useAlertStore()

  const token = ref('')
  const loggedUser = ref(false)
  const userProfile = ref<User | null>(null)

  const login = async (form: { enrollment: string; password: string }) => {
    try {
      await axios.get('sanctum/csrf-cookie')

      const res = await axios.post(
        'api/enrollmentLogin',
        form, // { enrollment, password }
        {
          headers: { accept: 'application/json' },
          withCredentials: true, // 👈 importante para Sanctum
        },
      )

      token.value = res.data.token
      localStorage.setItem('token', token.value)

      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      await router.push({ path: '/' })
    } catch (error) {
      console.error('Error en login:', error)
      showAlert({
        title: 'Error al iniciar sesión, verifica tu usuario y/o contraseña.',
        status: 'error',
      })
    }
  }

  const logout = async () => {
    await axios
      .post('api/logout')
      .then(async () => {
        loggedUser.value = false
        userProfile.value = null
        token.value = ''
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getProfile = async (authToken: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    await axios.get('sanctum/csrf-cookie')
    await axios
      .get('api/user')
      .then(async (res) => {
        loggedUser.value = true
        userProfile.value = res.data
        token.value = authToken
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error)
      })
  }

  const userInitials = computed(
    () =>
      `${userProfile?.value?.first_name.charAt(0) || ''}${userProfile?.value?.last_name.charAt(0) || ''}`,
  )
  const fullName = computed(
    () => `${userProfile?.value?.first_name || ''} ${userProfile?.value?.last_name || ''}`,
  )

  return {
    login,
    logout,
    getProfile,
    userInitials,
    fullName,
    token,
    loggedUser,
    userProfile,
  }
})
