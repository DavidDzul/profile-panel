import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AlertConfigInterface } from '@/interfaces'

export const useAlertStore = defineStore('alertStore', () => {
  const show = ref(false)
  const config = ref<AlertConfigInterface>({ title: '', body: '', status: 'success' })

  const showAlert = (conf: AlertConfigInterface) => {
    if (!show.value) {
      show.value = false
    }
    config.value = { ...conf }
    show.value = true
  }

  const $reset = () => {
    show.value = false
    config.value = { title: '', body: '', status: 'success' }
  }

  return {
    show,
    config,
    showAlert,
    $reset,
  }
})
