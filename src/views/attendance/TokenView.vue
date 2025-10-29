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
              <p class="pb-5" style="font-weight: 600">📚 Sesión asignada para hoy</p>
              <strong>Sesión:</strong> {{ attendanceStatus.class.name }} <br />
              <strong>Fecha:</strong> {{ attendanceStatus.class.date }}<br />

              <strong>Horario:</strong> {{ attendanceStatus.class.start_time }} hrs -
              {{ attendanceStatus.class.end_time }} hrs
            </v-alert>
            <v-btn color="tertiary" @click="generateToken" :loading="loading"> Generar QR </v-btn>
          </div>

          <!-- Puede hacer Check-Out -->
          <div v-else-if="attendanceStatus.can_checkout">
            <v-alert type="warning" class="mb-4" :icon="false">
              <h3 class="text-h6 mb-2">Asistencia registrada</h3>
              <p class="mb-1"><strong>Entrada:</strong> {{ attendanceStatus.check_in }} hrs.</p>
              <p class="mb-1"><strong>Sesión:</strong> {{ attendanceStatus.class.name }}</p>
              <p class="mb-0">
                <strong>Estado:</strong>
                {{ statusMap.get(attendanceStatus.status)?.text }}
              </p>
            </v-alert>

            <v-btn color="error" @click="onCreateCheckout" :loading="loading">
              Marcar salida (Check-Out)
            </v-btn>
          </div>

          <!-- Asistencia completada -->
          <div v-else-if="attendanceStatus.is_completed">
            <v-alert type="success" class="mb-4" :icon="false">
              <h3 class="text-h6 mb-2">Asistencia completada</h3>
              <p class="mb-1"><strong>Entrada:</strong> {{ attendanceStatus.check_in }} hrs</p>
              <p class="mb-1"><strong>Salida:</strong> {{ attendanceStatus.check_out }} hrs</p>
              <p class="mb-0 mt-5">
                <strong>¡Buen trabajo!</strong> <br />
                Tu registro de asistencia está completo.
              </p>
            </v-alert>
          </div>
        </div>

        <!-- Sin asignación -->
        <div v-else>
          <v-alert type="error" class="mb-4" :icon="false">
            <p>No tienes ninguna sesión asignada para hoy.</p>
            <br />
            <strong>Nota:</strong> Si hay algún inconveniente, comunícate con el personal encargado.
          </v-alert>
        </div>
      </v-col>
    </v-row>

    <!-- QR generado -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" lg="4" class="d-flex flex-column justify-center align-center">
        <div v-if="attendanceToken" class="text-center">
          <div v-if="timeLeft > 0" @click="showQrDialog = true" style="cursor: pointer">
            <p class="mb-2 text-body-2 text-gray text-center">
              Válido por: {{ minutes }}m {{ seconds }}s
            </p>
            <qrcode-vue :value="attendanceToken" :size="250" />
            <p class="mt-3 text-subtitle-1">Haz clic en el QR para verlo en mayor tamaño.</p>
            <strong>Nota: </strong>
            <span class="mt-3 text-subtitle-1">
              Si ya marcaste tu entrada, actualiza la página para verificar tu asistencia.
            </span>
          </div>
          <p v-else class="mt-2 text-body-2 text-error text-center">❌ Código QR expirado</p>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showQrDialog" fullscreen transition="dialog-bottom-transition" persistent>
    <v-card class="d-flex flex-column" style="height: 100%">
      <!-- Toolbar fijo arriba -->
      <v-toolbar dark color="secondary">
        <v-toolbar-title>Tu código QR</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="showQrDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenido centrado -->
      <div class="flex-grow-1 d-flex flex-column justify-center align-center">
        <template v-if="timeLeft > 0">
          <p class="mb-2 text-body-2 text-gray text-center">
            Válido por: {{ minutes }}m {{ seconds }}s
          </p>
          <qrcode-vue class="pa-5" :value="attendanceToken" :size="380" />
        </template>

        <p v-else class="mt-2 text-body-2 text-error text-center">❌ Este QR ha expirado</p>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTokenPageStore } from '@/stores/views/tokenPage'
import QrcodeVue from 'qrcode.vue'
import dayjs from 'dayjs'
import { statusMap } from '../../../constants'
const { loading, attendanceToken, expireToken, attendanceStatus } = storeToRefs(useTokenPageStore())
const { onCreateAttendanceToken, fetchAttendanceStatus, onCreateCheckout } = useTokenPageStore()

const showQrDialog = ref(false)

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
