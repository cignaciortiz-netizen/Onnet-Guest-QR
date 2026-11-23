/**
 * Onnet Guest QR - puente entre la app y el Google Sheet.
 * Se pega en el Sheet: Extensiones > Apps Script. Ver apps-script/LEEME.md
 *
 * Acciones (GET): ?action=check|list|reset&key=CLAVE&code=CODIGO
 *  - check: marca el invitado como "Validado" (una sola vez). Si ya estaba, responde "used".
 *  - list : devuelve los invitados con nombre (para la pestaña Invitados).
 *  - reset: vuelve a "Inactivo" (por si se escaneó por error).
 */
const CLAVE = 'PEGA_AQUI_TU_CLAVE'; // debe ser igual a la clave que se escribe en la app
const HOJA = 'Invitados';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.key !== CLAVE) return out_({ status: 'error', message: 'clave incorrecta' });
  try {
    if (p.action === 'list') return out_(listar_());
    if (p.action === 'check') return out_(marcar_(p.code, true));
    if (p.action === 'reset') return out_(marcar_(p.code, false));
    return out_({ status: 'error', message: 'accion desconocida' });
  } catch (err) {
    return out_({ status: 'error', message: String(err) });
  }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function hoja_() {
  const sh = SpreadsheetApp.getActive().getSheetByName(HOJA);
  if (!sh) throw new Error('No existe la pestaña ' + HOJA);
  const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (x) { return String(x).trim().toLowerCase(); });
  const f = function (n) { const i = h.indexOf(n); if (i < 0) throw new Error('Falta la columna ' + n); return i + 1; };
  return { sh: sh, c: { codigo: f('código'), nombre: f('nombre'), tipo: f('tipo'), estado: f('estado'), hora: f('hora ingreso') } };
}

function norm_(s) { return String(s || '').trim().toUpperCase(); }

function listar_() {
  const H = hoja_(), sh = H.sh, n = sh.getLastRow() - 1;
  if (n < 1) return { status: 'ok', guests: [] };
  const v = sh.getRange(2, 1, n, sh.getLastColumn()).getValues();
  const c = H.c, guests = [];
  v.forEach(function (r) {
    const code = String(r[c.codigo - 1]).trim(), nombre = String(r[c.nombre - 1]).trim();
    if (!code || !nombre) return; // códigos sin invitado asignado no cuentan
    const hora = r[c.hora - 1];
    guests.push({
      code: code, name: nombre, tipo: String(r[c.tipo - 1]).trim(),
      estado: String(r[c.estado - 1]).trim() || 'Inactivo',
      hora: hora instanceof Date ? hora.toISOString() : ''
    });
  });
  return { status: 'ok', guests: guests };
}

function marcar_(code, validar) {
  const buscado = norm_(code);
  if (!buscado) return { status: 'notfound' };
  const lock = LockService.getScriptLock();
  lock.waitLock(15000); // evita que dos porteros validen el mismo QR a la vez
  try {
    const H = hoja_(), sh = H.sh, c = H.c, n = sh.getLastRow() - 1;
    if (n < 1) return { status: 'notfound' };
    const codes = sh.getRange(2, c.codigo, n, 1).getValues();
    let fila = -1;
    for (let i = 0; i < n; i++) { if (norm_(codes[i][0]) === buscado) { fila = i + 2; break; } }
    if (fila < 0) return { status: 'notfound' };
    const nombre = String(sh.getRange(fila, c.nombre).getValue()).trim();
    if (!nombre) return { status: 'notfound' }; // código sin invitado asignado
    const tipo = String(sh.getRange(fila, c.tipo).getValue()).trim();
    const estado = String(sh.getRange(fila, c.estado).getValue()).trim().toLowerCase();
    const celdaHora = sh.getRange(fila, c.hora);
    if (!validar) {
      sh.getRange(fila, c.estado).setValue('Inactivo');
      celdaHora.clearContent();
      SpreadsheetApp.flush();
      return { status: 'ok', name: nombre, tipo: tipo };
    }
    if (estado === 'validado') {
      const h = celdaHora.getValue();
      return { status: 'used', name: nombre, tipo: tipo, hora: h instanceof Date ? h.toISOString() : '' };
    }
    const ahora = new Date();
    sh.getRange(fila, c.estado).setValue('Validado');
    celdaHora.setValue(ahora).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    SpreadsheetApp.flush();
    return { status: 'ok', name: nombre, tipo: tipo, hora: ahora.toISOString() };
  } finally {
    lock.releaseLock();
  }
}
