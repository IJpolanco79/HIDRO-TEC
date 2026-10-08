import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import { crops } from './data/crops'
import { socialLinks } from './config/socialLinks'
import { PurchaseSimulation } from './PurchaseSimulation'
import { type PreSaleEntry, clearOrders, exportControlExcel, loadOrders } from './orders'
import { PRICE_LABEL } from './config/purchase'

type IconName = 'leaf' | 'water' | 'sun' | 'drop' | 'chart' | 'arrow' | 'check' | 'alert' | 'menu' | 'close'
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const paths: Record<IconName, ReactNode> = {
    leaf: <><path d="M20 4c-8 0-13 3-13 9a6 6 0 0 0 6 6c6 0 9-5 7-15Z"/><path d="M4 21c3-6 7-9 12-12"/></>,
    water: <><path d="M12 3s7 7.4 7 12a7 7 0 0 1-14 0c0-4.6 7-12 7-12Z"/><path d="M9 16a3 3 0 0 0 3 3"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    drop: <><path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z"/></>,
    chart: <><path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 6-7"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4m0 3h.01"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function InstagramLogo({ size = 19 }: { size?: number }) {
  return (
    <svg className="instagram-logo" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Instagram">
      <defs>
        <linearGradient id="instagramGradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff8a3d" />
          <stop offset="52%" stopColor="#e1306c" />
          <stop offset="100%" stopColor="#833ab4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#instagramGradient)" strokeWidth="2.4" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#instagramGradient)" strokeWidth="2.2" />
      <circle cx="18" cy="6.5" r="1.35" fill="#c13584" />
    </svg>
  )
}

function WhatsAppLogo({ size = 19 }: { size?: number }) {
  return (
    <svg className="whatsapp-logo" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="WhatsApp">
      <path fill="currentColor" d="M12.04 2A9.93 9.93 0 0 0 3.5 17.02L2.1 22l5.1-1.34A10 10 0 1 0 12.04 2Zm0 18.18a8.15 8.15 0 0 1-4.16-1.14l-.3-.18-3.03.8.81-2.95-.2-.3a8.16 8.16 0 1 1 6.88 3.77Zm4.48-6.12c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.08 3.6.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}

const projectImages = [
  {
    src: '/images/Render-SolidWorks.jpg',
    title: 'Render final del proyecto · Diseño final',
    caption: 'Diseño final del proyecto · render en SolidWorks',
    alt: 'Render en SolidWorks de una mesa de cultivo con área de siembra al centro, dos torres verticales con plantas y un depósito inferior.',
  },
  {
    src: '/images/Prototipo%202%20HidroTec.png',
    title: 'Vista del prototipo',
    alt: 'Representación conceptual de una torre hidropónica junto a un módulo de cultivo, en un entorno desértico.',
  },
  {
    src: '/images/Hidrotec%20espacio%20desierto.png',
    title: 'Propuesta en entorno desértico',
    alt: 'Visualización conceptual de un invernadero hidropónico en un paisaje desértico.',
  },
  {
    src: '/images/Hidrotec%20Espacio%20amplio.png',
    title: 'Vista de espacio amplio',
    alt: 'Visualización conceptual de un invernadero amplio con torres de cultivo hidropónico.',
  },
]

function ProjectCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const activeImage = projectImages[activeIndex]

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projectImages.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [paused])

  function showImage(index: number) {
    setActiveIndex((index + projectImages.length) % projectImages.length)
  }

  return (
    <div
      className="project-carousel"
      role="region"
      aria-label="Galería de imágenes conceptuales del proyecto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <img key={activeImage.src} className="prototype-image" src={activeImage.src} alt={activeImage.alt} />
      <div className="carousel-caption"><b>{activeImage.title}</b><span>{'caption' in activeImage ? activeImage.caption : 'Visualización conceptual · no confirma instalaciones o resultados'}</span></div>
      <div className="carousel-controls">
        <button type="button" onClick={() => showImage(activeIndex - 1)} aria-label="Imagen anterior">‹</button>
        <div className="carousel-dots" aria-label="Seleccionar imagen">
          {projectImages.map((image, index) => <button key={image.src} type="button" className={index === activeIndex ? 'active' : ''} onClick={() => showImage(index)} aria-label={`Mostrar imagen ${index + 1}: ${image.title}`} aria-current={index === activeIndex ? 'true' : undefined} />)}
        </div>
        <button type="button" onClick={() => showImage(activeIndex + 1)} aria-label="Imagen siguiente">›</button>
      </div>
      <span className="carousel-count">0{activeIndex + 1} / 0{projectImages.length}</span>
    </div>
  )
}

const PRE_SALE_STORAGE_KEY = 'hidrotec-pre-sale-interest-v1'

function loadPreSaleEntries(): PreSaleEntry[] {
  try {
    const saved = localStorage.getItem(PRE_SALE_STORAGE_KEY)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed as PreSaleEntry[] : []
  } catch {
    return []
  }
}

const demoReadings = [
  { label: 'pH de solución', value: '6.1', unit: 'pH', time: '07 oct 2026 · 10:42', origin: 'Dato simulado', icon: 'drop' as const },
  { label: 'Conductividad', value: '1.4', unit: 'mS/cm', time: '07 oct 2026 · 10:42', origin: 'Dato simulado', icon: 'water' as const },
  { label: 'Temp. de solución', value: '21.8', unit: '°C', time: '07 oct 2026 · 10:42', origin: 'Dato simulado', icon: 'sun' as const },
  { label: 'Humedad relativa', value: '48', unit: '%', time: '07 oct 2026 · 10:42', origin: 'Dato simulado', icon: 'leaf' as const },
]
const graphSeries: Record<string, number[]> = { '24 horas': [37, 44, 42, 58, 54, 62, 58, 70, 64, 75, 68, 82], '7 días': [44, 39, 52, 48, 62, 57, 72, 65, 74, 68, 83, 77], '30 días': [32, 40, 36, 51, 46, 59, 55, 70, 64, 72, 68, 80] }

const cropPairings = [
  { plants: ['Lechuga', 'Cilantro'], assessment: 'Candidata para ensayo', detail: 'Evaluar en condiciones frescas. Vigilar la floración prematura del cilantro y ajustar el manejo según la variedad.' },
  { plants: ['Lechuga', 'Acelga'], assessment: 'Candidata para ensayo', detail: 'Controlar el tamaño de la acelga para evitar que sombree a la lechuga. Evaluar la cosecha de hojas jóvenes.' },
  { plants: ['Lechuga', 'Albahaca'], assessment: 'Requiere ajustes', detail: 'Sus preferencias térmicas pueden diferir. Comprobar que el ambiente y la solución permitan un crecimiento adecuado de ambas.' },
  { plants: ['Cilantro', 'Albahaca'], assessment: 'Conviene evaluar por separado al inicio', detail: 'El cilantro favorece condiciones frescas; la albahaca es de temporada cálida.' },
  { plants: ['Espinaca', 'Otras especies en raíz flotante'], assessment: 'Ensayo independiente recomendado', detail: 'La espinaca requiere especial vigilancia de temperatura, oxigenación y enfermedades radiculares.' },
]

const nutrientRanges = [
  { crop: 'Albahaca', ph: '5.5–6.0', ec: '1.0–1.6 mS/cm' },
  { crop: 'Lechuga', ph: '6.0–7.0', ec: '1.2–1.8 mS/cm' },
  { crop: 'Espinaca', ph: '6.0–7.0', ec: '1.8–2.3 mS/cm' },
]

const compatibilitySources = [
  { institution: 'Oklahoma State University', title: 'Electrical Conductivity and pH Guide for Hydroponics', supports: 'Referencia para pH, CE y manejo de la solución nutritiva.', url: 'https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics' },
  { institution: 'University of Florida · IFAS', title: 'Leafy Greens in Hydroponics and Protected Culture for Florida', supports: 'Diferencias entre acelga y espinaca y dificultades de espinaca en raíz flotante.', url: 'https://ask.ifas.ufl.edu/publication/HS1279' },
  { institution: 'Oregon State University', title: 'Hydro hints: Nutrient film technique', supports: 'Menciona las especies en NFT; no demuestra que compartan depósito ni que rindan igual en raíz flotante.', url: 'https://extension.oregonstate.edu/catalog/pub/em-9457-hydro-hints-nutrient-film-technique' },
  { institution: 'Utah State University', title: 'Cilantro/Coriander in the Garden', supports: 'Apoya la preferencia del cilantro por condiciones frescas; las recomendaciones de suelo no se trasladan directamente a hidroponía.', url: 'https://extension.usu.edu/yardandgarden/research/cilantro-coriander-in-the-garden' },
  { institution: 'University of Minnesota Extension', title: 'Growing herbs in home gardens', supports: 'Identifica la albahaca entre hierbas de temporada cálida.', url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-herbs' },
]

function App() {
  const [mode, setMode] = useState<'demo' | 'connected'>('demo')
  const [period, setPeriod] = useState('24 horas')
  const [filter, setFilter] = useState('Todos')
  const [selectedCrop, setSelectedCrop] = useState(crops[0].name)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydroWater, setHydroWater] = useState('')
  const [refWater, setRefWater] = useState('')
  const [hydroKg, setHydroKg] = useState('')
  const [refKg, setRefKg] = useState('')
  const [evaluationPeriod, setEvaluationPeriod] = useState('')
  const [calcUsed, setCalcUsed] = useState(false)
  const [preSaleEntries, setPreSaleEntries] = useState<PreSaleEntry[]>(loadPreSaleEntries)
  const [preSaleMessage, setPreSaleMessage] = useState('')
  const [simOpen, setSimOpen] = useState(false)

  const currentCrop = crops.find((crop) => crop.name === selectedCrop) ?? crops[0]
  const visibleCrops = crops.filter((crop) => filter === 'Todos' || crop.category === filter)
  const calculator = useMemo(() => {
    if (!calcUsed) return null
    const hW = Number(hydroWater); const rW = Number(refWater); const hK = Number(hydroKg); const rK = Number(refKg)
    if (![hydroWater, refWater, hydroKg, refKg].every((value) => value.trim() !== '') || !evaluationPeriod.trim() || ![hW, rW, hK, rK].every(Number.isFinite) || [hW, rW, hK, rK].some((value) => value < 0) || hK === 0 || rK === 0 || rW === 0) return { valid: false as const }
    const hSpecific = hW / hK; const rSpecific = rW / rK
    return { valid: true as const, hSpecific, rSpecific, saving: ((rSpecific - hSpecific) / rSpecific) * 100 }
  }, [calcUsed, hydroWater, refWater, hydroKg, refKg, evaluationPeriod])
  const chartPoints = (graphSeries[period] ?? graphSeries['24 horas']).map((value, index, values) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(' ')

  const isRegistered = preSaleEntries.length > 0

  function openPurchase() {
    if (isRegistered) { setSimOpen(true); return }
    setPreSaleMessage('Para habilitar la compra, primero completa el registro de interés.')
    jump('preventa')
  }

  async function downloadControl() {
    try {
      await exportControlExcel(preSaleEntries)
    } catch {
      setPreSaleMessage('No se pudo generar el archivo de Excel.')
    }
  }

  function jump(id: string) { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  function registerPreSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const entry: PreSaleEntry = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      location: String(formData.get('location') ?? '').trim(),
      interest: String(formData.get('interest') ?? ''),
      createdAt: new Date().toISOString(),
    }
    const updatedEntries = [...preSaleEntries, entry]
    try {
      localStorage.setItem(PRE_SALE_STORAGE_KEY, JSON.stringify(updatedEntries))
      setPreSaleEntries(updatedEntries)
      setPreSaleMessage('Interés guardado en este navegador. El equipo no recibió tus datos y esto no es una reserva ni genera un pago.')
      event.currentTarget.reset()
    } catch {
      setPreSaleMessage('No se pudo guardar el registro en este navegador. Libera espacio o prueba en otro navegador.')
    }
  }

  function clearPreSaleEntries() {
    try {
      localStorage.removeItem(PRE_SALE_STORAGE_KEY)
      clearOrders()
      setPreSaleEntries([])
      setPreSaleMessage('Se eliminaron los registros de preventa guardados en este navegador.')
    } catch {
      setPreSaleMessage('No se pudieron eliminar los registros guardados.')
    }
  }

  return <>
    <header className="topbar"><a className="brand" href="#inicio" aria-label="HidroTec, inicio"><img className="brand-logo" src="/images/Logo%20de%20Hidrotecnm.png" alt="Logo HidroTec, Raíces Flotantes" /><span>Hidro<span>Tec</span><small>INGENIO PANTERA</small></span></a>
      <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
      <nav className={mobileOpen ? 'nav open' : 'nav'}><a href="#sistema" onClick={() => setMobileOpen(false)}>El sistema</a><a href="#dashboard" onClick={() => setMobileOpen(false)}>Monitoreo</a><a href="#cultivos" onClick={() => setMobileOpen(false)}>Cultivos</a><a href="#recursos" onClick={() => setMobileOpen(false)}>Recursos</a><a href="#preventa" onClick={() => setMobileOpen(false)}>Preventa</a><a href="#preventa" onClick={() => { setMobileOpen(false); openPurchase() }}>Comprar</a><a href="#preguntas" onClick={() => setMobileOpen(false)}>Preguntas</a><button className="nav-cta" onClick={() => jump('preventa')}>Registro de interés <Icon name="arrow" size={16} /></button></nav>
    </header>

    <main id="inicio">
      <section className="hero section-wrap"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> APRENDER · CULTIVAR · MEDIR</div><h1>Cultivar más cerca.<br /><em>Cuidar cada gota.</em></h1><p className="hero-lead">Una guía abierta para explorar un sistema hidropónico en L, entender sus variables y cultivar con criterio en Chihuahua y el noroeste de México.</p><div className="hero-actions"><button className="button primary" onClick={() => jump('sistema')}>Conocer el sistema <Icon name="arrow" size={17} /></button><button className="button secondary" onClick={() => jump('dashboard')}>Ver dashboard</button><button className="text-link" onClick={() => jump('guia')}>Guía de cultivo <Icon name="arrow" size={16} /></button></div><div className="hero-note"><span className="note-icon"><Icon name="water" size={18} /></span><span>La forma en L organiza el espacio, pero por sí sola <b>no garantiza ahorro de agua ni mayor rendimiento.</b></span></div></div>
        <div className="hero-art prototype-art"><div className="art-topline"><span><i /> GALERÍA DEL PROYECTO</span><span>01 / VISUALIZACIÓN</span></div><ProjectCarousel /><div className="art-foot"><span><Icon name="leaf" size={16}/> Imágenes conceptuales · no son fotos documentales</span><span>By Ingenio Pantera</span></div></div>
        <div className="hero-signature">By Ingenio Pantera <span>· Proyecto educativo</span></div>
      </section>

      <section className="intro-strip"><div className="section-wrap strip-inner"><div className="strip-title"><span className="mini-label">UNA CAMPAÑA PARA APRENDER HACIENDO</span><h2>La curiosidad también<br />se cultiva.</h2></div><p>Ingenio Pantera acerca ciencia, tecnología y aprendizaje práctico. Esta primera versión explica principios, permite explorar lecturas de muestra y ayuda a planear ensayos. <strong>No representa una instalación medida ni una recomendación agronómica para una parcela específica.</strong></p><div className="strip-stat"><b>01</b><span>Prototipo educativo<br />en evolución</span></div></div></section>

      <section className="section-wrap section-pad" id="sistema"><div className="section-heading"><div><span className="mini-label">01 · CONOCE EL PROYECTO</span><h2>Un sistema. Muchas<br /><em>preguntas buenas.</em></h2></div><p>La hidroponía cultiva plantas sin suelo, con agua y nutrientes disponibles en una solución. El diseño concreto determina cómo circula, se airea y se controla esa solución.</p></div>
        <div className="notice-box"><span className="notice-mark"><Icon name="alert" /></span><p><b>La referencia compartida se representa aquí como ilustración conceptual, no como fotografía.</b> Muestra una torre vertical junto a una mesa/canal de cultivo, un depósito transparente con raíces y tuberías. La imagen no permite verificar materiales, funcionamiento, dimensiones ni que todos esos componentes estén instalados en el prototipo físico; hace falta un plano o documentación técnica para confirmarlos.</p></div>
        <figure className="prototype-infographic"><div className="infographic-visual"><img src="/images/Prototipo%202%20HidroTec.png" alt="Visualización conceptual del prototipo con torre vertical, mesa de cultivo y entorno desértico"/><span className="infographic-stamp">PROPUESTA VISUAL · NO ES PLANO TÉCNICO</span></div><figcaption><div className="infographic-caption"><span className="mini-label">FICHA VISUAL · PROTOTIPO HIDROPÓNICO</span><h3>Una lectura general<br/>de la propuesta.</h3><p>La imagen resume visualmente la propuesta compartida. Es conceptual: no verifica dimensiones, materiales, funcionamiento ni qué componentes están instalados.</p></div><ol className="infographic-legend"><li><span>01</span><div><b>Torre vertical</b><small>Se muestran alojamientos para plantas en varios niveles.</small></div></li><li><span>02</span><div><b>Zona de cultivo horizontal</b><small>Se representa una superficie con plantas distribuidas.</small></div></li><li><span>03</span><div><b>Depósito y raíces</b><small>La referencia deja ver un recipiente y raíces bajo la zona de cultivo.</small></div></li><li><span>04</span><div><b>Tuberías y pantallas</b><small>Elementos visibles cuya función e instrumentación están por verificar.</small></div></li></ol></figcaption></figure>
        <div className="system-grid"><article className="system-card"><div className="card-icon green"><img className="system-card-symbol" src="/images/Solucion%20nutritiva.jpg" alt="" aria-hidden="true" /></div><span className="card-index">A · RECORRIDO</span><h3>Agua y solución nutritiva</h3><p>En un circuito recirculante, una bomba podría impulsar solución hacia zonas de cultivo y un retorno la conduciría de vuelta. En un sistema abierto, el recorrido y el destino del drenaje cambian. <b>Primero hay que identificar cuál existe.</b></p><div className="dashed-flow">depósito <span>→</span> distribución <span>→</span> raíces <span>→</span> retorno <small>(solo si el diseño recircula)</small></div></article><article className="system-card"><div className="card-icon blue"><img className="system-card-symbol" src="/images/Observacion%20ecologica.png" alt="" aria-hidden="true" /></div><span className="card-index">B · OBSERVACIÓN</span><h3>Medir para decidir</h3><p>pH, conductividad y temperatura requieren instrumentos adecuados y calibración. El nivel del depósito o el caudal también necesitan sensores o registros; si no existen, la lectura correcta es <b>“Sensor no conectado”.</b></p><div className="card-link" onClick={() => jump('dashboard')}>Ir al dashboard <Icon name="arrow" size={16} /></div></article><article className="system-card"><div className="card-icon amber"><img className="system-card-symbol" src="/images/Simbolo%20Entorno.png" alt="" aria-hidden="true" /></div><span className="card-index">C · CUIDADO</span><h3>Un entorno que cambia</h3><p>Radiación, temperatura, viento y calidad de agua varían entre localidades. Un sitio protegido puede ayudar, pero invernadero, sombreo y climatización tienen costos, necesidades de mantenimiento y consumo energético.</p><div className="card-link" onClick={() => jump('region')}>Explorar contexto regional <Icon name="arrow" size={16} /></div></article></div>
      </section>

      <section className="dashboard-section" id="dashboard"><div className="section-wrap section-pad"><div className="section-heading dash-heading"><div><span className="mini-label">02 · CENTRO DE MONITOREO</span><h2>Datos para observar.<br /><em>No para adivinar.</em></h2></div><p>Cada variable necesita un sensor o un registro que la sustente. Elige el modo para distinguir claramente una demostración de una conexión real.</p></div>
        <div className="dashboard-shell"><div className="dash-top"><div><div className="dash-title"><span className="live-dot"/><h3>Condiciones de cultivo</h3></div><p>Última actualización: {mode === 'demo' ? '07 oct 2026 · 10:42' : 'Sin lecturas recibidas'}</p></div><div className="mode-control" aria-label="Modo de dashboard"><button className={mode === 'demo' ? 'active' : ''} onClick={() => setMode('demo')}>Demostración</button><button className={mode === 'connected' ? 'active' : ''} onClick={() => setMode('connected')}>Conectado</button></div></div>
          {mode === 'demo' ? <div className="demo-banner"><span className="demo-pulse"/> MODO DEMOSTRACIÓN <span>Todos los valores y la gráfica de este panel son simulados. No provienen de sensores.</span></div> : <div className="connected-banner"><span><Icon name="alert" size={17}/></span><b>Sensor no conectado</b><span>Esta versión no tiene una API de sensores configurada. No se mostrarán lecturas inventadas.</span></div>}
          <div className="metric-grid">{demoReadings.map((item) => <article className={'metric-card ' + (mode === 'connected' ? 'unavailable' : '')} key={item.label}><div className="metric-head"><span>{item.label}</span><span className="metric-icon"><Icon name={item.icon} size={18}/></span></div><div className="metric-value">{mode === 'demo' ? item.value : '—'} <small>{item.unit}</small></div><div className="metric-meta"><span className={mode === 'demo' ? 'status-ok' : 'status-off'}><i/>{mode === 'demo' ? 'Simulado' : 'Sin conexión'}</span><span>{item.origin}</span></div><div className="metric-time">{mode === 'demo' ? item.time : 'Esperando integración'}</div></article>)}</div>
          <div className="dash-lower"><div className="chart-panel"><div className="chart-head"><div><h4>Tendencia de muestra</h4><p>{mode === 'demo' ? 'Serie ilustrativa · no corresponde a una medición' : 'Sin datos para graficar'}</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Periodo de la gráfica"><option>24 horas</option><option>7 días</option><option>30 días</option></select></div><div className="chart-area"><div className="y-labels"><span>alto</span><span>medio</span><span>bajo</span></div><div className="chart-grid"><div className="grid-line one"/><div className="grid-line two"/><div className="grid-line three"/><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={mode === 'demo' ? 'Gráfica de tendencia de datos simulados' : 'Sin datos'}><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#43866f" stopOpacity=".18"/><stop offset="100%" stopColor="#43866f" stopOpacity="0"/></linearGradient></defs>{mode === 'demo' && <><polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#chartFill)"/><polyline points={chartPoints} fill="none" stroke="#397962" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></>}</svg>{mode === 'connected' && <div className="chart-empty">Las lecturas aparecerán cuando se integre una fuente de datos.</div>}<div className="x-labels"><span>Inicio</span><span>Medio</span><span>Ahora</span></div></div></div><div className="chart-legend"><span><i/> Valor ilustrativo</span><span>Periodo: {period}</span></div></div>
            <div className="other-sensors"><h4>Otras variables</h4><p>Preparadas para integrar. El dato no se sustituye si falta un sensor.</p>{['Temperatura ambiental · °C', 'Nivel del depósito · %', 'Agua añadida / consumida · L', 'Caudal de circulación · L/min', 'Estado de bomba', 'Consumo eléctrico · kWh'].map((item) => <div className="sensor-row" key={item}><span>{item}</span><b>{mode === 'demo' ? 'Sin dato' : 'Sensor no conectado'}</b></div>)}<small>{mode === 'demo' ? 'No hay datos simulados para estas variables.' : 'No se detecta ninguna fuente conectada.'}</small></div></div>
          <div className="api-footnote"><Icon name="check" size={17}/><span>Sin botones de control físico: esta página no activa bombas ni dosifica nutrientes. Consulta el esquema de API incluido en la documentación para una integración futura.</span></div>
        </div>
      </div></section>

      <section className="section-wrap section-pad" id="ph"><div className="ph-layout"><div className="ph-visual"><span className="mini-label">MEDICIÓN CON CRITERIO</span><div className="ph-scale"><div className="ph-number">pH</div><div className="scale-row"><span>Ácido</span><div className="scale-gradient"/><span>Alcalino</span></div><div className="ph-caution"><Icon name="alert" size={17}/> No es una lectura del sistema</div></div><span className="visual-caption">Concepto didáctico · no es escala de medición</span></div><div className="ph-copy"><span className="mini-label">03 · CÓMO MEDIR pH</span><h2>Una lectura útil<br />empieza con <em>calibración.</em></h2><p>El pH describe acidez o alcalinidad y afecta la disponibilidad de nutrientes. Debe medirse directamente con una sonda y medidor compatibles; no se deduce de una foto, el nivel de agua ni la conductividad eléctrica.</p><ol className="steps compact"><li><span>01</span><div><b>Calibra</b><p>Usa soluciones patrón y el procedimiento indicado por el fabricante. Registra fecha y resultado de calibración.</p></div></li><li><span>02</span><div><b>Enjuaga y conserva</b><p>Limpia la sonda según su manual y guárdala en la solución recomendada. No permitas que se seque si el fabricante lo prohíbe.</p></div></li><li><span>03</span><div><b>Contrasta anomalías</b><p>La temperatura puede afectar la respuesta del electrodo. Revisa compensación, conexión, calibración y repite la medición si el dato parece extraño.</p></div></li></ol><div className="ec-note"><b>pH ≠ conductividad.</b> La conductividad eléctrica estima la capacidad de la solución para conducir corriente; no identifica cuánto hay de cada nutriente. Rangos de cultivo: pendientes de fuentes específicas y verificadas.</div></div></div></section>

      <section className="crops-section" id="cultivos"><div className="section-wrap section-pad"><div className="section-heading"><div><span className="mini-label">04 · EXPLORA CULTIVOS</span><h2>Empieza con la planta.<br /><em>Diseña alrededor.</em></h2></div><p>Fichas introductorias para decidir qué investigar. Parámetros numéricos y tiempos concretos requieren guía validada por variedad y condiciones.</p></div><div className="crop-explorer"><div className="crop-list"><div className="filter-row"><span>CATÁLOGO</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Todos</option><option>Hoja</option><option>Aromática</option></select></div>{visibleCrops.map((crop) => <button className={'crop-option ' + (crop.name === selectedCrop ? 'selected' : '')} key={crop.name} onClick={() => setSelectedCrop(crop.name)}><img className="crop-list-symbol" src={crop.symbol} alt="" aria-hidden="true"/><span>{crop.name}</span><span className="difficulty">{crop.difficulty}</span><Icon name="arrow" size={17}/></button>)}</div><article className="crop-detail"><div className="crop-detail-top"><span className="crop-badge"><Icon name="leaf" size={16}/> {currentCrop.category} · {currentCrop.difficulty}</span><span className="crop-symbol"><img className="crop-detail-symbol" src={currentCrop.symbol} alt={`Símbolo de ${currentCrop.name}`} /></span></div><h3>{currentCrop.name}</h3><p className="latin">{currentCrop.scientific}</p><p className="crop-desc">{currentCrop.description}</p><div className="crop-facts"><div><span>LUZ</span><p>{currentCrop.light}</p></div><div><span>CLIMA</span><p>{currentCrop.climate}</p></div><div><span>pH / CONDUCTIVIDAD</span><p>{currentCrop.ph}<br/>{currentCrop.ec}</p></div><div><span>ESPACIO / COSECHA</span><p>{currentCrop.space}<br/>{currentCrop.harvest}</p></div></div><div className="care-note"><b>Cuidados a observar</b><p>{currentCrop.care}</p></div><div className="source-pending">Los rangos orientativos, luz cuantificada y referencias por variedad están pendientes de verificación científica antes de publicar recomendaciones numéricas.</div></article></div>
        <section className="compatibility-section" aria-labelledby="compatibility-title">
          <div className="compatibility-heading"><span className="mini-label">COMPARACIÓN Y DISEÑO DE ENSAYOS</span><h3 id="compatibility-title">¿Qué plantas podemos cultivar juntas?</h3><p>Podemos cultivar distintas especies en una misma instalación hidropónica. Para compartir un depósito, deben tener necesidades compatibles de nutrición, temperatura, iluminación y espacio. Si la torre y la sección de raíz flotante retornan el agua al mismo tanque, ambas reciben la misma solución nutritiva.</p></div>
          <div className="pairing-grid">{cropPairings.map((pairing) => <article className="pairing-card" key={pairing.plants.join('-')}><div className="pairing-plants">{pairing.plants.map((name) => { const crop = crops.find((item) => item.name === name); return <span className="pairing-plant" key={name}>{crop && <img src={crop.symbol} alt="" aria-hidden="true"/>}{name}</span> })}</div><span className="pairing-assessment">{pairing.assessment}</span><p>{pairing.detail}</p></article>)}</div>
          <div className="compatibility-caveat"><Icon name="alert" size={18}/><p><b>Propuestas para evaluar; no compatibilidad demostrada en nuestro prototipo.</b> Compartir un espacio no equivale a compartir condiciones óptimas.</p></div>
          <div className="compatibility-subsection"><div className="subsection-heading"><span className="mini-label">REFERENCIA DE NUTRICIÓN</span><h4>pH y conductividad eléctrica</h4><p>Rangos orientativos publicados por Oklahoma State University. Para cilantro y acelga: <b>Rangos no incluidos en la tabla consultada. Pendientes de una referencia específica.</b></p></div><div className="nutrient-grid">{nutrientRanges.map((range) => <article className="nutrient-card" key={range.crop}><h5>{range.crop}</h5><div><span>pH orientativo</span><b>{range.ph}</b></div><div><span>CE orientativa</span><b>{range.ec}</b></div></article>)}</div><div className="ec-explanation"><b>CE no equivale a nutrientes individuales.</b> La conductividad eléctrica —CE— indica la concentración global de sales disueltas; no mide individualmente cada nutriente. La coincidencia de rangos de pH y CE es un criterio inicial, pero no demuestra por sí sola la compatibilidad. También influyen la variedad, la etapa de crecimiento, la composición nutritiva y el ambiente.</div><a className="inline-source" href="https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics" target="_blank" rel="noreferrer">Fuente de los rangos: Oklahoma State University · Electrical Conductivity and pH Guide for Hydroponics <Icon name="arrow" size={15}/></a></div>
          <div className="compatibility-subsection prototype-plan"><div className="subsection-heading"><span className="mini-label">PROPUESTA DE VALIDACIÓN</span><h4>Aplicación en nuestro prototipo</h4><p>Plan inicial para probar por etapas; no es un resultado comprobado.</p></div><ol className="validation-plan"><li><span>01</span><p>Comenzar la sección de raíz flotante con lechuga.</p></li><li><span>02</span><p>Evaluar posteriormente una combinación con acelga joven.</p></li><li><span>03</span><p>Seleccionar cilantro o albahaca para la torre según las condiciones ambientales y realizar una prueba de adaptación.</p></li><li><span>04</span><p>Probar la espinaca por separado antes de incorporarla al circuito principal.</p></li></ol><div className="independent-tanks"><Icon name="water" size={18}/><p>Si se necesitan soluciones nutritivas diferentes, utilizar depósitos y retornos independientes. <b>Separar físicamente las plantas no separa el agua.</b></p></div></div>
          <div className="compatibility-subsection experiment-panel"><div className="subsection-heading"><span className="mini-label">PROTOCOLO DE PRUEBA</span><h4>Cómo comprobar una combinación</h4><p>Registrar pH, CE, temperatura de la solución, agua añadida, crecimiento, peso cosechado y problemas radiculares. Comparar las plantas cultivadas juntas con plantas de las mismas variedades cultivadas por separado, bajo condiciones comparables.</p></div><div className="experiment-record"><Icon name="chart" size={20}/><div><b>Sin resultados experimentales registrados</b><span>Esta plataforma aún no presenta datos de ensayos comparativos del prototipo.</span></div></div></div>
          <div className="compatibility-subsection references-panel"><div className="subsection-heading"><span className="mini-label">LECTURAS PARA CONSULTAR</span><h4>Fuentes y qué respaldan</h4></div><div className="compatibility-references">{compatibilitySources.map((source) => <a key={source.institution} href={source.url} target="_blank" rel="noreferrer"><span className="reference-institution">{source.institution}</span><b>{source.title}</b><small>{source.supports}</small><Icon name="arrow" size={16}/></a>)}</div></div>
        </section>
      </div></section>

      <section className="section-wrap section-pad" id="guia"><div className="section-heading"><div><span className="mini-label">05 · GUÍA DE CULTIVO</span><h2>Un buen ciclo<br /><em>se prepara.</em></h2></div><p>Orden de trabajo para un prototipo educativo. Ajusta cada paso al diseño real, al manual del fabricante y a una guía de cultivo específica.</p></div><div className="guide-grid"><ol className="steps">{[
        ['Elige el sitio', 'Observa horas y calidad de luz, ventilación, exposición al viento y acceso seguro a agua y energía.'], ['Revisa antes de llenar', 'Comprueba limpieza, estabilidad, conexiones y fugas. Confirma el material y la función de cada pieza.'], ['Prepara la solución', 'Sigue una guía específica y las instrucciones de etiqueta. No mezcles concentrados incompatibles ni uses una dosis universal.'], ['Trasplanta con cuidado', 'Coloca plántulas sanas con un soporte apropiado que no estrangule el tallo ni oculte raíces.'], ['Verifica circulación y oxígeno', 'Confirma el recorrido real y que las raíces reciban oxígeno según el diseño; no asumas que hay una bomba o aireador.'], ['Mide y registra', 'Anota hora, unidad, instrumento, calibración, origen y condición del cultivo. Marca claramente datos manuales y lecturas simuladas.'], ['Mantén, cosecha y limpia', 'Revisa fugas y raíces; registra agua añadida y descartada; limpia entre ciclos y gestiona la solución agotada responsablemente.'],
        ].map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{title}</b><p>{body}</p></div></li>)}</ol><aside className="safety-card"><div className="safety-icon"><Icon name="alert" size={22}/></div><span className="mini-label">SEGURIDAD PRIMERO</span><h3>Agua y electricidad<br />requieren distancia.</h3><p>Evita conexiones, extensiones y contactos donde puedan mojarse. Usa equipos aptos para el ambiente, protección eléctrica y una instalación revisada por una persona calificada. Desconecta de forma segura antes de limpiar o intervenir.</p><div className="safety-line"/><b>No manipules equipo energizado con manos mojadas.</b></aside></div></section>

      <section className="calculator-section" id="agua"><div className="section-wrap section-pad"><div className="section-heading"><div><span className="mini-label">06 · AGUA Y RESULTADOS</span><h2>Medir consumo.<br /><em>No prometer porcentajes.</em></h2></div><p>El caudal recirculado puede pasar varias veces por el mismo circuito. No equivale al agua nueva consumida. Compara el agua incorporada durante el mismo periodo.</p></div><div className="water-layout"><div className="calc-card"><div className="calc-card-header"><span className="calc-icon"><Icon name="water"/></span><div><b>Calculadora de consumo específico</b><small>Compara el mismo cultivo y condiciones comparables.</small></div></div><div className="calc-columns"><div><label className="input-group-label">SISTEMA HIDROPÓNICO</label><label>Agua utilizada (L)<input type="number" min="0" step="any" value={hydroWater} onChange={(e) => setHydroWater(e.target.value)} placeholder="Ej. 120"/></label><label>Cosecha comercializable (kg)<input type="number" min="0" step="any" value={hydroKg} onChange={(e) => setHydroKg(e.target.value)} placeholder="Ej. 8"/></label></div><div><label className="input-group-label">CULTIVO DE REFERENCIA</label><label>Agua utilizada (L)<input type="number" min="0" step="any" value={refWater} onChange={(e) => setRefWater(e.target.value)} placeholder="Ej. 220"/></label><label>Cosecha comercializable (kg)<input type="number" min="0" step="any" value={refKg} onChange={(e) => setRefKg(e.target.value)} placeholder="Ej. 8"/></label></div></div><div className="period-row"><label>Periodo evaluado<input type="text" value={evaluationPeriod} onChange={(event) => setEvaluationPeriod(event.target.value)} placeholder="Ej. 1 ciclo · fecha inicio–fin"/></label><button className="button primary" onClick={() => setCalcUsed(true)}>Calcular <Icon name="arrow" size={16}/></button></div>{calculator && <div className="calc-result" role="status">{calculator.valid ? <><div><span>Hidroponía</span><b>{calculator.hSpecific.toFixed(2)} L/kg</b></div><div><span>Referencia</span><b>{calculator.rSpecific.toFixed(2)} L/kg</b></div><div className="saving-result"><span>Ahorro relativo estimado</span><b>{calculator.saving.toFixed(1)}%</b></div><small>{calculator.saving < 0 ? 'Resultado negativo: el sistema hidropónico usó más litros por kg en estos datos.' : 'Resultado calculado con los valores ingresados; no es un resultado medido del proyecto.'}</small></> : <p><b>Información insuficiente.</b> Introduce agua y kg cosechados mayores que cero para ambos sistemas. Revisa también que las unidades y el periodo coincidan.</p>}</div>}<div className="boundary-note"><b>Límite del cálculo:</b> incluye reposición, cambios de solución, limpieza y fugas dentro de un perímetro de medición declarado. No confundas el caudal del circuito con litros de reposición. Define m² como superficie total ocupada por el sistema (incluye pasillos si aplica) antes de calcular kg/m².</div></div><div className="metrics-aside"><span className="mini-label">OTRAS MÉTRICAS ÚTILES</span><h3>Evalúa más de<br />una dimensión.</h3>{['kg comercializables / m² / ciclo', 'kWh / kg cosechado', 'Costo operativo / kg', 'Porcentaje de plantas perdidas', 'Volumen de descarga nutritiva', 'Tiempo de mantenimiento'].map((metric, i) => <div className="metric-line" key={metric}><span>0{i + 1}</span>{metric}</div>)}<p>Ventajas posibles: control del aporte de agua y nutrientes, y uso de espacios no aptos para suelo. Límites: inversión, electricidad, destreza técnica y manejo responsable de solución y materiales. El balance depende del contexto.</p></div></div></div></section>

      <section className="section-wrap section-pad" id="region"><div className="region-card"><div className="region-copy"><span className="mini-label">07 · CONTEXTO REGIONAL</span><h2>El noroeste no es<br /><em>un solo clima.</em></h2><p>Chihuahua tiene contrastes entre altiplano, sierra y desierto; Sonora combina zonas áridas y costeras; Sinaloa presenta condiciones cálidas y agrícolas diversas; Baja California y Baja California Sur también varían entre costa, valles y desierto. Planifica con datos de localidad, no con un promedio regional.</p><div className="region-tags"><span>Calor y radiación</span><span>Heladas localizadas</span><span>Calidad del agua</span><span>Protección según sitio</span></div></div><div className="region-roadmap"><span className="mini-label">RUTA DE MEJORA</span>{[['01', 'Prototipo educativo', 'Identificar materiales y diseño real.'], ['02', 'Prueba piloto', 'Registrar agua, energía, clima y cosecha.'], ['03', 'Evaluación técnica y económica', 'Comparar con una referencia equivalente.'], ['04', 'Ampliar con evidencia', 'Decidir según datos y necesidades locales.']].map(([n, title, desc]) => <div className="road-step" key={n}><span>{n}</span><div><b>{title}</b><small>{desc}</small></div></div>)}<div className="region-disclaimer">Beneficios aquí descritos son posibilidades a evaluar, no resultados medidos del equipo ni promesas de ahorro.</div></div></div><div className="sustainability"><div><span className="mini-label">DISEÑAR PARA SOSTENER</span><h3>Recircular es una oportunidad.<br />Gestionar bien es el trabajo.</h3></div><div className="sustain-items"><p><b>Agua y nutrientes</b> · evitar fugas, medir reposición y planear manejo de solución agotada conforme a reglas locales.</p><p><b>Materiales y energía</b> · considerar duración, reparación y consumo de bomba o climatización. Solar puede ser opción tras dimensionar carga, almacenamiento y costo.</p><p><b>Inocuidad</b> · mantener limpieza y buenas prácticas. Hidroponía no significa automáticamente orgánico, sin pesticidas o sin impacto ambiental.</p></div></div></section>

      <section className="native-section"><div className="section-wrap section-pad"><div className="section-heading"><div><span className="mini-label">08 · BIODIVERSIDAD REGIONAL</span><h2>Nativas: cuidar su lugar,<br /><em>primero investigar.</em></h2></div><p>No se recomienda trasladar plantas silvestres a canales de cultivo. El material vegetal debe proceder de fuentes autorizadas y la condición nativa se verifica por especie y localidad.</p></div><div className="native-grid"><article><span className="native-number">A</span><h3>Evidencia hidropónica</h3><p>La plataforma aún no incluye especies nativas con evidencia de cultivo hidropónico verificada. No se fuerza una recomendación.</p><span className="native-status">Pendiente de investigación</span></article><article><span className="native-number">B</span><h3>Requiere pruebas</h3><p>Antes de proponer especies nativas para producción, confirmar distribución, condición nativa y ensayos publicados. Distinguir nombre científico y procedencia del material.</p><span className="native-status">No recomendadas aún</span></article><article><span className="native-number">C</span><h3>Jardines y conservación</h3><p>Las especies adaptadas a suelos y sequía pueden ser valiosas en jardines regionales o conservación, aunque no sean apropiadas para un circuito hidropónico.</p><span className="native-status">Usar fuentes autorizadas</span></article></div></div></section>

      <section className="sources-section" id="recursos"><div className="section-wrap section-pad"><div className="sources-head"><div><span className="mini-label">09 · TRANSPARENCIA</span><h2>Aprender con fuentes.<br /><em>Medir con honestidad.</em></h2></div><p>Las recomendaciones técnicas por cultivo están señaladas como pendientes cuando no se ha validado una fuente específica. Referencias institucionales para comenzar la investigación local.</p></div><div className="source-list"><a href="https://www.gob.mx/conagua" target="_blank" rel="noreferrer"><span>01</span><div><b>CONAGUA</b><small>Disponibilidad, calidad y gestión del agua · confirmar datos por cuenca y localidad.</small></div><Icon name="arrow" size={17}/></a><a href="https://www.inegi.org.mx/" target="_blank" rel="noreferrer"><span>02</span><div><b>INEGI</b><small>Información geográfica y estadística para contextualizar la localidad.</small></div><Icon name="arrow" size={17}/></a><a href="https://www.conabio.gob.mx/" target="_blank" rel="noreferrer"><span>03</span><div><b>CONABIO · EncicloVida</b><small>Verificar nombres, distribución y condición nativa de especies.</small></div><Icon name="arrow" size={17}/></a><a href="https://www.gob.mx/inifap" target="_blank" rel="noreferrer"><span>04</span><div><b>INIFAP</b><small>Consultar investigación y recomendaciones agrícolas regionales disponibles.</small></div><Icon name="arrow" size={17}/></a></div><div className="consulted">Consulta de enlaces: 7 de octubre de 2026. Enlaces institucionales de entrada; afirmaciones locales y rangos de cultivo requieren consulta puntual y referencias bibliográficas que aún están pendientes. Ningún sensor, ensayo, instalación o alianza se presenta como confirmado.</div></div></section>

      <section className="preorder-section" id="preventa"><div className="section-wrap section-pad"><div className="section-heading"><div><span className="mini-label">10 · INTERÉS DE PREVENTA</span><h2>¿Te gustaría conocer<br /><em>el prototipo?</em></h2></div><p>Registra tu interés para ayudar a orientar los siguientes pasos del proyecto. Esto no es una compra, reserva, cotización ni compromiso de entrega.</p></div><div className="preorder-grid"><aside className="preorder-info"><span className="preorder-mark"><Icon name="leaf" size={22}/></span><h3>Una etapa de exploración</h3><p>La imagen presenta una propuesta visual del prototipo. Precio final: {PRICE_LABEL}. Especificaciones finales, materiales, disponibilidad y fechas todavía no están confirmados.</p><ul><li>Sin pago ni anticipo.</li><li>Sin obligación de compra.</li><li>El registro sirve solo como demostración en este sitio.</li></ul><div className="price-tag"><span>Precio final</span><b>{PRICE_LABEL}</b></div><button type="button" className="button primary" onClick={openPurchase} disabled={!isRegistered}>¿Ya decidiste comprar? Simular compra <Icon name="arrow" size={16}/></button>{!isRegistered && <p className="register-first">🔒 Regístrate primero en el formulario de interés para habilitar la compra.</p>}<div className="local-data-note"><Icon name="alert" size={17}/><span>Los datos se guardan únicamente en este navegador y dispositivo; no se envían al equipo del proyecto. Evita registrar datos en un dispositivo compartido.</span></div></aside><form className="preorder-form" onSubmit={registerPreSale}><div className="form-heading"><b>Formulario de interés</b><span>Campos con * son obligatorios</span></div><label>Nombre *<input name="name" type="text" autoComplete="name" maxLength={80} required placeholder="Tu nombre"/></label><label>Correo electrónico *<input name="email" type="email" autoComplete="email" maxLength={160} required placeholder="tu@correo.com"/></label><div className="form-row"><label>Localidad *<select name="location" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Chihuahua</option><option>Sonora</option><option>Sinaloa</option><option>Baja California</option><option>Baja California Sur</option><option>Otra localidad</option></select></label><label>¿Qué te interesa? *<select name="interest" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Conocer el prototipo</option><option>Uso educativo</option><option>Uso en hogar</option><option>Uso productivo</option><option>Recibir información futura</option></select></label></div><label className="consent-check"><input type="checkbox" required/><span>Entiendo que esto solo registra interés en este dispositivo: no se envía al equipo ni representa pedido, pago o reserva.</span></label><button className="button primary preorder-submit" type="submit">Guardar interés en este dispositivo <Icon name="arrow" size={16}/></button>{preSaleMessage && <p className="preorder-status" role="status">{preSaleMessage}</p>}<div className="saved-records"><span>Registros guardados en este navegador: <b>{preSaleEntries.length}</b></span>{(preSaleEntries.length > 0 || loadOrders().length > 0) && <button type="button" onClick={downloadControl}>Descargar control (Excel)</button>}{preSaleEntries.length > 0 && <button type="button" onClick={clearPreSaleEntries}>Eliminar mis registros</button>}</div></form></div></div></section>

      <section className="faq-section" id="preguntas"><div className="section-wrap section-pad"><div className="section-heading"><div><span className="mini-label">11 · PREGUNTAS FRECUENTES</span><h2>Lo que sabemos.<br /><em>Lo que falta validar.</em></h2></div><p>Respuestas transparentes sobre la propuesta del prototipo y el proceso de interés.</p></div><div className="faq-list"><details><summary>¿Qué representa la imagen del prototipo?</summary><p>Es una ilustración conceptual basada en la referencia que compartiste. Muestra una torre vertical, una mesa de cultivo, un depósito con raíces y tuberías. No sustituye una foto, plano o ficha técnica del equipo construido.</p></details><details><summary>¿Ya está confirmado cómo funciona el sistema?</summary><p>No. La ilustración no confirma técnica de cultivo, recorrido hidráulico, materiales, dimensiones, capacidad, sensores ni componentes instalados. Esos datos se deben documentar antes de presentar especificaciones.</p></details><details><summary>¿El registro de preventa aparta una unidad?</summary><p>No. Por ahora registra únicamente interés en el navegador donde lo envías. No llega al equipo, no aparta una unidad y no genera pago ni compromiso de compra.</p></details><details><summary>¿Cuánto costará y cuándo estará disponible?</summary><p>El precio final es de {PRICE_LABEL}. La disponibilidad, las condiciones de venta y una posible fecha no están definidas en esta versión. En este sitio no se solicitan anticipos ni datos de pago.</p></details><details><summary>¿Qué pasa con los datos del formulario?</summary><p>En esta demostración, nombre, correo, localidad y motivo de interés se guardan en el almacenamiento local de este navegador. No se transmiten a un servidor; puedes eliminarlos desde el mismo formulario. Para una preventa real hace falta configurar backend, aviso de privacidad, consentimiento y un canal de contacto gestionado por el proyecto.</p></details><details><summary>¿Los datos del dashboard pertenecen al prototipo?</summary><p>No. El modo demostración está claramente etiquetado y contiene datos ficticios para enseñar la interfaz. En modo conectado se muestra “Sensor no conectado” hasta que exista una integración real.</p></details></div></div></section>

      <section className="connect-section" id="contacto"><div className="section-wrap connect-inner"><div><span className="mini-label">CANALES OFICIALES</span><h2>Contáctanos<br /><em>Ingenio Pantera.</em></h2><p>Escríbenos o síguenos en nuestros canales del proyecto.</p></div><div className="social-grid">{Object.entries(socialLinks).filter(([, url]) => url.trim()).map(([name, url]) => <a key={name} href={name === 'Correo' && !url.startsWith('mailto:') ? `mailto:${url}` : url} target="_blank" rel="noreferrer">{name === 'Instagram' && <InstagramLogo />}{name === 'WhatsApp' && <WhatsAppLogo />}{name}</a>)}{Object.values(socialLinks).every((url) => !url.trim()) && <p className="social-empty">Redes y correo aún no configurados. Los enlaces vacíos permanecen ocultos; agrega tus cuentas en src/config/socialLinks.ts.</p>}</div></div></section>
    </main>

    {simOpen && <PurchaseSimulation onClose={() => setSimOpen(false)} />}
    <footer className="footer"><div className="section-wrap footer-main"><a className="brand footer-brand" href="#inicio" aria-label="HidroTec, inicio"><img className="brand-logo" src="/images/Logo%20de%20Hidrotecnm.png" alt="Logo HidroTec, Raíces Flotantes" /><span>Hidro<span>Tec</span><small>APRENDER A CULTIVAR</small></span></a><p>Una primera versión educativa.<br/>Los datos simulados siempre se identifican como tales.</p><div className="footer-social">{Object.entries(socialLinks).filter(([, url]) => url.trim()).map(([name, url]) => <a key={name} href={name === 'Correo' && !url.startsWith('mailto:') ? `mailto:${url}` : url} target="_blank" rel="noreferrer">{name === 'Instagram' && <InstagramLogo size={16} />}{name === 'WhatsApp' && <WhatsAppLogo size={16} />}{name}</a>)}</div></div><div className="section-wrap footer-bottom"><span>© 2026 · Contenido educativo sujeto a verificación técnica.</span><b>By Ingenio Pantera</b><button onClick={() => jump('inicio')}>Volver arriba ↑</button></div></footer>
  </>
}

export default App
