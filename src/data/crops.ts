export type Crop = {
  name: string
  scientific: string
  difficulty: string
  category: string
  description: string
  light: string
  climate: string
  ph: string
  ec: string
  space: string
  harvest: string
  care: string
  symbol: string
}

// Rangos agronómicos específicos pendientes de verificación por variedad y fuente local.
export const crops: Crop[] = [
  { name: 'Lechuga', scientific: 'Lactuca sativa', difficulty: 'Inicial', category: 'Hoja', symbol: '/images/Lechuga%20simbolo.png',
    description: 'Una opción habitual para iniciar ensayos hidropónicos; existen variedades con respuesta distinta al calor.', light: 'Buena luz; proteger de radiación intensa si aumenta la temperatura de hoja.', climate: 'Prefiere condiciones frescas; vigilar espigado con calor.', ph: 'Consultar guía por variedad (pendiente de fuente validada).', ec: 'Consultar guía por variedad (pendiente de fuente validada).', space: 'Soporte individual y espacio para formar roseta.', harvest: 'Variable según variedad, clima y etapa de trasplante.', care: 'Vigilar raíces, algas, ventilación y signos de espigado.' },
  { name: 'Albahaca', scientific: 'Ocimum basilicum', difficulty: 'Inicial', category: 'Aromática', symbol: '/images/Simbolo%20Albahaca.png',
    description: 'Aromática de clima cálido; conviene evitar que sombree cultivos bajos.', light: 'Luz abundante; ajustar exposición en olas de calor.', climate: 'Cálido, sin frío intenso.', ph: 'Consultar guía por variedad (pendiente de fuente validada).', ec: 'Consultar guía por variedad (pendiente de fuente validada).', space: 'Dejar espacio para ramificación y cosecha de brotes.', harvest: 'Variable según variedad y manejo de poda.', care: 'Buena ventilación y cosecha frecuente de puntas.' },
  { name: 'Cilantro', scientific: 'Coriandrum sativum', difficulty: 'Intermedia', category: 'Aromática', symbol: '/images/Simbolo%20Cilantro.png',
    description: 'Puede espigarse con rapidez bajo calor; planear siembras escalonadas.', light: 'Luz adecuada; sombra parcial puede ayudar en calor fuerte.', climate: 'Mejor en condiciones frescas a templadas.', ph: 'Consultar guía por variedad (pendiente de fuente validada).', ec: 'Consultar guía por variedad (pendiente de fuente validada).', space: 'Soporte ligero; evitar competencia por luz.', harvest: 'Variable; el calor y la variedad pueden acortar la fase foliar.', care: 'Mantener humedad estable sin saturar y observar espigado.' },
  { name: 'Acelga', scientific: 'Beta vulgaris subsp. vulgaris', difficulty: 'Intermedia', category: 'Hoja', symbol: '/images/Simbolo%20Acelga.png',
    description: 'Planta de hoja amplia; prever tamaño adulto antes de compartir canales.', light: 'Luz abundante con protección en extremos de calor.', climate: 'Tolera un rango amplio, pero las temperaturas extremas afectan el crecimiento.', ph: 'Consultar guía por variedad (pendiente de fuente validada).', ec: 'Consultar guía por variedad (pendiente de fuente validada).', space: 'Mayor espacio aéreo y radicular que una plántula pequeña.', harvest: 'Variable; cosecha escalonada según desarrollo y manejo.', care: 'Revisar sombreado, anclaje y hojas dañadas.' },
  { name: 'Espinaca', scientific: 'Spinacia oleracea', difficulty: 'Intermedia', category: 'Hoja', symbol: '/images/Simbolo%20Espinaca.png',
    description: 'Cultivo de preferencia fresca; la adaptación depende de variedad y control ambiental.', light: 'Buena luz; evitar sobrecalentamiento.', climate: 'Fresco; sensible al calor y al espigado.', ph: 'Consultar guía por variedad (pendiente de fuente validada).', ec: 'Consultar guía por variedad (pendiente de fuente validada).', space: 'Soporte individual y espacio para roseta.', harvest: 'Variable por variedad, temperatura y etapa de cosecha.', care: 'Evitar calor persistente; verificar germinación y ventilación.' },
]
