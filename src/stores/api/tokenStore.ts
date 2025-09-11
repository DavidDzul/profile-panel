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

  return {
    createToken,
  }
})
