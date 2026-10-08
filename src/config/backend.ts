// URL de la aplicación web de Google Apps Script que guarda los registros y compras en una hoja privada.
// Pasos en docs/GOOGLE_SHEETS.md. Mientras esté vacía, los datos solo se guardan en el navegador de cada persona.
export const SHEETS_WEBHOOK_URL = ''
export const SENDS_TO_TEAM = SHEETS_WEBHOOK_URL.trim() !== ''
