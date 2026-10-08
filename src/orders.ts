import writeExcelFile from 'write-excel-file/browser'

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

export const ORDERS_STORAGE_KEY = 'hidrotec-simulated-orders-v1'

export function loadOrders(): Order[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed as Order[] : []
  } catch {
    return []
  }
}

export function saveOrder(order: Order) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([...loadOrders(), order]))
  } catch {
    /* sin almacenamiento disponible */
  }
}

export function clearOrders() {
  try { localStorage.removeItem(ORDERS_STORAGE_KEY) } catch { /* nada que borrar */ }
}

const head = (value: string) => ({ value, fontWeight: 'bold' as const, backgroundColor: '#d9efe3' })
const text = (value: string) => ({ type: String, value })
const money = (value: number) => ({ type: Number, value, format: '"$"#,##0.00' })
const when = (iso: string) => new Date(iso).toLocaleString('es-MX')

export async function exportControlExcel(entries: PreSaleEntry[]) {
  const orders = loadOrders()
  const registros = [
    ['Fecha', 'Nombre', 'Correo', 'Localidad', 'Interés', 'Compró (simulación)'].map(head),
    ...entries.map((e) => [
      text(when(e.createdAt)), text(e.name), text(e.email), text(e.location), text(e.interest),
      text(orders.some((o) => o.email.toLowerCase() === e.email.toLowerCase()) ? 'Sí' : 'No'),
    ]),
  ]
  const compras = [
    ['Folio', 'Fecha', 'Tipo de cliente', 'Nombre / Razón social', 'RFC', 'Régimen fiscal', 'Correo', 'Teléfono', 'Requiere CFDI',
      'Calle y número', 'Colonia', 'C.P.', 'Ciudad', 'Estado', 'Referencias', 'Método de pago',
      'Subtotal', 'Envío DHL', 'IVA', 'Total', 'Guía DHL', 'Estatus de seguimiento', 'Notas de seguimiento'].map(head),
    ...orders.map((o) => [
      text(o.folio), text(when(o.createdAt)), text(o.personType), text(o.legalName), text(o.rfc), text(o.regimen), text(o.email), text(o.phone), text(o.cfdi),
      text(o.street), text(o.colonia), text(o.zip), text(o.city), text(o.state), text(o.refs), text(o.method),
      money(o.subtotal), money(o.shipping), money(o.iva), money(o.total), text(o.guide), text(o.status), text(''),
    ]),
  ]
  const widths = (n: number, w: number) => Array.from({ length: n }, () => ({ width: w }))
  await writeExcelFile([
    { data: registros, sheet: 'Registros', columns: widths(6, 24), stickyRowsCount: 1 },
    { data: compras, sheet: 'Compras', columns: widths(23, 22), stickyRowsCount: 1 },
  ]).toFile(`control-hidrotec-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
