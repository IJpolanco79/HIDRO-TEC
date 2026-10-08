import { type FormEvent, useEffect, useState } from 'react'
import { PURCHASE_URL } from './config/purchase'

const PRICE = 15375
const IVA_RATE = 0.16
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
  const iva = PRICE * IVA_RATE
  const total = PRICE + iva
  const methodInfo = methods.find((m) => m.id === method)!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && step !== 'processing' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, step])

  useEffect(() => {
    if (step !== 'processing') return
    const timer = window.setTimeout(() => {
      setOrderId(`SIM-${Math.floor(100000 + Math.random() * 900000)}`)
      setStep('done')
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [step])

  const next = (to: Step) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step === 'customer') setBuyer(String(new FormData(e.currentTarget).get('legalName') ?? ''))
    setStep(to)
  }

  const summary = (
    <div className="sim-lines">
      <div><span>Sistema hidropónico HidroTec × 1</span><b>{money(PRICE)}</b></div>
      <div><span>IVA (16%)</span><b>{money(iva)}</b></div>
      <div className="sim-total"><span>Total</span><b>{money(total)}</b></div>
    </div>
  )

  return (
    <div className="sim-backdrop" role="dialog" aria-modal="true" aria-labelledby="sim-title" onClick={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}>
      <div className="sim-modal">
        <div className="sim-banner">SIMULACIÓN · No se realiza ningún cobro ni se guardan ni envían datos. Usa datos ficticios.</div>
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
            <label>Régimen fiscal *<select name="regimen" required defaultValue=""><option value="" disabled>Selecciona una opción</option>{person === 'fisica' ? <><option>Personas físicas con actividad empresarial</option><option>RESICO persona física</option><option>Sin obligaciones fiscales</option></> : <><option>General de ley personas morales</option><option>RESICO persona moral</option></>}</select></label>
            <div className="sim-row"><label>Correo *<input name="email" type="email" required maxLength={160} placeholder="correo@ejemplo.com" /></label><label>Teléfono *<input name="phone" type="tel" required maxLength={20} placeholder="614 000 0000" /></label></div>
            <label className="sim-check"><input type="checkbox" name="cfdi" /><span>Requiero factura (CFDI)</span></label>
            <div className="sim-actions"><button type="button" className="button" onClick={onClose}>Cancelar</button><button className="button primary" type="submit">Continuar al envío</button></div>
          </form>
        )}

        {step === 'shipping' && (
          <form className="sim-form" onSubmit={next('payment')}>
            <label>Calle y número *<input name="street" required maxLength={120} placeholder="Calle Ejemplo 123" /></label>
            <div className="sim-row"><label>Colonia *<input name="colonia" required maxLength={80} /></label><label>Código postal *<input name="zip" required pattern="[0-9]{5}" inputMode="numeric" maxLength={5} placeholder="31000" /></label></div>
            <div className="sim-row"><label>Ciudad / municipio *<input name="city" required maxLength={80} /></label><label>Estado *<select name="state" required defaultValue=""><option value="" disabled>Selecciona</option>{['Baja California', 'Baja California Sur', 'Chihuahua', 'Sinaloa', 'Sonora', 'Otro estado'].map((s) => <option key={s}>{s}</option>)}</select></label></div>
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
            <p className="sim-note">{buyer ? <>Gracias, <b>{buyer}</b>. </> : null}Tu pedido simulado fue registrado con el folio <b>{orderId}</b>. Pago con <b>{methodInfo.label}</b> por <b>{money(total)}</b>. Te avisaríamos por correo cuando tu sistema salga a envío.</p>
            <p className="sim-note">Esto fue solo una demostración: no se cobró nada ni se guardó ninguna información. Para comprar de verdad, continúa en nuestra página web.</p>
            <div className="sim-actions"><button type="button" className="button" onClick={onClose}>Cerrar</button><a className="button primary" href={PURCHASE_URL} target="_blank" rel="noreferrer">Ir a la página web de compra</a></div>
          </>
        )}
      </div>
    </div>
  )
}
