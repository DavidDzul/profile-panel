<template>
  <v-container fluid>
    <!-- HEADER con gradiente -->
    <div class="mb-6">
      <h2 class="text-h5 font-weight-black text-grey-darken-3 mb-1">Historial de Asistencias</h2>
    </div>

    <!-- RESUMEN DE ASISTENCIAS -->
    <v-row class="text-center mb-4" dense>
      <v-col cols="12" class="py-2">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Seleccionar año"
          density="comfortable"
          variant="outlined"
          hide-details
          class="rounded-lg"
          @update:model-value="fetchHistory"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <v-select
          v-model="selectedSemester"
          :items="semesters"
          label="Seleccionar semestre"
          density="comfortable"
          variant="outlined"
          hide-details
          class="rounded-lg"
          item-title="title"
          item-value="value"
        />
      </v-col>
      <v-col cols="6" sm="3" v-for="status in statusSummary" :key="status.key">
        <v-chip
          :color="status.color"
          class="w-100 py-2 font-weight-bold justify-center"
          label
          size="large"
        >
          {{ status.label }}: {{ totalByStatus[status.key] }}
        </v-chip>
      </v-col>
    </v-row>

    <!-- LISTA DE ASISTENCIAS -->
    <v-row dense>
      <template v-if="loading">
        <v-col cols="12" v-for="i in 5" :key="i">
          <v-skeleton-loader type="list-item-two-line" class="rounded-lg" />
        </v-col>
      </template>

      <template v-else>
        <v-col v-for="(item, i) in filteredHistory" :key="i" cols="12">
          <!-- <v-card class="pa-4 rounded-lg elevation-1 d-flex flex-column">
            <v-row class="ma-0 pa-0 align-center">
              <v-col cols="12" class="pa-0 mb-2">
                <div class="text-center">
                  <div
                    class="font-weight-bold text-primary text-body-1"
                    style="word-break: break-word"
                  >
                    📚 {{ item.class.name }}
                  </div>
                  <div class="text-caption text--secondary">
                    <strong>Fecha:</strong> {{ formatDate(item.class.date) }}
                  </div>
                  <div class="font-weight-bold text-caption">Horario:</div>
                  <div class="text--primary text-caption">
                    <v-icon size="small" color="secondary">mdi-clock-time-four-outline</v-icon>
                    {{ item.class.start_time }} hrs a {{ item.class.end_time }} hrs
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-1"></v-divider>

            <div class="d-flex justify-space-between align-center mt-2 flex-wrap">
              <v-chip
                :color="statusColor(item.status)"
                dark
                label
                size="small"
                class="font-weight-medium mb-2"
              >
                {{ statusMap.get(item.status)?.text }}
              </v-chip>

              <div class="text-caption d-flex flex-column align-end">
                <div><strong>Entrada:</strong> {{ item.check_in || '—' }} hrs</div>
                <div><strong>Salida:</strong> {{ item.check_out || '—' }} hrs</div>
              </div>
            </div>
          </v-card> -->

          <v-expansion-panels variant="accordion" class="mb-4 custom-expansion">
            <v-expansion-panel class="rounded-lg overflow-hidden elevation-2">
              <v-expansion-panel-title class="pa-4">
                <div class="d-flex flex-column align-center w-100 text-center pr-2">
                  <h3 class="font-weight-black text-black line-clamp-1 my-1">
                    {{ item.class.name }}
                  </h3>

                  <div class="d-flex align-center justify-center text-grey-darken-1 mt-2">
                    <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(item.class.date) }}
                    <v-chip
                      :color="statusColor(item.status)"
                      size="x-small"
                      variant="flat"
                      class="ml-3 font-weight-bold"
                    >
                      {{ statusMap.get(item.status)?.text }}
                    </v-chip>
                  </div>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="bg-grey-lighten-5 pa-2">
                <v-divider class="mb-4"></v-divider>

                <div class="text-center mb-4">
                  <span class="text-overline text-grey-darken-2">Horario de la Clase</span>
                  <div class="text-body-2 font-weight-bold">
                    {{ item.class.start_time }} hrs - {{ item.class.end_time }} hrs
                  </div>
                </div>

                <v-row no-gutters class="bg-white rounded-lg pa-3 border">
                  <v-col cols="6" class="text-center border-e">
                    <div class="text-overline text-grey-darken-2">Entrada</div>
                    <div class="text-body-1 font-weight-black text-success">
                      {{ item.check_in || '--:--' }}
                    </div>
                  </v-col>
                  <v-col cols="6" class="text-center">
                    <div class="text-overline text-grey-darken-2">Salida</div>
                    <div class="text-body-1 font-weight-black text-secondary">
                      {{ item.check_out || '--:--' }}
                    </div>
                  </v-col>
                </v-row>

                <div
                  v-if="item.status === 'ABSENT'"
                  class="mt-4 text-caption text-error text-center font-weight-medium"
                >
                  No se detectó registro de actividad en esta sesión.
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </template>
    </v-row>

    <!-- SIN DATOS -->
    <div v-if="!filteredHistory?.length" class="text-center py-10">
      <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
      <div class="text-subtitle-1 mt-3">No se encontraron asistencias</div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { statusMap } from '../../../constants'
