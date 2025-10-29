import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useTokenStore } from '@/stores/api/tokenStore'
import { useAuthStore } from '@/stores/api/authStore'

export const useTokenPageStore = defineStore('tokenPage', () => {
  const { createToken, getAttendanceStatus, createCheckout } = useTokenStore()
  const { userProfile } = storeToRefs(useAuthStore())

  const loading = ref(false)
  const attendanceToken = ref('')
  const expireToken = ref('')
  const attendanceStatus = ref<AttendanceStatus | null>(null)

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

  const fetchAttendanceStatus = async () => {
    try {
      const res = await getAttendanceStatus()
      if (res.status === 'NOT_ASSIGNED') {
        attendanceStatus.value = null
      } else {
        attendanceStatus.value = res
      }
    } catch (e) {
      console.error('Error fetching status:', e)
    }
  }

  const onCreateCheckout = async () => {
    loading.value = true
    try {
      const res = await createCheckout()
      attendanceStatus.value = res
    } catch (e) {
      console.error('Error fetching status:', e)
    }
    loading.value = false
  }

  return {
    loading,
    expireToken,
    attendanceToken,
    attendanceStatus,
    fetchAttendanceStatus,
    onCreateCheckout,
    onCreateAttendanceToken,
  }
})
