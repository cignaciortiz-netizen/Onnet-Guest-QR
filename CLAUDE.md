# Validador QR Onnet

Plataforma para validar QR de invitados en la puerta de un evento. Dueño: Tristan (habla español; respuestas en español, simples).

## Estado
- MVP: `index.html` (un solo archivo, sin build). Escáner por cámara, validación contra lista local, estados VÁLIDO / YA INGRESÓ / NO VÁLIDO, ingreso manual, lista con búsqueda, generador de QR de prueba, import/export CSV. Datos en `localStorage` (solo ese dispositivo).
- Correr: `./serve.ps1` → http://localhost:8080. Para usarlo en celulares hace falta HTTPS (ver "Despliegue").
- Base de datos real: **pendiente, Tristan la enviará**. Cuando llegue: mirar columnas, elegir cuál es el código del QR, decidir si se importa por CSV o se conecta a backend.

## Flujo del evento (definido 2026-11-23)
~200 invitados. Google Sheet **«Onnet - Invitados y QR»** (id `1vigh3d1aJbi5s5JP0HUUM3ggyOKtsI-lbc59GNHE65o`, pestaña `Invitados`, 250 filas con código aleatorio `ONN-XXXXXXXX` ya generado).
Columnas: Código | Nombre | Email | Tipo | QR (imagen) | Enlace de imagen QR | HTML para correo.
1. Tristan llena Nombre/Email/Tipo → el QR y el enlace se generan solos (quickchart.io/qr con el código; solo el código sale a ese servicio, no datos personales).
2. Otra persona envía los correos (mail merge usando «HTML para correo» o el enlace de imagen).
3. En la puerta (modo en línea, el normal): la app habla con el Sheet vía Apps Script (`apps-script/Code.gs`, ver `LEEME.md`). Cada escaneo valida y escribe `Estado` = Validado y `Hora ingreso` en el Sheet (columnas H e I; por defecto `Inactivo`). Segundo escaneo → «YA INGRESADO … a las HH:MM». Bloqueo (LockService) evita doble ingreso entre varios porteros.
   Modo sin conexión (respaldo): Sheet → Descargar CSV → pestaña Datos → Importar.
- La clave del script va en `apps-script/Code.local.gs` (ignorado por git). El repo solo tiene `Code.gs` con marcador. La URL y la clave se escriben en la app (se guardan en el dispositivo).
- Un código cuyo Nombre está vacío cuenta como NO VÁLIDO (no se asignó a nadie).
- La hoja está en locale es_CL: las fórmulas por API van con `;` y funciones en español (`SI`).
- `IMAGE` pide «Permitir acceso» la primera vez que se abre la hoja.
- Los QR codifican solo el código (no PII). No se re-generan: los códigos son valores fijos, no fórmulas.

## Reglas del dominio
- El QR puede contener texto plano, URL (`?code=`/`?id=`/último segmento) o JSON (`code`/`id`). Ver `extractCode()`.
- Cada código se acepta UNA vez; el segundo escaneo muestra «YA INGRESÓ» con hora.
- Debounce de 3.5 s para no duplicar lecturas del mismo QR.
- Resultado debe ser legible desde lejos: pantalla completa verde/ámbar/rojo + sonido + vibración.

## Camino de evolución (de más simple a más robusto)
1. **Hoy**: un dispositivo, CSV. Cero costo.
2. **Varios porteros a la vez**: backend compartido (Supabase está conectado como MCP) con tabla `guests(code unique, name, type, checked_at, checked_by)`. Check-in atómico: `update ... set checked_at=now() where code=$1 and checked_at is null returning *` (evita doble ingreso entre dispositivos).
3. **Offline-first**: PWA + cola de sincronización si el venue tiene mala señal.
4. **Seguridad de QR**: si los QR se pueden fotografiar/copiar, firmar el código (HMAC) o usar tokens no adivinables.

## Despliegue
Opciones simples: Netlify/Vercel/GitHub Pages (HTTPS gratis) o Artifact de claude.ai. Pedir confirmación a Tristan antes de publicar con datos reales de invitados (son datos personales).

## Convenciones
- Sin dependencias de build. Librerías por CDN con versión fija (html5-qrcode 2.3.8, qrcode-generator 1.4.4).
- No subir listas reales de invitados a servicios externos sin permiso.
- Skill del proyecto: `.claude/skills/validador-qr/SKILL.md`.
