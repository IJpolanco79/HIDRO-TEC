import { type FormEvent, useEffect, useRef, useState } from 'react'
import { sendToTeam } from './orders'
import { SENDS_TO_TEAM } from './config/backend'
import { mexicoStateNames, mexicoStates } from './data/mexico'
import { PURCHASE_URL } from './config/purchase'

const PRICE = 15375
const IVA_RATE = 0.16
const SHIPPING_RATE = 350 // DHL, tarifa única nacional (+ IVA); en Chihuahua ya va incluido en el precio
const FREE_STATE = 'Chihuahua'
const DHL_TRACKING = 'https://www.dhl.com/mx-es/home/tracking.html?tracking-id='
const money = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

type Step = 'customer' | 'shipping' | 'payment' | 'processing' | 'done'
type Method = 'visa' | 'mastercard' | 'amex' | 'debit' | 'transfer' | 'paypal'
type Person = 'fisica' | 'moral'

const methods: { id: Method; label: string; hint: string }[] = [
  { id: 'visa', label: 'Visa', hint: 'Tarjeta de crédito' },
  { id: 'mastercard', label: 'Mastercard', hint: 'Tarjeta de crédito' },
  { id: 'amex', label: 'American Express', hint: 'Tarjeta de crédito' },
  { id: 'debit', label: 'Tarjeta de débito', hint: 'Visa / Mastercard' },
  { id: 'transfer', label: 'Transferencia SPEI', hint: 'Transferencia bancaria' },
  { id: 'paypal', label: 'PayPal', hint: 'Cuenta PayPal' },
]
const cardMethods: Method[] = ['visa', 'mastercard', 'amex', 'debit']
// Números de prueba publicados; la simulación nunca recibe tarjetas reales.
const demoCard: Record<string, string> = { visa: '4242 4242 4242 4242', mastercard: '5555 5555 5555 4444', amex: '3782 822463 10005', debit: '4000 0566 5566 5556' }
const steps: Step[] = ['customer', 'shipping', 'payment']
const stepLabels = ['Datos', 'Envío', 'Pago']

