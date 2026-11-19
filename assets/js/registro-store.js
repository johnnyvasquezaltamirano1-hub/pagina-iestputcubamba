/* Almacenamiento local para la versión académica sin servidor.
   IMPORTANTE: no es una base de datos ni un servicio de envío por correo.
   No usar datos personales reales ni tratarlo como control de acceso seguro. */
(() => {
  'use strict';
  const STORAGE_KEY = 'iestp_utcb_atencion_registros_v1';
  const CHANNEL = 'iestp_utcb_atencion';
  const MAX_RECORDS = 1000;
  const allowedStates = ['Nuevo', 'En revisión', 'Atendido'];

  function load() {
    let raw;
    try { raw = localStorage.getItem(STORAGE_KEY); }
    catch { throw new Error('El navegador ha bloqueado el almacenamiento local. Usa el sitio desde localhost y habilita el almacenamiento.'); }
    if (!raw) return [];
    try {
      const records = JSON.parse(raw);
      return Array.isArray(records) ? records.filter(item => item && typeof item.id === 'string') : [];
    } catch {
      throw new Error('No se pudieron leer los registros guardados.');
    }
  }

  function save(records) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
    catch { throw new Error('No se pudieron guardar los registros. Comprueba el espacio disponible y los permisos del navegador.'); }
  }

  function create(kind, payload) {
    if (!['sugerencia', 'reclamacion'].includes(kind)) throw new Error('Tipo de registro incorrecto.');
    const records = load();
    if (records.length >= MAX_RECORDS) throw new Error('El límite de registros del navegador se ha alcanzado. Exporta los registros y libera espacio.');
    const date = new Date();
    const yyyy = date.getFullYear();
    const code = (kind === 'sugerencia' ? 'SUG' : 'REC') + '-' + yyyy + '-' + String(Date.now()).slice(-8) + '-' + Math.floor(Math.random() * 900 + 100);
    const item = {
      id: code,
      kind,
      createdAt: date.toISOString(),
      state: 'Nuevo',
      data: payload && typeof payload === 'object' ? payload : {}
    };
    records.unshift(item);
    save(records);
    return item;
  }

  function updateState(id, state) {
    if (!allowedStates.includes(state)) throw new Error('Estado no reconocido.');
    const records = load();
    const item = records.find(r => r.id === id);
    if (!item) throw new Error('No se encontró el registro.');
    item.state = state;
    item.updatedAt = new Date().toISOString();
    save(records);
    return item;
  }

  function remove(id) {
    const records = load();
    const filtered = records.filter(r => r.id !== id);
    if (records.length === filtered.length) throw new Error('No se encontró el registro.');
    save(filtered);
  }

  function formatDate(input) {
    const date = new Date(input);
    return Number.isNaN(date.valueOf()) ? '—' : date.toLocaleString('es-PE', {year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
  }

  function displayFields(item) {
    const suggestions = [ ['Nombre completo','nombre'],['Correo electrónico','correo'],['Relación con la institución','relacion'],['Área de mejora','area'],['Asunto','asunto'],['Sugerencia','descripcion'] ];
    const complaints = [ ['Nombre completo','nombre'],['Tipo de documento','tipo_documento'],['Número de documento','documento'],['Correo electrónico','correo'],['Teléfono','telefono'],['Dirección','direccion'],['Vínculo con la institución','relacion'],['Tipo','tipo'],['Fecha del hecho','fecha_hecho'],['Servicio o área','servicio'],['Descripción de los hechos','descripcion'],['Solicitud','pedido'] ];
    return (item.kind === 'sugerencia' ? suggestions : complaints)
      .map(([label, key]) => ({label, value: String(item.data?.[key] || 'No indicado')}));
  }

  window.IESTPRegistros = { load, create, updateState, remove, formatDate, displayFields, allowedStates, CHANNEL };
})();
