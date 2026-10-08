import { SENDS_TO_TEAM, SHEETS_WEBHOOK_URL } from './config/backend'

export type PreSaleEntry = { name: string; email: string; location: string; interest: string; createdAt: string }

export type Order = {
  folio: string
  createdAt: string
  personType: string
  legalName: string
  rfc: string
  regimen: string
  email: string
  phone: string
  cfdi: string
  street: string
  colonia: string
  zip: string
  city: string
  state: string
  refs: string
  method: string
  subtotal: number
  shipping: number
  iva: number
  total: number
  guide: string
  status: string
}

// Envía el registro a la hoja privada del equipo. Sin URL configurada no hace nada.
export function sendToTeam(kind: 'registro' | 'compra', data: PreSaleEntry | Order) {
  if (!SENDS_TO_TEAM) return
  try {
    void fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ kind, data }),
    }).catch(() => undefined)
  } catch {
    /* el envío es opcional */
  }
}
