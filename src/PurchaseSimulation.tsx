import { useEffect, useState } from 'react'
import { PURCHASE_URL } from './config/purchase'

const PRICE = 15375
const IVA_RATE = 0.16
const money = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

type Step = 'summary' | 'processing' | 'done'

export function PurchaseSimulation({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('summary')
  const [orderId, setOrderId] = useState('')
  const iva = PRICE * IVA_RATE
  const total = PRICE + iva

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
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [step])

  return (
    <div className="sim-backdrop" role="dialog" aria-modal="true" aria-labelledby="sim-title" onClick={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}>
      <div className="sim-modal">
        <div className="sim-banner">SIMULACIÓN · No se realiza ningún cobro ni se guardan datos</div>
        <h3 id="sim-title">{step === 'done' ? '¡Compra simulada completada!' : 'Resumen de tu compra'}</h3>

        {step !== 'done' && (
          <>
            <div className="sim-lines">
              <div><span>Sistema hidropónico HidroTec × 1</span><b>{money(PRICE)}</b></div>
              <div><span>IVA (16%)</span><b>{money(iva)}</b></div>
              <div className="sim-total"><span>Total</span><b>{money(total)}</b></div>
            </div>
            <p className="sim-note">Esta es una demostración del proceso de compra. No pidas ni escribas datos de tarjeta: aquí no existe ningún pago real.</p>
            <div className="sim-actions">
              <button type="button" className="button" onClick={onClose} disabled={step === 'processing'}>Cancelar</button>
              <button type="button" className="button primary" onClick={() => setStep('processing')} disabled={step === 'processing'}>
                {step === 'processing' ? 'Procesando…' : 'Confirmar compra simulada'}
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <p className="sim-note">Folio de simulación: <b>{orderId}</b>. Total simulado: <b>{money(total)}</b>. Para comprar de verdad, continúa en nuestra tienda.</p>
            <div className="sim-actions">
              <button type="button" className="button" onClick={onClose}>Cerrar</button>
              <a className="button primary" href={PURCHASE_URL} target="_blank" rel="noreferrer">Ir a la página web de compra</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
