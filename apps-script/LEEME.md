# Conectar la app con el Google Sheet

1. Abre el Sheet «Onnet - Invitados y QR» → **Extensiones → Apps Script**.
2. Borra lo que haya, pega el contenido de `Code.gs` (con la clave ya puesta) y guarda.
3. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Implementar → autoriza los permisos → copia la **URL de la aplicación web** (termina en `/exec`).
4. En la app: pestaña **Datos → Conexión con Google Sheets** → pega la URL y la clave → Guardar.

Si cambias el script, hay que hacer **Implementar → Administrar implementaciones → editar → Nueva versión** (la URL se mantiene).

La clave NO va al repositorio: la copia con la clave real es `Code.local.gs` (ignorada por git).
