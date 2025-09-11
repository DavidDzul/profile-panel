<template>
  <v-alert variant="tonal" density="compact" class="text-center">
    ⚠️ <strong>Aviso:</strong> Este espacio es personal. Solo tú puedes marcar tu asistencia;
    compartirlo está prohibido.
  </v-alert>
  <v-container fluid>
    <!-- Estado de asistencia -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" lg="6" class="text-center">
        <div v-if="attendanceStatus">
          <!-- Puede hacer Check-In -->
          <div v-if="attendanceStatus.can_checkin">
            <v-alert class="mb-4" style="background-color: #275ffc; color: white">
              <strong>{{ attendanceStatus.class.name }}</strong
              ><br />
              📅 {{ attendanceStatus.class.date }}<br />
              ⏳ {{ attendanceStatus.class.start_time }} hrs -
              {{ attendanceStatus.class.end_time }} hrs
            </v-alert>
            <v-btn color="tertiary" @click="generateToken" :loading="loading"> Generar QR </v-btn>
          </div>

          <!-- Puede hacer Check-Out -->
          <div v-else-if="attendanceStatus.can_checkout">
            <v-alert type="success" class="mb-4" :icon="false">
              Has marcado entrada a las <strong>{{ attendanceStatus.check_in }} hrs.</strong><br />
              Clase en curso: <strong>{{ attendanceStatus.class.name }}</strong>
            </v-alert>
            <v-btn color="warning" @click="generateToken" :loading="loading">
              Marcar salida (Check-Out)
            </v-btn>
          </div>

          <!-- Asistencia completada -->
          <div v-else-if="attendanceStatus.is_completed">
            <v-alert type="success" class="mb-4" :icon="false">
              <strong>Asistencia completada</strong><br />
              Entrada: {{ attendanceStatus.check_in }} hrs | Salida:
              {{ attendanceStatus.check_out }} hrs
            </v-alert>
          </div>
        </div>

        <!-- Sin asignación -->
        <div v-else>
          <v-alert type="error" class="mb-4" :icon="false">
            ❌ No tienes asignación de asistencia para hoy.
          </v-alert>
        </div>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTokenPageStore } from '@/stores/views/tokenPage'
import QrcodeVue from 'qrcode.vue'
import dayjs from 'dayjs'

const { loading, attendanceToken, expireToken, attendanceStatus } = storeToRefs(useTokenPageStore())
const { onCreateAttendanceToken, fetchAttendanceStatus } = useTokenPageStore()

// Generar token
const generateToken = async () => {
  await onCreateAttendanceToken()
  await fetchAttendanceStatus()
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

onMounted(async () => {
  await fetchAttendanceStatus()
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
</style>
