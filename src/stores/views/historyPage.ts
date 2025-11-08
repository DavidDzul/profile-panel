import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useHistoryStore } from '@/stores/api/historyStore'
import { useAuthStore } from '@/stores/api/authStore'

export const useHistoryPageStore = defineStore('historyPage', () => {
  const { getHistory } = useHistoryStore()
  const { userProfile } = storeToRefs(useAuthStore())

  const loading = ref(false)
  const userHistory = ref<Attendance[] | null>([])

  const fetchHistory = async (param: number) => {
    try {
      loading.value = true
      if (!userProfile.value) return
      const form = { year: param }
      const res = await getHistory(userProfile.value.id, form)
      if (res) {
        userHistory.value = res.data
        loading.value = false
      }
    } catch (e) {
      loading.value = false
      console.error('Error fetching history:', e)
    }
  }

  return {
    loading,
    userHistory,
    fetchHistory,
  }
})
