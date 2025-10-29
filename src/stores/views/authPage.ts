import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/api/authStore'
import { ref } from 'vue'

export const useAuthPageStore = defineStore('authPage', () => {
  const { login } = useAuthStore()
  const loading = ref(false)

  const onLogin = async (form: LoginInterface) => {
    loading.value = true
    try {
      if (form) {
        await login(form)
      }
    } catch (e) {
      console.error('Error en onLogin:', e)
      alert(e)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    onLogin,
  }
})
