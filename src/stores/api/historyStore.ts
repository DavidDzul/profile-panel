import axios from '@/axiosConfig'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('HistoryStore', () => {
  const getHistory = async (id: number) => {
    try {
      const res = await axios.get(`api/attendance/${id}/history`, {
        headers: { accept: 'application/json' },
      })
      return res.data
    } catch (error) {
      console.error('Error al obtener el historico:', error)
    }
  }

  return {
    getHistory,
  }
})
