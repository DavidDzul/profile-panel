<template>
  <v-container class="py-8">
    <!-- Saludo -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="display-1 font-weight-bold">Hola, {{ userName }} 👋</h1>
        <p class="subtitle-1 text-subtitle-2">
          Bienvenido/a al portal de Impulso Universitario A.C.
        </p>
      </v-col>
    </v-row>

    <!-- Área de noticias/recordatorios -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="font-weight-bold"> Novedades </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center my-6">
            <v-icon size="48" color="grey">mdi-bell-off</v-icon>
            <p class="mt-3 text-subtitle-1 text-grey">No hay novedades por ahora</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/api/authStore'

const authStore = useAuthStore()
const userName = computed(() => {
  return authStore.userProfile?.first_name ?? 'Usuario'
})
</script>

<style scoped>
.display-1 {
  font-size: 2.5rem;
}

.text-grey {
  color: #757575;
}
</style>
