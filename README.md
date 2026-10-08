# HidroTec · Ingenio Pantera

Primera versión funcional de una plataforma educativa en español sobre un sistema hidropónico en L. Está hecha con React, TypeScript y Vite.

> **Aviso sobre el prototipo:** la ilustración de portada está basada en la referencia visual compartida, pero no es una foto ni un plano técnico. No confirma dimensiones, materiales, funcionamiento o componentes realmente instalados.

## Ejecutarla (principiantes)

1. Instala **Node.js LTS** desde [nodejs.org](https://nodejs.org/). La instalación incluye npm. Cierra y vuelve a abrir la terminal de VS Code después de instalarlo.
2. Abre la carpeta HidroTec en VS Code.
3. En el menú **Terminal → Nueva terminal**, escribe `npm install` y presiona Enter. Esto instala las dependencias descritas en `package.json`.
4. Después escribe `npm run dev` y presiona Enter.
5. Abre en el navegador la dirección local que Vite muestra en la terminal (normalmente `http://localhost:5173`). Para detener el servidor, vuelve a la terminal y presiona Ctrl+C.

Para comprobar una versión de producción: `npm run build`. Para verla localmente después de compilar: `npm run preview`.

## Qué editar

- **Textos y secciones:** `src/App.tsx`. Busca los encabezados del contenido en español y edita el texto visible. Los componentes de la interfaz y el comportamiento están en este archivo.
- **Estilos, colores y adaptación móvil:** `src/styles.css`. Las variables de color están al inicio; las reglas responsive están en los bloques `@media` del final.
- **Cultivos:** `src/data/crops.ts`. Cada ficha está en un objeto. Los valores de pH y conductividad se muestran como pendientes, a propósito, hasta añadir referencias verificadas para cultivo/variedad.
- **Redes y correo:** `src/config/socialLinks.ts`. Sustituye `''` por la URL real. Los enlaces vacíos se ocultan tanto en la sección de contacto como en el pie. No agregues cuentas de ejemplo.
- **Logo:** el archivo de marca original está en `public/images/Logo de Hidrotecnm.png` y se usa en el encabezado, el pie y el favicon. Puedes reemplazarlo manteniendo ese nombre o cambiar las rutas en `src/App.tsx` e `index.html`.
- **Galería visual:** la portada alterna `Prototipo 2 HidroTec.png`, `Hidrotec espacio desierto.png` y `Hidrotec Espacio amplio.png`, manualmente con flechas/puntos o automáticamente cada 7 segundos. Se detiene al poner el cursor o el foco sobre la galería, y desactiva el cambio automático si el dispositivo solicita movimiento reducido. Son visualizaciones conceptuales, no fotos documentales de una instalación comprobada.
- **Ficha visual:** usa `Prototipo 2 HidroTec.png`; su descripción deja explícito que no confirma dimensiones, materiales ni funcionamiento.
- **Preguntas y preventa:** la sección Preguntas frecuentes y el formulario de interés están en `src/App.tsx`; sus estilos adaptables se encuentran en `src/preorder.css`.
- **Registro de interés:** se guarda en `localStorage` de ese navegador/dispositivo y solo sirve para probar el formulario. No se envía al equipo ni a un servidor, no reserva un prototipo ni genera una venta. Se puede borrar desde el propio formulario. Antes de usarlo públicamente como captación real, hay que conectar un backend seguro, publicar el aviso de privacidad y establecer el tratamiento de datos.
- **Imágenes del sistema:** el logo es una ilustración de marca, no una fotografía ni verificación del equipo instalado. Para mostrar una imagen real, colócala en `public/images/` y edita el bloque `.hero-art` en `src/App.tsx` con texto alternativo y una leyenda clara. Evita atribuir al equipo componentes que no confirme una foto o plano.
- **Nombre de proyecto y firma:** el título de pestaña está en `index.html`; la firma de portada y pie y el nombre visual se editan en `src/App.tsx`. Conserva exactamente “By Ingenio Pantera” si debe mantenerse como firma.

## Dashboard: demostración y conexión

El panel inicia en **Modo demostración**. Un aviso verde permanente identifica explícitamente que las lecturas y la gráfica son **simuladas** y no proceden de sensores. Los valores ilustrativos solo se presentan para enseñar la interfaz, no para operar un cultivo. Los datos de temperatura ambiental, nivel, volúmenes, caudal, bomba y consumo eléctrico no se inventan: el dashboard indica que no hay dato.

Al pulsar **Conectado**, la plataforma muestra **Sensor no conectado** y una gráfica vacía. No hay API de sensores, credenciales, lecturas reales, control de bomba o dosificación implementados. La elección de periodo cambia la serie ilustrativa en modo demostración.

La calculadora de agua usa los valores escritos por el usuario: $L/kg = litros / kg$ y ahorro relativo = $((L/kg)_{referencia} - (L/kg)_{hidroponía}) / (L/kg)_{referencia} \times 100$. Rechaza cosechas de cero, datos negativos o un denominador de referencia cero; resultados negativos se conservan y explican. La calculadora no valida que los datos correspondan al mismo cultivo, ciclo o límite de medición: esa comprobación la debe hacer quien ingresa los datos. El campo de periodo es obligatorio, pero su contenido no se valida automáticamente.

## Contenido técnico y transparencia

La información agronómica específica y los rangos de pH/conductividad por cultivo, así como recomendaciones climáticas localizadas, están señalados como pendientes de fuente específica. No son resultados medidos ni una receta de cultivo. Las referencias institucionales incluidas son puntos de partida, no citas que respalden automáticamente cada afirmación. Para completar esas secciones, consulta las fuentes y añade la cita junto a cada afirmación.

## API preparada para sensores

Consulta [`docs/API.md`](docs/API.md) para un contrato JSON propuesto. Es documentación; no hay endpoint integrado. No pongas tokens privados en React ni en el navegador. Un backend debe validar dispositivos y unidades antes de enviar lecturas.

## Dependencias y solución de problemas

- Node.js LTS + npm.
- React, React DOM, TypeScript, Vite y el plugin de React.
- Si `npm` no se reconoce, instala Node.js LTS y reinicia VS Code. El equipo que generó estos archivos no tenía npm disponible, así que la instalación y compilación deben validarse en un entorno con Node.js.
