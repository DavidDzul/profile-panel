import axios from '@/axiosConfig'
import { defineStore } from 'pinia'
import { useAlertStore } from '@/stores/alert'

export const useTokenStore = defineStore('tokenStore', () => {
  const { showAlert } = useAlertStore()

  const createToken = async (form: CreateToken) => {
    try {
      const param = await axios.post('api/token', form, {
        headers: { accept: 'application/json' },
      })
      if (param) {
        return param.data
      }
    } catch (error) {
      console.error(error)
      showAlert({
        title: 'Error. Intente nuevamente o comunícate con el Área de Soporte para recibir ayuda.',
        status: 'error',
      })
      throw error
    }
  }

  const getAttendanceStatus = async () => {
    try {
      const res = await axios.get('api/validateAttendance', {
        headers: { accept: 'application/json' },
      })
      return res.data
    } catch (error) {
      console.error(error)
      showAlert({
        title: 'Error. Intente nuevamente o comunícate con el Área de Soporte para recibir ayuda.',
        status: 'error',
      })
      throw error
    }
  }

  const createCheckout = async () => {
    try {
      const res = await axios.post('api/attendance/check-out', {
        headers: { accept: 'application/json' },
      })
      return res.data
    } catch (error) {
      console.error(error)
      showAlert({
        title: 'Error. Intente nuevamente o comunícate con el Área de Soporte para recibir ayuda.',
        status: 'error',
      })
      throw error
    }
  }

  return {
    createToken,
    createCheckout,
    getAttendanceStatus,
  }
})
