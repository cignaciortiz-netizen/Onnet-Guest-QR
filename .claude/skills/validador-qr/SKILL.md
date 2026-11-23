---
name: validador-qr
description: Trabajar en el validador de QR de invitados de Onnet — importar la base de datos de invitados, mapear la columna del código, ajustar la validación, conectar un backend o publicar la app. Úsala cuando se hable de QR, invitados, check-in, lista de acceso o la base de datos del evento.
---

# Validador QR Onnet

## Cuándo usar
Cualquier cambio o tarea sobre `index.html` del validador, o cuando Tristan entregue la base de datos de invitados.

## Flujo cuando llega la base de datos
1. Leer el archivo (CSV/XLSX/Sheets). Listar columnas y contar filas, duplicados de código y vacíos. **No copiar datos personales a servicios externos.**
2. Preguntar (solo si no es obvio) cuál columna es el código que lleva el QR y qué muestra el QR (texto, URL o JSON).
3. Probar importándola en la pestaña Datos; si falla el mapeo, ajustar `parseCSV` / `extractCode` en `index.html`.
4. Si hay varios porteros → pasar al plan 2 de CLAUDE.md (Supabase, check-in atómico).

## Reglas de validación (no romper)
- Un código solo ingresa una vez; repetido → «YA INGRESÓ» con hora.
- Comparación sin distinguir mayúsculas ni espacios en extremos.
- Estados: verde VÁLIDO, ámbar YA INGRESÓ/VARIOS, rojo NO VÁLIDO.

## Verificación antes de entregar
- Servir con `serve.ps1`, cargar datos de prueba, generar un QR desde la lista y comprobar: primer escaneo válido, segundo «ya ingresó», código inventado «no válido».
- Revisar en viewport móvil (375px).

## Cierre de cada trabajo
Responder en español empezando con bloque **Novedades** (qué cambió, con números) y, si aplica, **Necesito de ti**.
