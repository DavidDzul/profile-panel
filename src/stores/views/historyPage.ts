import { onMounted, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useHistoryStore } from '@/stores/api/historyStore'
import { useAuthStore } from '@/stores/api/authStore'

export const useHistoryPageStore = defineStore('historyPage', () => {
  const { getHistory } = useHistoryStore()
  const { userProfile } = storeToRefs(useAuthStore())

  const loading = ref(false)
  const userHistory = ref<Attendance[] | null>([])

  const fetchHistory = async () => {
    try {
      if (!userProfile.value) return
      const res = await getHistory(userProfile.value.id)
      if (res) {
        userHistory.value = res.data
      }
    } catch (e) {
      console.error('Error fetching history:', e)
    }
  }

  onMounted(() => {
    fetchHistory()
  })

  return {
    loading,
    userHistory,
  }
})
