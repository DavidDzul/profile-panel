import axios from '@/axiosConfig'
import { defineStore } from 'pinia'
import { useAlertStore } from '@/stores/alert'

export const useHistoryStore = defineStore('HistoryStore', () => {
  const { showAlert } = useAlertStore()

  const getHistory = async (id: number, form: { year: number }) => {
    try {
      const res = await axios.get(`/api/attendance/${id}/history`, {
        headers: { accept: 'application/json' },
        params: form,
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
    getHistory,
  }
})
