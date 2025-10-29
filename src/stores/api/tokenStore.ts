import axios from '@/axiosConfig'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('tokenStore', () => {
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
      throw error
    }
  }

  return {
    createToken,
    createCheckout,
    getAttendanceStatus,
  }
})
