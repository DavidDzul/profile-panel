import axios from '@/axiosConfig'
import { defineStore } from 'pinia'
import { useAlertStore } from '@/stores/alert'

export const useNoticeStore = defineStore('noticeStore', () => {
  const { showAlert } = useAlertStore()

  const getNotices = async () => {
    try {
      const res = await axios.get(`/api/notices`, {
        headers: { accept: 'application/json' },
      })
      return res.data
    } catch (error) {
      console.error('Error al obtener el historial:', error)
      showAlert({
        title: 'Error. Intente nuevamente o comunícate con el Área de Soporte para recibir ayuda.',
        status: 'error',
      })
    }
  }

  return {
    getNotices,
  }
})
