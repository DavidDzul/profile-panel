import * as yup from 'yup'

export const id = () => yup.number().required()
export const first_name = () => yup.string().required('Campo requerido').label('Nombre')
export const last_name = () => yup.string().required('Campo requerido').label('Apellido(s)')
export const email = () => yup.string().required('Campo requerido').label('Correo electrónico')
export const workstation = () => yup.string().required('Campo requerido').label('Puesto de trabajo')
export const password = () => yup.string().required().min(6).label('Contraseña')
export const updatePassword = () => yup.string().min(6).label('Contraseña')
export const confirmation = () =>
  yup
    .string()
    .transform((curr, orig) => (orig === '' ? undefined : curr))
    .when('password', {
      is: (val: string) => !!val,
      then: (schema) => schema.required(),
    })
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .label('Confirmar Contraseña')
export const phone = () => yup.string().required('Campo requerido').label('Teléfono')
