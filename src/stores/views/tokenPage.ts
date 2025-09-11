import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useTokenStore } from '@/stores/api/tokenStore'
import { useAuthStore } from '@/stores/api/authStore'

export const useTokenPageStore = defineStore('tokenPage', () => {
  const { createToken } = useTokenStore()
  const { userProfile } = storeToRefs(useAuthStore())

  const loading = ref(false)
  const attendanceToken = ref('')
  const expireToken = ref('')

  const onCreateAttendanceToken = async () => {
    loading.value = true
    if (!userProfile.value) return
    try {
      const form: CreateToken = { user_id: userProfile.value.id }
      const res = await createToken(form)
      if (res) {
        attendanceToken.value = res.token
        expireToken.value = res.expires_at
      }
    } catch (e) {
      console.error('Error:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    expireToken,
    attendanceToken,
    onCreateAttendanceToken,
  }
})
