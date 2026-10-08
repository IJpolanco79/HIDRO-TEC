# Registros y compras en una hoja privada de Google

Los registros de interés y las compras se envían a una **hoja de Google Sheets que solo ve el equipo**. Nadie más puede descargarla desde el sitio.

## Pasos (una sola vez)

1. Crea una hoja nueva en [sheets.new](https://sheets.new) con tu cuenta de Google. Ponle de nombre, por ejemplo, **Control HidroTec**. Déjala **privada** (no la compartas con "cualquier persona con el enlace").
2. En la hoja: **Extensiones → Apps Script**. Borra el código que aparece y pega el de abajo. Guarda.
3. Pulsa **Implementar → Nueva implementación → Tipo: Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**. (Esto solo permite que el sitio *envíe* datos; la hoja sigue privada.)
4. Autoriza los permisos que pide Google y copia la **URL de la aplicación web** (termina en `/exec`).
5. Pega esa URL en `src/config/backend.ts`, en `SHEETS_WEBHOOK_URL`, y sube el cambio a GitHub. Vercel lo publica solo.

## Código de Apps Script

```js
const HEADERS = {
  registro: ['Fecha', 'Nombre', 'Correo', 'Localidad', 'Interés'],
  compra: ['Folio', 'Fecha', 'Tipo de cliente', 'Nombre / Razón social', 'RFC', 'Régimen fiscal', 'Correo', 'Teléfono', 'Requiere CFDI',
    'Calle y número', 'Colonia', 'C.P.', 'Ciudad', 'Estado', 'Referencias', 'Método de pago',
    'Subtotal', 'Envío DHL', 'IVA', 'Total', 'Guía DHL', 'Estatus de seguimiento', 'Notas de seguimiento'],
};

function doPost(e) {
  const { kind, data } = JSON.parse(e.postData.contents);
  const name = kind === 'compra' ? 'Compras' : 'Registros';
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS[kind]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS[kind].length).setFontWeight('bold');
  }
  const d = data;
  const row = kind === 'compra'
    ? [d.folio, d.createdAt, d.personType, d.legalName, d.rfc, d.regimen, d.email, d.phone, d.cfdi,
       d.street, d.colonia, d.zip, d.city, d.state, d.refs, d.method,
       d.subtotal, d.shipping, d.iva, d.total, d.guide, d.status, '']
    : [d.createdAt, d.name, d.email, d.location, d.interest];
  sheet.appendRow(row);
  return ContentService.createTextOutput('ok');
}
```

## Seguimiento

En la hoja **Compras** puedes editar la columna *Estatus de seguimiento* (por ejemplo: Pedido confirmado → Preparando → Enviado → Entregado) y *Notas de seguimiento*. La hoja **Registros** sirve para saber quién mostró interés.

## Cosas a tener en cuenta

- La URL de la aplicación web queda visible en el código del sitio. Cualquiera que la encuentre podría enviar filas falsas, pero **no puede leer** la hoja.
- Al recopilar nombre, correo, RFC y dirección, publica un **aviso de privacidad** en el sitio.
- Cada vez que cambies el código de Apps Script, crea una **nueva implementación** (o gestiona la existente) para que se actualice.