import { useHistoryPageStore } from '@/stores/views/historyPage'
import { storeToRefs } from 'pinia'

type StatusKey = 'PRESENT' | 'LATE' | 'JUSTIFIED' | 'ABSENT'

const { userHistory, loading } = storeToRefs(useHistoryPageStore())
const { fetchHistory } = useHistoryPageStore()

const currentYear = dayjs().year()
const years = [currentYear, currentYear - 1]
const selectedYear = ref(currentYear)
const semesters = [
  { title: 'Enero - Junio', value: 1 },
  { title: 'Agosto - Diciembre', value: 2 },
]
const selectedSemester = ref(null)

onMounted(async () => {
  if (!userHistory.value || userHistory.value.length === 0) {
    await fetchHistory(currentYear)
  }
})

const filteredHistory = computed(() => {
  if (!selectedSemester.value) return []

  return userHistory.value?.filter((item) => {
    const d = dayjs(item.class.date)
    const yearMatch = d.year() === selectedYear.value

    const month = d.month() + 1

    const semesterMatch =
      selectedSemester.value === 1 ? month >= 1 && month <= 6 : month >= 8 && month <= 12

    return yearMatch && semesterMatch
  })
})

const totalByStatus = computed(() => {
  const totals: Record<StatusKey, number> = {
    PRESENT: 0,
    LATE: 0,
    JUSTIFIED: 0,
    ABSENT: 0,
  }

  filteredHistory.value?.forEach((item) => {
    if (item.status === 'JUSTIFIED_ABSENCE' || item.status === 'JUSTIFIED_LATE') {
      totals.JUSTIFIED++
    } else if (item.status in totals) {
      totals[item.status as StatusKey]++
    }
  })

  return totals
})

const statusColor = (status: string) => {
  switch (status) {
    case 'PRESENT':
      return 'green'
    case 'LATE':
      return 'orange'
    case 'JUSTIFIED_ABSENCE':
    case 'JUSTIFIED_LATE':
      return 'pink'
    case 'ABSENT':
      return 'red'
    default:
      return 'grey'
  }
}

const statusSummary: { key: StatusKey; color: string; label: string }[] = [
  { key: 'PRESENT', color: 'green', label: 'A tiempo' },
  { key: 'LATE', color: 'orange', label: 'Retardos' },
  { key: 'JUSTIFIED', color: 'pink', label: 'Justificadas' },
  { key: 'ABSENT', color: 'red', label: 'Faltas' },
]

const formatDate = (date: string) => dayjs(date).format('DD/MM/YYYY')

// ENERO - JULIO / AGO - DIC
</script>

<style scoped>
.text-caption {
  font-size: 0.85rem;
}
</style>
