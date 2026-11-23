# Onnet Guest QR

Validador de QR para invitados de eventos Onnet. App web de un solo archivo (`index.html`): escanea el QR con la cámara y muestra al instante si el invitado es **válido**, **ya ingresó** o **no está en la lista**.

## Uso
1. Abre la app en el celular del portero (necesita HTTPS, ya lo da GitHub Pages).
2. Pestaña **Datos** → cargar el CSV de invitados (columnas Código, Nombre, Tipo) → Importar.
3. Pestaña **Escanear** → Iniciar cámara.

Los datos de invitados se guardan solo en el dispositivo (no se suben a GitHub).

## Desarrollo local
```powershell
.\serve.ps1   # http://localhost:8080
```

## Importante
No subir al repositorio listas reales de invitados ni CSV (el `.gitignore` los excluye).
