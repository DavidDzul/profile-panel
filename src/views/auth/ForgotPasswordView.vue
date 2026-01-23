<template>
  <v-form class="login__screen-form my-auto mx-auto text-center" v-if="!recoverSucces">
    <v-text-field v-model="email" v-bind="emailProps" label="Correo electrónico"></v-text-field>
    <v-btn class="mt-3" color="primary" :disabled="!meta.valid" @click="recover" :loading="loading">Recuperar Contraseña</v-btn>
    <p class="mt-5">
      ¿Tienes una cuenta? <br />
      Ingresa haciendo clic en
      <router-link to="/auth/login">INICIAR SESIÓN</router-link>
    </p>
  </v-form>
  <div class="login__screen-form mx-auto text-center" v-else>
    <h3>Correo enviado</h3>
    <p>El correo con las instrucciones para reiniciar tu contraseña ha sido enviado. Si no lo has recibido recuerda revisar tu carpeta de SPAM o solicitalo nuevamente.</p>
    <v-btn class="mt-3" color="primary" to="/auth/login">Regresar a Inicio</v-btn>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup"
import { storeToRefs } from "pinia"
import { PublicPathState, useForm } from "vee-validate"
import * as yup from "yup"

import { useForgotPasswordPageStore } from "@/store/views/ForgotPasswordPage"
import * as validations from "@/validations"

const vuetifyConfig = (state: PublicPathState) => ({
  props: {
    "error-messages": state.errors,
  },
})

export interface RecoverForm {
  email: string
}

const { defineField, meta, values, resetForm } = useForm<RecoverForm>({
  validationSchema: toTypedSchema(
    yup.object({
      email: validations.email(),
    }),
  ),
})
const [email, emailProps] = defineField("email", vuetifyConfig)

const { onRecoverPassword } = useForgotPasswordPageStore()
const { loading, recoverSucces } = storeToRefs(useForgotPasswordPageStore())

const recover = () => {
  if (meta.value.valid) {
    onRecoverPassword(values.email)
  }
}
</script>
<style scoped lang="scss"></style>
