<template>
  <v-form class="login__screen-form mx-auto text-center">
    <!-- <LoadingOverlay v-model="loading" /> -->

    <div class="text-center mb-6">
      <!-- <h2 class="font-weight-bold">IMPULSO UNIVERSITARIO DIGITAL</h2> -->
      <h2 class="font-weight-bold">INICIAR SESIÓN</h2>
    </div>
    <v-text-field
      v-model="formLogin.enrollment"
      label="Matrícula"
      prepend-inner-icon="mdi-account"
      maxlength="9"
      :rules="[rules.maxLength]"
      required
      @input="formLogin.enrollment = formLogin.enrollment.toUpperCase()"
    ></v-text-field>
    <v-text-field
      v-model="formLogin.password"
      label="Contraseña"
      :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show ? 'text' : 'password'"
      @click:append-inner="show = !show"
      prepend-inner-icon="mdi-lock"
    ></v-text-field>
    <v-btn size="small" variant="text" class="text-left d-block px-0 text-disabled">
      <!-- <router-link to="">Recuperar contraseña</router-link> -->
    </v-btn>
    <v-btn class="mt-3" color="primary" @click="submit" :loading="loading">Acceder</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthPageStore } from '@/stores/views/authPage'

const formLogin = ref<LoginInterface>({ enrollment: '', password: '' })

const { onLogin } = useAuthPageStore()
const { loading } = storeToRefs(useAuthPageStore())

const rules = {
  maxLength: (value: string) => value.length >= 9 || 'Mínimo 9 caracteres permitidos',
}

const submit = async () => {
  await onLogin(formLogin.value)
}

const show = ref(false)
</script>
