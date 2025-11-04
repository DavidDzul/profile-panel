<template>
  <v-container class="pa-4">
    <!-- HEADER con gradiente -->
    <v-card
      class="pa-5 rounded-2xl elevation-4 mb-4"
      style="background: linear-gradient(135deg, #1976d2, #64b5f6); color: white"
    >
      <div class="d-flex flex-column gap-3">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="text-h6 font-weight-bold">📋 Historial de Asistencias</div>

          <!-- SELECT de año -->
        </div>
      </div>
    </v-card>

    <!-- RESUMEN DE ASISTENCIAS -->
    <v-row class="text-center mb-4" dense>
      <v-col cols="12" class="py-2">
        <v-select
          v-model="selectedYear"
          :items="[2025, 2026]"
          label="Seleccionar año"
          density="comfortable"
          variant="outlined"
          hide-details
          class="rounded-lg"
          @update:model-value="fetchHistory"
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
      <v-col v-for="(item, i) in filteredHistory" :key="i" cols="12">
        <v-card class="pa-4 rounded-lg elevation-1 d-flex flex-column">
          <div class="font-weight-bold text-primary mb-1" style="word-break: break-word">
            📚 {{ item.class.name }}
          </div>

          <div class="text-caption mb-2">
            <strong>Fecha:</strong> {{ formatDate(item.class.date) }}
          </div>

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
              <div><strong>Entrada:</strong> {{ item.check_in || '—' }}</div>
              <div><strong>Salida:</strong> {{ item.check_out || '—' }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- SIN DATOS -->
    <div v-if="!filteredHistory?.length" class="text-center py-10">
      <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
      <div class="text-subtitle-1 mt-3">No se encontraron asistencias para {{ selectedYear }}</div>
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

const { userHistory } = storeToRefs(useHistoryPageStore())

const selectedYear = ref(dayjs().year())

const fetchHistory = async () => {
  try {
    const res = await fetch(`/api/attendance/history?year=${selectedYear.value}`)
    const data = await res.json()
    userHistory.value = data
  } catch (error) {
    console.error('Error al obtener historial:', error)
  }
}

onMounted(async () => {
  await fetchHistory()
})

// Filtra por año (por si también se quiere filtrar localmente)
const filteredHistory = computed(() =>
  userHistory.value?.filter((item) => dayjs(item.class.date).year() === selectedYear.value),
)

// Totales
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

// Colores
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

// Resumen
const statusSummary: { key: StatusKey; color: string; label: string }[] = [
  { key: 'PRESENT', color: 'green', label: 'A tiempo' },
  { key: 'LATE', color: 'orange', label: 'Retardos' },
  { key: 'JUSTIFIED', color: 'pink', label: 'Justificadas' },
  { key: 'ABSENT', color: 'red', label: 'Faltas' },
]

const formatDate = (date: string) => dayjs(date).format('DD/MM/YYYY')
</script>

<style scoped>
.text-caption {
  font-size: 0.85rem;
}
</style>
