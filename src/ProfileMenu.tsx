import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import './profile.css'

type Theme = 'light' | 'dark' | 'auto'
type Accent = 'green' | 'teal' | 'blue' | 'amber'
type Profile = { name: string; photo: string; theme: Theme; accent: Accent }

const KEY = 'hidrotec-profile-v1'
const accents: { id: Accent; label: string; main: string; soft: string }[] = [
  { id: 'green', label: 'Verde', main: '#204b3e', soft: '#397962' },
  { id: 'teal', label: 'Turquesa', main: '#17525c', soft: '#2f8794' },
  { id: 'blue', label: 'Azul', main: '#1f3f6e', soft: '#3d6aa8' },
  { id: 'amber', label: 'Ámbar', main: '#7a4a12', soft: '#b07a2c' },
]
const defaults: Profile = { name: '', photo: '', theme: 'auto', accent: 'green' }

function load(): Profile {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Profile>) }
  } catch {
    return defaults
  }
}

function applyProfile(p: Profile) {
  const root = document.documentElement
  const dark = p.theme === 'dark' || (p.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.dataset.theme = dark ? 'dark' : 'light'
  const a = accents.find((x) => x.id === p.accent) ?? accents[0]
  root.style.setProperty('--green', a.main)
  root.style.setProperty('--green2', a.soft)
}

// Reduce la foto a un cuadrado de 192 px para guardarla ligera en el navegador.
function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const size = 192
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = size
      const side = Math.min(img.width, img.height)
      canvas.getContext('2d')?.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagen no válida')) }
    img.src = url
  })
}

export function ProfileMenu() {
  const [profile, setProfile] = useState<Profile>(load)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    applyProfile(profile)
    try { localStorage.setItem(KEY, JSON.stringify(profile)) } catch { setError('No se pudo guardar tu perfil en este navegador.') }
  }, [profile])

  useEffect(() => {
    if (profile.theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyProfile(profile)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [profile])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const update = (patch: Partial<Profile>) => { setError(''); setProfile((p) => ({ ...p, ...patch })) }

  async function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Elige un archivo de imagen.'); return }
    try { update({ photo: await resizePhoto(file) }) } catch { setError('No se pudo leer esa imagen.') }
  }

  const initials = profile.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'TÚ'

  return (
    <div className="profile" ref={box}>
      <button type="button" className="profile-btn" onClick={() => setOpen(!open)} aria-haspopup="dialog" aria-expanded={open} aria-label="Mi perfil y personalización">
        {profile.photo ? <img src={profile.photo} alt="" /> : <span>{initials}</span>}
      </button>
      {open && (
        <div className="profile-panel" role="dialog" aria-label="Perfil y personalización">
          <div className="profile-head">
            <div className="profile-avatar">{profile.photo ? <img src={profile.photo} alt="Tu foto de perfil" /> : <span>{initials}</span>}</div>
            <div className="profile-photo-actions">
              <label className="profile-link">Subir foto<input type="file" accept="image/*" onChange={onPhoto} hidden /></label>
              {profile.photo && <button type="button" className="profile-link" onClick={() => update({ photo: '' })}>Quitar</button>}
            </div>
          </div>
          <label className="profile-field">Tu nombre<input value={profile.name} maxLength={40} placeholder="¿Cómo te llamamos?" onChange={(e) => update({ name: e.target.value })} /></label>

          <fieldset className="profile-group"><legend>Apariencia</legend>
            <div className="profile-seg">
              {([['light', 'Claro'], ['dark', 'Oscuro'], ['auto', 'Automático']] as const).map(([id, label]) => (
                <button key={id} type="button" className={profile.theme === id ? 'on' : ''} aria-pressed={profile.theme === id} onClick={() => update({ theme: id })}>{label}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="profile-group"><legend>Color de acento</legend>
            <div className="profile-swatches">
              {accents.map((a) => <button key={a.id} type="button" className={profile.accent === a.id ? 'on' : ''} style={{ background: a.main }} aria-label={a.label} aria-pressed={profile.accent === a.id} title={a.label} onClick={() => update({ accent: a.id })} />)}
            </div>
          </fieldset>

          {error && <p className="profile-error" role="alert">{error}</p>}
          <small className="profile-note">Tu foto y preferencias se guardan solo en este navegador; no se envían a ningún servidor.</small>
        </div>
      )}
    </div>
  )
}
