<template>
  <v-alert variant="tonal" density="compact" class="text-center">
    ⚠️
    <small
      ><strong>Aviso:</strong> Este espacio es personal. Solo tú puedes marcar tu asistencia;
      compartirlo está prohibido.</small
    >
  </v-alert>
  <v-container fluid>
    <!-- Estado de asistencia -->
    <template v-if="loadingStatus">
      <v-col cols="12" v-for="i in 3" :key="i">
        <v-skeleton-loader type="list-item-two-line" class="rounded-lg" />
      </v-col>
    </template>
    <template v-else>
      <v-row justify="center" class="mt-6">
        <v-col cols="12" lg="6" class="text-center">
          <div v-if="attendanceStatus">
            <!-- Puede hacer Check-In -->
            <div v-if="attendanceStatus.can_checkin && !attendanceStatus.class_ended">
              <v-card class="mb-6 rounded-lg overflow-hidden shadow-lg border-0" variant="flat">
                <v-sheet color="#275ffc" class="pa-4 align-center">
                  <v-icon icon="mdi-calendar-check" color="white" class="mr-3" size="28"></v-icon>
                  <span
                    class="text-white font-weight-bold text-uppercase tracking-wider"
                    style="font-size: 0.85rem"
                  >
                    Sesión Programada para Hoy
                  </span>
                </v-sheet>

                <v-card-text class="pa-6 bg-white">
                  <v-row align="center" no-gutters>
                    <v-col cols="12" class="mb-4">
                      <div class="text-overline text-grey-darken-1">Nombre de la sesión</div>
                      <h2
                        class="font-weight-black text-primary mb-2"
                        style="letter-spacing: -0.5px"
                      >
                        {{ attendanceStatus.class.name }}
                      </h2>
                    </v-col>

                    <v-col cols="12">
                      <div class="text-overline text-grey-darken-1">Horario</div>

                      <strong>
                        {{ attendanceStatus.class.start_time }} hrs a
                        {{ attendanceStatus.class.end_time }} hrs
                      </strong>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-btn color="tertiary" @click="generateToken" :loading="loading"> Generar QR </v-btn>
            </div>

            <!-- Puede hacer Check-Out -->
            <div v-else-if="attendanceStatus.can_checkout">
              <v-card
                :color="statusMap.get(attendanceStatus.status)?.color"
                class="mb-4 rounded-lg elevation-10"
                flat
              >
                <v-card-title class="d-flex justify-center align-center text-white pa-4">
                  <v-icon
                    :icon="
                      statusMap.get(attendanceStatus.status)?.icon || 'mdi-clock-check-outline'
                    "
                    size="x-large"
                    class="mr-3"
                  ></v-icon>
                  <div class="text-h6 font-weight-bold text-uppercase">
                    {{ statusMap.get(attendanceStatus.status)?.text }}
                  </div>
                </v-card-title>

                <v-card-text class="bg-surface pa-6 text-center">
                  <div class="text-overline text-grey-darken-1">Nombre de la sesión</div>
                  <h3 class="font-weight-black text-black line-clamp-1 mb-3">
                    {{ attendanceStatus.class.name }}
                  </h3>

                  <div class="text-overline text-grey-darken-1">Horario</div>

                  <strong
                    >{{ attendanceStatus.class.start_time }} hrs a
                    {{ attendanceStatus.class.end_time }} hrs</strong
                  >

                  <v-divider class="my-4"></v-divider>

                  <v-row no-gutters>
                    <v-col
                      cols="6"
                      class="text-subtitle-1 font-weight-medium text-left text-grey-darken-1"
                    >
                      <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
                      Entrada:
                    </v-col>
                    <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">
                      {{ attendanceStatus.check_in }} hrs
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-btn
                color="error"
                class="mt-2"
                variant="elevated"
                :loading="loading"
                prepend-icon="mdi-exit-run"
                @click="validateCheckOut"
              >
                Marcar salida
              </v-btn>
            </div>

            <!-- Asistencia completada -->
            <div
              v-else-if="
                attendanceStatus.is_completed ||
                (attendanceStatus.class_ended &&
                  !attendanceStatus.can_checkin &&
                  !attendanceStatus.can_checkout)
              "
            >
              <v-card
                :color="statusMap.get(attendanceStatus.status)?.color"
                class="mb-4 rounded-lg elevation-10"
                flat
              >
                <v-card-title class="d-flex justify-center align-center text-white pa-4">
                  <v-icon
                    :icon="
                      statusMap.get(attendanceStatus.status)?.icon || 'mdi-clock-check-outline'
                    "
                    size="x-large"
                    class="mr-3"
                  ></v-icon>
                  <h5 class="text-wrap font-weight-bold text-uppercase">
                    {{ statusMap.get(attendanceStatus.status)?.title }}
                  </h5>
                </v-card-title>

                <v-card-text class="bg-surface pa-6 text-center">
                  <v-row>
                    <v-col class="mb-5" cols="12">
                      <div class="text-overline text-grey-darken-1">Nombre de la sesión</div>
                      <h3 class="font-weight-black text-black line-clamp-1 mb-3">
                        {{ attendanceStatus.class.name }}
                      </h3>

                      <div class="text-overline text-grey-darken-1">Horario</div>

                      <strong
                        >{{ attendanceStatus.class.start_time }} hrs a
                        {{ attendanceStatus.class.end_time }} hrs</strong
                      >
                    </v-col>
                  </v-row>

                  <v-chip
                    :color="statusMap.get(attendanceStatus.status)?.color"
                    size="large"
                    label
                    class="font-weight-black elevation-2 mb-4"
                  >
                    {{ statusMap.get(attendanceStatus.status)?.text }}
                  </v-chip>

                  <!-- <v-divider class="mb-4"></v-divider> -->

                  <v-row v-if="attendanceStatus.check_in" no-gutters class="mb-2">
                    <v-col
                      cols="6"
                      class="text-subtitle-1 font-weight-medium text-left text-grey-darken-1"
                    >
                      <v-icon icon="mdi-clock-in" class="mr-2"></v-icon>
                      Entrada:
                    </v-col>
                    <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">
                      {{ attendanceStatus.check_in }} hrs
                    </v-col>
                  </v-row>

                  <v-row v-if="attendanceStatus.check_out" no-gutters class="mb-4">
                    <v-col
                      cols="6"
                      class="text-subtitle-1 font-weight-medium text-left text-grey-darken-1"
                    >
                      <v-icon icon="mdi-clock-out" class="mr-2"></v-icon>
                      Salida:
                    </v-col>
                    <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">
                      {{ attendanceStatus.check_out }} hrs
                    </v-col>
                  </v-row>

                  <v-divider class="my-4"></v-divider>

                  <p v-if="attendanceStatus.status === 'ABSENT'" class="font-weight-medium">
                    No se registro tu asistencia para la sesión: {{ attendanceStatus.class.name }}.
                  </p>
                  <p
                    class="font-weight-medium"
                    v-for="(line, i) in statusMap.get(attendanceStatus.status)?.message"
                    :key="i"
                  >
                    {{ line }}
                  </p>
                </v-card-text>
              </v-card>
            </div>
          </div>

          <!-- Sin asignación -->
          <div v-else>
            <v-alert type="error" class="mb-4" :icon="false">
              <p>No tienes ninguna sesión asignada para hoy.</p>
              <br />
              <strong>Nota:</strong> Si hay algún inconveniente, comunícate con el personal
              encargado.
            </v-alert>
          </div>
        </v-col>
      </v-row>
    </template>

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
  <ConfirmationDialog ref="confirmationDialog" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTokenPageStore } from '@/stores/views/tokenPage'
import QrcodeVue from 'qrcode.vue'
import dayjs from 'dayjs'
import { statusMap } from '../../../constants'
import ConfirmationDialog from '@/components/shared/ConfirmationDialog.vue'

const { loading, attendanceToken, expireToken, attendanceStatus, loadingStatus } =
  storeToRefs(useTokenPageStore())
const { onCreateAttendanceToken, fetchAttendanceStatus, onCreateCheckout } = useTokenPageStore()

const showQrDialog = ref(false)
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog>>()

const generateToken = async () => {
  await onCreateAttendanceToken()
}

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

const validateCheckOut = async () => {
  const response = await confirmationDialog.value?.open({
    title: 'Marcar salida',
    body: '¿Desea marcar salida para esta sesión?',
  })
  if (!response) return
  await onCreateCheckout()
}
</script>

<style scoped>
.text-gray {
  color: #6b6b6b;
}
</style>
