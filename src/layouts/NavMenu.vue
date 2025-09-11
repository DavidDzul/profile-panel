<template>
  <v-list style="margin-top: -8px">
    <template v-for="(item, i) in links" :key="i">
      <template v-if="item.group">
        <!-- <v-list-group :value="item.text">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="item.text" :prepend-icon="item.icon" />
          </template>
          <template v-for="(subItem, map) in item.links" :key="map">
            <v-list-item :title="subItem.text" :to="subItem.link" :exact="true" />
          </template>
        </v-list-group> -->
      </template>
      <template v-else>
        <v-list-item :to="item.link" :title="item.text" :prepend-icon="item.icon" :exact="true" />
      </template>
    </template>
  </v-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const links = ref([
  {
    text: 'Inicio',
    icon: 'mdi-home',
    link: '/',
    group: false,
  },
  {
    text: 'Asistencia',
    icon: 'mdi-timer',
    link: '/asistencia',
    group: false,
  },
  // {
  //   text: 'Usuarios',
  //   icon: 'mdi-account-multiple',
  //   group: true,
  //   links: [
  //     { text: 'Becarios/as', link: '/becarios' },
  //     { text: 'Egresados/as', link: '/egresados' },
  //     { text: 'Empresas', link: '/empresas' },
  //   ],
  // },
])
</script>
