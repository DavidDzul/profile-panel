<template>
  <v-container fluid>
    <!-- Alerta arriba -->
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-alert variant="tonal" density="compact" class="alert-custom text-center">
          ⚠️ <strong>Atención:</strong> Este QR es <strong>personal</strong>. No lo compartas; su
          uso por otra persona será registrado.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Botón centrado -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" lg="4" class="d-flex justify-center">
        <v-btn color="primary" @click="generateToken" :loading="loading"> Generar QR </v-btn>
      </v-col>
    </v-row>

    <!-- QR generado -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" lg="4" class="d-flex flex-column justify-center align-center">
        <div v-if="attendanceToken" class="text-center">
          <qrcode-vue :value="attendanceToken" :size="200" />
          <p class="mt-3 text-subtitle-1">Escanea este QR para marcar tu asistencia</p>
          <p v-if="timeLeft > 0" class="mt-2 text-body-2 text-gray text-center">
            ⏳ Válido por: {{ minutes }}m {{ seconds }}s
          </p>
          <p v-else class="mt-2 text-body-2 text-error text-center">❌ Este QR ha expirado</p>
        </div>

        <div v-else class="mt-3 text-body-2 text-gray">No hay QR generado aún.</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTokenPageStore } from '@/stores/views/tokenPage'
import QrcodeVue from 'qrcode.vue'
import dayjs from 'dayjs'

const { loading, attendanceToken, expireToken } = storeToRefs(useTokenPageStore())
const { onCreateAttendanceToken } = useTokenPageStore()

const generateToken = async () => {
  await onCreateAttendanceToken()
}

// Contador regresivo
const timeLeft = ref(0)
let timer: number | null = null

const updateTime = () => {
  if (expireToken.value) {
    const diff = dayjs(expireToken.value).diff(dayjs(), 'second')
    timeLeft.value = diff > 0 ? diff : 0
  }
}

watch(expireToken, () => {
  clearInterval(timer!)
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer!)
})

const minutes = computed(() => Math.floor(timeLeft.value / 60))
const seconds = computed(() => timeLeft.value % 60)
</script>

<style scoped>
.text-gray {
  color: #6b6b6b;
}

.alert-custom {
  font-size: 0.9rem;
  padding: 10px 16px;
  margin-top: 24px;
}
</style>
