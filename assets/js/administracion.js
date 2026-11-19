(() => {
  'use strict';
  // Acceso LOCAL únicamente, no seguro contra inspección del código del navegador.
  // Reemplazar por autenticación en servidor antes de usar datos personales reales.
  const sessionKey = 'iestp_utcb_atencion_admin_session';
  const store = window.IESTPRegistros;
  const loginSection = document.querySelector('#adminLogin');
  const panelSection = document.querySelector('#adminPanel');
  const loginForm = document.querySelector('#adminLoginForm');
  const loginError = document.querySelector('#adminLoginError');
  const logoutButton = document.querySelector('#adminLogout');
  const tbody = document.querySelector('#recordsBody');
  const empty = document.querySelector('#recordsEmpty');
  const count = document.querySelector('#recordsCount');
  const suggestionCount = document.querySelector('#suggestionCount');
  const complaintCount = document.querySelector('#complaintCount');
  const queryInput = document.querySelector('#recordQuery');
  const typeInput = document.querySelector('#recordType');
  const stateInput = document.querySelector('#recordState');
  const detail = document.querySelector('#recordDetail');
  const feedback = document.querySelector('#adminFeedback');
  let selectedId = null;

  function notify(text, isError=false) {
    feedback.textContent = text;
    feedback.className = 'admin-feedback' + (isError ? ' error' : '');
  }

  let serverLogged=false, csrf=null;
  function isLoggedIn(){return serverLogged;}
  function setLoggedIn(value){serverLogged=value;loginSection.hidden=value;panelSection.hidden=!value;logoutButton.hidden=!value;
    if(window.IESTPProjects)window.IESTPProjects.setSession(value,csrf);
    if(value)render();else{selectedId=null;detail.hidden=true;loginForm.reset();}}
  async function sessionApi(action,body){const r=await fetch('backend/sesion.php?action='+action,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',...(action==='logout'?{'X-CSRF-Token':csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok)throw Error(d.error||'Error de sesión');return d;}
  loginForm.addEventListener('submit',async event=>{event.preventDefault();try{const d=await sessionApi('login',{usuario:loginForm.elements.usuario.value.trim(),clave:loginForm.elements.clave.value});csrf=d.csrf;loginError.textContent='';setLoggedIn(true)}catch(e){loginError.textContent=e.message}});
  logoutButton.addEventListener('click',async()=>{try{await sessionApi('logout',{});csrf=null;setLoggedIn(false)}catch(e){notify(e.message,true)}});
  function cell(row, value, tag='td') {
    const el = document.createElement(tag);
    el.textContent = String(value ?? '');
    row.append(el);
    return el;
  }

  function recordsFiltered(records) {
    const query = (queryInput.value || '').toLocaleLowerCase('es-PE').trim();
    return records.filter(record => {
      if (typeInput.value && record.kind !== typeInput.value) return false;
      if (stateInput.value && record.state !== stateInput.value) return false;
      if (!query) return true;
      const haystack = [record.id, ...Object.values(record.data || {})].join(' ').toLocaleLowerCase('es-PE');
      return haystack.includes(query);
    });
  }

  function showDetails(id) {
    let record;
    try { record = store.load().find(r => r.id === id); }
    catch(error) { notify(error.message,true); return; }
    if (!record) { detail.hidden = true; notify('No se encontró el registro.',true); return; }
    selectedId = record.id;
    const title = detail.querySelector('#detailTitle');
    title.textContent = (record.kind === 'sugerencia' ? 'Sugerencia' : 'Reclamación') + ' · ' + record.id;
    detail.querySelector('#detailMeta').textContent = 'Fecha: ' + store.formatDate(record.createdAt);
    const data = detail.querySelector('#detailFields');
    data.replaceChildren();
    store.displayFields(record).forEach(field => {
      const block = document.createElement('div');
      block.className = 'detail-field';
      const label = document.createElement('dt');
      label.textContent = field.label;
      const value = document.createElement('dd');
      value.textContent = field.value;
      block.append(label, value);
      data.append(block);
    });
    detail.querySelector('#detailState').value = record.state;
    detail.hidden = false;
    detail.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function render() {
    if (!isLoggedIn()) return;
    try {
      const records = store.load();
      const filtered = recordsFiltered(records);
      count.textContent = String(records.length);
      suggestionCount.textContent = String(records.filter(r => r.kind === 'sugerencia').length);
      complaintCount.textContent = String(records.filter(r => r.kind === 'reclamacion').length);
      tbody.replaceChildren();
      empty.hidden = filtered.length !== 0;
      for (const rec of filtered) {
        const row = document.createElement('tr');
        cell(row,rec.id);
        cell(row,rec.kind === 'sugerencia' ? 'Sugerencia' : 'Reclamación');
        cell(row,rec.data.nombre || '—');
        cell(row,rec.kind === 'sugerencia' ? rec.data.asunto : rec.data.servicio || '—');
        cell(row,store.formatDate(rec.createdAt));
        cell(row,rec.state);
        const action = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'admin-small-button';
        button.type = 'button';
        button.textContent = 'Ver detalle';
        button.addEventListener('click', () => showDetails(rec.id));
        action.append(button);
        row.append(action);
        tbody.append(row);
      }
      if (selectedId && !records.find(r => r.id === selectedId)) {
        selectedId = null;
        detail.hidden = true;
      }
    } catch(error) { notify(error.message,true); }
  }

  [queryInput,typeInput,stateInput].forEach(el => el.addEventListener(el === queryInput ? 'input' : 'change', render));
  detail.querySelector('#closeDetail').addEventListener('click',()=>{ detail.hidden = true; selectedId = null; });
  detail.querySelector('#saveState').addEventListener('click',() => {
    if (!selectedId) return;
    try { store.updateState(selectedId,detail.querySelector('#detailState').value); notify('Estado actualizado correctamente.'); render(); }
    catch(error) { notify(error.message,true); }
  });
  detail.querySelector('#deleteRecord').addEventListener('click',() => {
    if (!selectedId || !window.confirm('¿Eliminar este registro guardado en este navegador? Esta acción no se puede deshacer.')) return;
    try { store.remove(selectedId); selectedId = null; detail.hidden = true; notify('Registro eliminado.'); render(); }
    catch(error) { notify(error.message,true); }
  });
  document.querySelector('#exportRecords').addEventListener('click',() => {
    try {
      const records = store.load();
      if (!records.length) { notify('Todavía no hay registros para exportar.'); return; }
      const columns = ['id','tipo','fecha','estado','nombre','correo','asunto_area','descripcion','documento','telefono','direccion','pedido'];
      const safe = value => {
        let text = String(value ?? '').replace(/\r?\n/g,' ');
        // Prevent spreadsheet formula injection in user-supplied fields.
        if (/^[\s]*[=+@\-]/.test(text)) text = "'" + text;
        return '"' + text.replace(/"/g,'""') + '"';
      };
      const lines = [columns.join(';')];
      records.forEach(r=>{
        const data=r.data || {};
        const values=[r.id,r.kind,store.formatDate(r.createdAt),r.state,data.nombre,data.correo,r.kind==='sugerencia'?data.asunto:data.servicio,data.descripcion,data.documento,data.telefono,data.direccion,data.pedido];
        lines.push(values.map(safe).join(';'));
      });
      const blob = new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url; a.download='registros-atencion-'+new Date().toISOString().slice(0,10)+'.csv';
      document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      notify('Archivo CSV descargado. Consérvalo de manera privada.');
    } catch(error) {notify(error.message,true);}
  });
  window.addEventListener('storage',render);
  sessionApi('status').then(d=>{csrf=d.csrf;setLoggedIn(d.logged)}).catch(()=>setLoggedIn(false));
})();
