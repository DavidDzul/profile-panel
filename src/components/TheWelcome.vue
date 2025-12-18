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
        <v-card class="pa-2" elevation="2">
          <v-card-title class="font-weight-bold">
            Novedades
            <v-badge
              v-if="noticePageStore.notices.length"
              :content="noticePageStore.notices.length"
              color="error"
              inline
              class="ml-2"
            ></v-badge>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center my-2">
            <template v-if="noticePageStore.notices.length">
              <v-row>
                <v-col v-for="notice in noticePageStore.notices" :key="notice.id" cols="12">
                  <v-card
                    variant="flat"
                    :color="notice.global ? 'indigo-lighten-5' : 'blue-lighten-5'"
                    class="rounded-xl"
                    :class="notice.global ? 'border-indigo-darken-2' : 'border-teal-darken-2'"
                  >
                    <v-card-item class="py-3">
                      <div class="d-flex align-center justify-center">
                        <v-avatar
                          :color="notice.global ? 'indigo-darken-2' : 'blue-darken-2'"
                          size="32"
                          class="mr-3"
                          elevation="2"
                        >
                          <v-icon
                            :icon="notice.global ? 'mdi-bullhorn-variant' : 'mdi-school'"
                            color="white"
                            size="small"
                          ></v-icon>
                        </v-avatar>

                        <v-card-title
                          class="text-button font-weight-black ma-0"
                          :class="notice.global ? 'text-indigo-darken-4' : 'text-blue-darken-4'"
                          style="letter-spacing: 1px"
                        >
                          {{ notice.global ? 'Comunicado General' : 'Aviso de tu Sede' }}
                        </v-card-title>
                      </div>
                    </v-card-item>

                    <v-divider
                      :color="notice.global ? 'indigo-darken-1' : 'blue-darken-1'"
                      class="mx-10"
                      opacity="0.1"
                    ></v-divider>

                    <v-card-text
                      class="text-body-1 py-3 px-8 text-grey-darken-4 font-weight-medium"
                    >
                      {{ notice.message }}
                    </v-card-text>

                    <!-- <v-card-actions v-if="!notice.global" class="justify-end px-6 pb-3">
                      <v-chip
                        size="x-small"
                        color="teal-darken-2"
                        variant="flat"
                        prepend-icon="mdi-map-marker"
                        class="text-uppercase font-weight-bold"
                      >
                        {{ notice.campus }}
                      </v-chip>
                    </v-card-actions> -->
                  </v-card>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-icon size="48" color="grey">mdi-bell-off</v-icon>
              <p class="mt-3 text-subtitle-1 text-grey">No hay novedades por ahora</p>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/api/authStore'
import { useNoticePageStore } from '@/stores/views/noticePage'

const authStore = useAuthStore()
const noticePageStore = useNoticePageStore()

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
