import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useNoticeStore } from '@/stores/api/noticeStore'

export const useNoticePageStore = defineStore('noticePage', () => {
  const { getNotices } = useNoticeStore()

  const noticesMap = ref<Notice[] | null>([])

  const fetchNotices = async () => {
    try {
      const res = await getNotices()
      if (res) {
        noticesMap.value = res.data
      }
    } catch (e) {
      console.error('Error fetching notinces:', e)
    }
  }

  return {
    noticesMap,
    fetchNotices,
  }
})
