export const statusMap = new Map([
  [
    'PRESENT',
    {
      value: 'PRESENT',
      text: 'A TIEMPO',
      color: 'green',
      icon: 'mdi-check-circle',
      title: 'ASISTENCIA FINALIZADA',
      message: [
        '¡Continúa así!',
        'Gracias por tu puntualidad, compromiso y participación. Tu constancia es clave para aprovechar al máximo tu proceso de formación.',
      ],
    },
  ],
  [
    'LATE',
    {
      value: 'LATE',
      text: 'RETARDO',
      color: 'orange',
      icon: 'mdi-alert-circle',
      title: 'ASISTENCIA FINALIZADA',
      message: [
        'Se ha registrado un retardo en tu asistencia a esta sesión.',
        'Te invitamos a organizar tus tiempos para evitar futuros retrasos y aprovechar al máximo tu proceso de formación.',
      ],
    },
  ],
  [
    'JUSTIFIED_LATE',
    {
      value: 'JUSTIFIED_LATE',
      text: 'RETARDO JUSTIFICADO',
      color: 'pink',
      icon: 'mdi-information',
      title: 'ASISTENCIA JUSTIFICADA',
      message: [
        'Tu retardo ha sido justificado. Agradecemos tu esfuerzo por asistir.',
        'Te recordamos la importancia de la puntualidad para el buen desarrollo de la sesión.',
      ],
    },
  ],
  [
    'JUSTIFIED_ABSENCE',
    {
      value: 'JUSTIFIED_ABSENCE',
      text: 'FALTA JUSTIFICADA',
      color: 'pink',
      icon: 'mdi-information',
      title: 'ASISTENCIA JUSTIFICADA',
      message: [
        'Tu falta ha sido justificado. Agradecemos tu esfuerzo por asistir.',
        'Te recordamos la importancia de la puntualidad para el buen desarrollo de la sesión.',
      ],
    },
  ],
  [
    'ABSENT',
    {
      value: 'ABSENT',
      text: 'FALTA',
      color: 'red',
      icon: 'mdi-close-circle',
      title: 'NO SE REGISTRO TU ASISTENCIA',
      message: [
        `Te sugerimos comunicarte con el Área de Atención a Jóvenes en Formación para justificar tu falta o recibir la orientación correspondiente.`,
      ],
    },
  ],
])