export function PurchaseSimulation({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('customer')
  const [orderId, setOrderId] = useState('')
  const [person, setPerson] = useState<Person>('fisica')
  const [method, setMethod] = useState<Method>('visa')
  const [buyer, setBuyer] = useState('')
  const [guide, setGuide] = useState('')
  const answers = useRef<Record<string, string>>({})
  const [state, setState] = useState('')
  const shipsFree = state === FREE_STATE
  const SHIPPING = shipsFree ? 0 : SHIPPING_RATE
  const subtotal = PRICE + SHIPPING
  const iva = subtotal * IVA_RATE
  const total = subtotal + iva
  const methodInfo = methods.find((m) => m.id === method)!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && step !== 'processing' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, step])

  useEffect(() => {
    if (step !== 'processing') return
    const timer = window.setTimeout(() => {
      const folio = `SIM-${Math.floor(100000 + Math.random() * 900000)}`
      const newGuide = String(Math.floor(1000000000 + Math.random() * 9000000000))
      const a = answers.current
      setOrderId(folio)
      setGuide(newGuide)
      sendToTeam('compra', {
        folio, createdAt: new Date().toISOString(), personType: person === 'fisica' ? 'Persona física' : 'Persona moral',
        legalName: a.legalName ?? '', rfc: (a.rfc ?? '').toUpperCase(), regimen: a.regimen ?? '', email: a.email ?? '', phone: a.phone ?? '',
        cfdi: a.cfdi ? 'Sí' : 'No', street: a.street ?? '', colonia: a.colonia ?? '', zip: a.zip ?? '', city: a.city ?? '', state: a.state ?? '', refs: a.refs ?? '',
        method: methodInfo.label, subtotal, shipping: SHIPPING, iva, total, guide: shipsFree ? '' : newGuide, status: 'Pedido confirmado',
      })
      setStep('done')
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [step])

  const next = (to: Step) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    form.forEach((v, k) => { if (typeof v === 'string') answers.current[k] = v.trim() })
    if (step === 'customer') setBuyer(String(new FormData(e.currentTarget).get('legalName') ?? ''))
    setStep(to)
  }

  const summary = (
    <div className="sim-lines">
      <div><span>Sistema hidropónico HidroTec × 1</span><b>{money(PRICE)}</b></div>
      {!shipsFree && <div><span>Envío DHL</span><b>{money(SHIPPING)}</b></div>}
      <div><span>IVA (16%)</span><b>{money(iva)}</b></div>
      <div className="sim-total"><span>Total</span><b>{money(total)}</b></div>
    </div>
  )

  return (
    <div className="sim-backdrop" role="dialog" aria-modal="true" aria-labelledby="sim-title" onClick={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}>
      <div className="sim-modal">
        <div className="sim-banner">{SENDS_TO_TEAM ? 'SIMULACIÓN · No se realiza ningún cobro. Tus datos se envían al equipo de HidroTec para darte seguimiento.' : 'SIMULACIÓN · No se realiza ningún cobro ni se guardan ni envían datos. Usa datos ficticios.'}</div>
        <h3 id="sim-title">{step === 'done' ? '¡Gracias por tu compra!' : step === 'processing' ? 'Procesando pago…' : 'Compra de HidroTec'}</h3>

        {steps.includes(step) && (
          <ol className="sim-steps">{stepLabels.map((l, i) => <li key={l} className={i === steps.indexOf(step) ? 'on' : i < steps.indexOf(step) ? 'past' : ''}>{i + 1}. {l}</li>)}</ol>
        )}

        {step === 'customer' && (
          <form className="sim-form" onSubmit={next('shipping')}>
            <div className="sim-toggle" role="radiogroup" aria-label="Tipo de cliente">
              <label className={person === 'fisica' ? 'on' : ''}><input type="radio" name="person" checked={person === 'fisica'} onChange={() => setPerson('fisica')} />Persona física</label>
              <label className={person === 'moral' ? 'on' : ''}><input type="radio" name="person" checked={person === 'moral'} onChange={() => setPerson('moral')} />Empresa (persona moral)</label>
            </div>
            <label>{person === 'fisica' ? 'Nombre completo *' : 'Razón social *'}<input name="legalName" required maxLength={120} placeholder={person === 'fisica' ? 'Nombre ficticio' : 'Empresa Ejemplo S.A. de C.V.'} /></label>
            <label>RFC *<input name="rfc" required maxLength={13} minLength={12} placeholder={person === 'fisica' ? 'XAXX010101000' : 'XEXX010101000'} style={{ textTransform: 'uppercase' }} /></label>
            <label>Régimen fiscal *<select name="regimen" required defaultValue=""><option value="" disabled>Selecciona una opción</option>{person === 'fisica' ? <><optgroup label="Personas físicas"><option>Personas físicas con actividad empresarial y profesional</option><option>RESICO persona física</option><option>Sin obligaciones fiscales</option></optgroup><optgroup label="Personas morales"><option>General de ley personas morales</option><option>RESICO persona moral</option><option>Personas morales con fines no lucrativos</option><option>Régimen agrícola, ganadero, silvícola y pesquero</option></optgroup></> : <><optgroup label="Personas morales"><option>General de ley personas morales</option><option>RESICO persona moral</option><option>Personas morales con fines no lucrativos</option><option>Régimen agrícola, ganadero, silvícola y pesquero</option></optgroup><optgroup label="Personas físicas"><option>Personas físicas con actividad empresarial y profesional</option><option>RESICO persona física</option><option>Sin obligaciones fiscales</option></optgroup></>}</select></label>
            <div className="sim-row"><label>Correo *<input name="email" type="email" required maxLength={160} placeholder="correo@ejemplo.com" /></label><label>Teléfono *<input name="phone" type="tel" required maxLength={20} placeholder="614 000 0000" /></label></div>
            <label className="sim-check"><input type="checkbox" name="cfdi" /><span>Requiero factura (CFDI)</span></label>
            <div className="sim-actions"><button type="button" className="button" onClick={onClose}>Cancelar</button><button className="button primary" type="submit">Continuar al envío</button></div>
          </form>
        )}

        {step === 'shipping' && (
          <form className="sim-form" onSubmit={next('payment')}>
            <p className="sim-ship-note">{!state ? <><b>Envío a todo el país:</b> en Chihuahua el envío ya va incluido en el precio; para el resto del país el costo del envío corre por cuenta del cliente.</> : shipsFree ? <><b>Envío incluido:</b> en Chihuahua el envío ya va incluido en el precio del sistema.</> : <><b>Envío a {state}:</b> el costo del envío nacional corre por cuenta del cliente y no está incluido en el precio del sistema.</>}</p>
            {state && !shipsFree && (<div className="sim-carrier"><span className="sim-dhl">DHL</span><div><b>Paquetería DHL · tarifa nacional</b><small>Rastreo incluido</small></div><b>{money(SHIPPING_RATE)} + IVA</b></div>)}
            <label>Calle y número *<input name="street" required maxLength={120} placeholder="Calle Ejemplo 123" /></label>
            <div className="sim-row"><label>Colonia *<input name="colonia" required maxLength={80} /></label><label>Código postal *<input name="zip" required pattern="[0-9]{5}" inputMode="numeric" maxLength={5} placeholder="31000" /></label></div>
            <div className="sim-row"><label>Ciudad / municipio *<input name="city" required maxLength={80} list="sim-cities" placeholder={state ? 'Elige o escribe tu ciudad' : 'Primero elige el estado'} autoComplete="off" /><datalist id="sim-cities">{(mexicoStates[state] ?? []).map((c) => <option key={c} value={c} />)}</datalist></label><label>Estado *<select name="state" required value={state} onChange={(e) => setState(e.target.value)}><option value="" disabled>Selecciona</option>{mexicoStateNames.map((s) => <option key={s}>{s}</option>)}</select></label></div>
            <label>Referencias de entrega<input name="refs" maxLength={160} placeholder="Entre calles, portón, horario…" /></label>
            <div className="sim-actions"><button type="button" className="button" onClick={() => setStep('customer')}>Atrás</button><button className="button primary" type="submit">Continuar al pago</button></div>
          </form>
        )}

        {step === 'payment' && (
          <form className="sim-form" onSubmit={next('processing')}>
            <fieldset className="sim-methods"><legend>Método de pago</legend>
              {methods.map((m) => <label key={m.id} className={method === m.id ? 'on' : ''}><input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} /><b>{m.label}</b><small>{m.hint}</small></label>)}
            </fieldset>
            {cardMethods.includes(method) && (
              <div className="sim-card">
                <label>Número de tarjeta<input value={demoCard[method]} readOnly aria-readonly="true" /></label>
                <div className="sim-row"><label>Vencimiento<input value="12/30" readOnly /></label><label>CVV<input value="•••" readOnly /></label></div>
                <small>Tarjeta de prueba prellenada: en esta simulación nunca se escribe una tarjeta real.</small>
              </div>
            )}
            {method === 'transfer' && <p className="sim-note">En una compra real recibirías una CLABE para transferir por SPEI. Aquí no se genera ninguna CLABE.</p>}
            {method === 'paypal' && <p className="sim-note">En una compra real serías redirigido a PayPal. Aquí no se abre ninguna sesión.</p>}
            {summary}
            <div className="sim-actions"><button type="button" className="button" onClick={() => setStep('shipping')}>Atrás</button><button className="button primary" type="submit">Pagar {money(total)} (simulado)</button></div>
          </form>
        )}

        {step === 'processing' && <div className="sim-processing"><span className="sim-spinner" aria-hidden="true" /><p className="sim-note">Validando datos y procesando el pago simulado…</p></div>}

        {step === 'done' && (
          <>
            <p className="sim-note">{buyer ? <>Gracias, <b>{buyer}</b>. </> : null}Tu pedido simulado fue registrado con el folio <b>{orderId}</b>. Pago con <b>{methodInfo.label}</b> por <b>{money(total)}</b>. {shipsFree ? 'El envío va incluido en tu compra.' : 'El envío DHL ($350 + IVA) corre por cuenta del cliente.'} Te avisaríamos por correo cuando tu sistema salga a envío.</p>
            {!shipsFree && <div className="sim-track">
              <b>Rastreo de paquete · DHL</b>
              <span>Guía simulada: <code>{guide}</code></span>
              <ol>
                <li className="done">Pedido confirmado</li>
                <li className="done">Paquete preparado por Ingenio Pantera</li>
                <li>Recolección por DHL</li>
                <li>En tránsito</li>
                <li>Entregado</li>
              </ol>
              <a className="button" href={DHL_TRACKING + guide} target="_blank" rel="noreferrer">Rastrear en DHL</a>
              <small>La guía es de demostración; en DHL aparecerá como no encontrada. En una compra real recibirías tu guía verdadera.</small>
            </div>}
            <p className="sim-note">{SENDS_TO_TEAM ? 'No se cobró nada; el equipo recibió tus datos para darte seguimiento.' : 'Esto fue solo una demostración: no se cobró nada ni se guardó ninguna información.'} Para comprar de verdad, continúa en nuestra página web.</p>
            <div className="sim-actions"><button type="button" className="button" onClick={onClose}>Cerrar</button><a className="button primary" href={PURCHASE_URL} target="_blank" rel="noreferrer">Ir a la página web de compra</a></div>
          </>
        )}
      </div>
    </div>
  )
}
