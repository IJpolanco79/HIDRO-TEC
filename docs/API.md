# Esquema propuesto para lecturas de sensores

Este contrato es una **propuesta de integración**, no una API existente. La aplicación actual no llama a un servidor ni tiene dispositivo conectado.

## Petición propuesta

`GET /api/v1/readings/latest?systemId=demo-l`

Respuesta de ejemplo del contrato (valores ilustrativos de formato, no lecturas reales):

```json
{
  "systemId": "demo-l",
  "connection": "connected",
  "updatedAt": "2026-10-07T17:42:00Z",
  "readings": [
    {
      "metric": "solution_ph",
      "value": 6.1,
      "unit": "pH",
      "measuredAt": "2026-10-07T17:41:52Z",
      "source": "sensor",
      "status": "ok"
    }
  ]
}
```

## Campos recomendados

- `systemId`: identificador no secreto del sistema.
- `connection`: `connected`, `stale` o `disconnected`.
- `updatedAt`: fecha ISO 8601 UTC de actualización del paquete.
- `readings`: lecturas observadas; omitir las variables sin dato en lugar de fabricar un valor.
- `metric`: enum sugerido: `solution_ph`, `solution_ec`, `solution_temperature`, `air_temperature`, `relative_humidity`, `reservoir_level`, `water_added`, `water_consumed`, `flow_rate`, `pump_state`, `energy_consumption`.
- `value`: número medido; usar boolean/estado separado para estados discretos como bomba.
- `unit`: unidad explícita (por ejemplo, pH, mS/cm, °C, %, L, L/min, kWh).
- `measuredAt`: fecha de lectura, no la hora en que se dibujó en pantalla.
- `source`: `sensor` o `manual` y, opcionalmente, `deviceId` identificable públicamente.
- `status`: `ok`, `warning`, `error` o `calibration_due`; no determina por sí solo un rango agronómico.

## Seguridad y calidad

- Servir la API con HTTPS; validar identidad y autorización en backend.
- Nunca incluir claves privadas, credenciales Wi-Fi o secretos en el bundle del navegador.
- Validar tipos, unidades, marcas de tiempo, valores fuera de rango instrumental y lecturas repetidas.
- Definir por cultivo y con fuente aprobada los umbrales de alertas; no codificar límites universales.
- Mantener una indicación visible de conexión y antigüedad. Si faltan datos, representar “Sensor no conectado” o “Sin dato”.
- Los controles de bomba y dosificación requieren diseño de seguridad, autenticación, confirmación y pruebas aparte; están fuera de esta versión.
