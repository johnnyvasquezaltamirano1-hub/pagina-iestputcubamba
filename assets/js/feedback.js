(() => {
  'use strict';
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const store = window.IESTPRegistros;
  const message = document.getElementById('feedbackMessage');
  const output = document.getElementById('feedbackOutput');
  const actions = document.getElementById('preparedActions');
  const copyButton = document.getElementById('copyFeedback');
  const printButton = document.getElementById('printFeedback');
  const mailButton = document.getElementById('mailFeedback');
  let receipt = '';
  let lastRecord = null;

  function buildReceipt(record) {
    const fields = store.displayFields(record);
    return [
      'IESTP UTCUBAMBA · REGISTRO DE ATENCIÓN',
      'Código: ' + record.id,
      'Tipo: ' + (record.kind === 'sugerencia' ? 'Sugerencia' : 'Reclamación / queja'),
      'Fecha: ' + store.formatDate(record.createdAt),
      'Estado: ' + record.state,
      '',
      ...fields.map(field => field.label + ': ' + field.value),
      '',
      'Guardado en este navegador. El envío por correo requiere una acción adicional.'
    ].join('\n');
  }

  function resetResult() {
    receipt = '';
    lastRecord = null;
    output.textContent = '';
    output.classList.remove('visible');
    actions.hidden = true;
    message.textContent = '';
    message.className = 'feedback-message';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!store) {
      message.textContent = 'No se pudo iniciar el almacenamiento de registros.';
      message.className = 'feedback-message error';
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const kind = form.dataset.kind;
    try {
      const record = store.create(kind, data);
      lastRecord = record;
      receipt = buildReceipt(record);
      output.textContent = receipt;
      output.classList.add('visible');
      actions.hidden = false;
      message.textContent = 'Registro guardado correctamente en este navegador. Código: ' + record.id + '. Puedes consultarlo desde el panel de atención local.';
      message.className = 'feedback-message success';
      form.reset();
      message.scrollIntoView({behavior:'smooth',block:'nearest'});
    } catch(error) {
      message.textContent = error.message;
      message.className = 'feedback-message error';
    }
  });

  form.addEventListener('reset', () => {
    // A reset after successful registration must not hide the receipt.
    if (!lastRecord) resetResult();
  });

  copyButton?.addEventListener('click', async () => {
    if (!receipt) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(receipt);
      else {
        const selection = document.createElement('textarea');
        selection.value = receipt;
        selection.style.position = 'fixed';
        selection.style.opacity = '0';
        document.body.append(selection);
        selection.select();
        if (!document.execCommand('copy')) throw new Error('No se pudo copiar');
        selection.remove();
      }
      message.textContent = 'Constancia copiada al portapapeles. Registro: ' + lastRecord.id;
      message.className = 'feedback-message success';
    } catch {
      message.textContent = 'Selecciona el texto de la constancia y cópialo manualmente.';
    }
  });
  printButton?.addEventListener('click', () => { if (receipt) window.print(); });
  mailButton?.addEventListener('click', () => {
    if (!receipt || !lastRecord) return;
    const title = lastRecord.kind === 'sugerencia' ? 'Sugerencia' : 'Reclamación';
    const subject = title + ' · ' + lastRecord.id;
    const url = 'mailto:istputcubamba@hotmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(receipt);
    message.textContent = 'Se abrirá tu aplicación de correo. El mensaje no se envía hasta que pulses Enviar allí.';
    window.location.href = url;
  });
})();
