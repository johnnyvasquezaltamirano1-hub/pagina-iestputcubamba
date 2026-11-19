(function () {
  'use strict';
  const viewport = document.getElementById('megaViewport');
  const triggers = [...document.querySelectorAll('.mega-trigger')];
  const scrim = document.getElementById('menuScrim');
  const mobileToggle = document.querySelector('.utp-mobile-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const headerRow = document.querySelector('.utp-header-row');
  let activeMenu = null;

  function closeMega() {
    if (!viewport) return;
    viewport.hidden = true;
    viewport.querySelectorAll('.mega-panel').forEach(panel => panel.hidden = true);
    triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    activeMenu = null;
    if (mobileMenu?.hidden && scrim) scrim.hidden = true;
  }
  function closeMobile() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    if (!activeMenu && scrim) scrim.hidden = true;
  }
  function openMega(key) {
    closeMobile();
    activeMenu = key;
    viewport.hidden = false;
    viewport.querySelectorAll('.mega-panel').forEach(panel => panel.hidden = panel.dataset.panel !== key);
    triggers.forEach(button => button.setAttribute('aria-expanded', String(button.dataset.menu === key)));
    if (scrim) scrim.hidden = false;
  }
  triggers.forEach(button => button.addEventListener('click', () =>
    activeMenu === button.dataset.menu ? closeMega() : openMega(button.dataset.menu)
  ));
  viewport?.querySelectorAll('.mega-panel').forEach(panel => {
    const tabs = [...panel.querySelectorAll('.mega-tab')];
    tabs.forEach((tab, index) => {
      function selectTab() {
        tabs.forEach((t, i) => {
          t.classList.toggle('selected', i === index);
          t.setAttribute('aria-selected', String(i === index));
        });
        panel.querySelectorAll('.mega-view').forEach(view => view.hidden = view.dataset.view !== String(index));
      }
      tab.addEventListener('click', selectTab);
      tab.addEventListener('mouseenter', () => {
        if (matchMedia('(hover:hover)').matches) selectTab();
      });
      tab.addEventListener('keydown', event => {
        if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        tabs[next].click();
      });
    });
  });
  mobileToggle?.addEventListener('click', () => {
    const opening = mobileMenu.hidden;
    closeMega();
    mobileMenu.hidden = !opening;
    mobileToggle.setAttribute('aria-expanded', String(opening));
    mobileToggle.setAttribute('aria-label', opening ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    if (scrim) scrim.hidden = !opening;
  });
  document.querySelectorAll('.mobile-section-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const links = button.nextElementSibling;
      const opening = links.hidden;
      document.querySelectorAll('.mobile-section-trigger').forEach(other => {
        if (other !== button) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.hidden = true;
        }
      });
      button.setAttribute('aria-expanded', String(opening));
      links.hidden = !opening;
    });
  });
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobile));
  scrim?.addEventListener('click', () => {
    closeMega(); closeMobile(); scrim.hidden = true;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMega(); closeMobile(); if (scrim) scrim.hidden = true;
    }
  });
  document.addEventListener('click', event => {
    if (!headerRow?.contains(event.target) && !viewport?.contains(event.target) && !mobileMenu?.contains(event.target)) {
      closeMega(); closeMobile();
    }
  });
  window.addEventListener('resize', () => {
    if (innerWidth > 1040) closeMobile(); else closeMega();
  });

  // Use the included fallback if externally hosted institutional pictures are unavailable.
  document.querySelectorAll('img[src^="https://iestputcubamba.edu.pe/"]').forEach(image => {
    image.addEventListener('error', () => {
      if (image.dataset.fallback) return;
      image.dataset.fallback = '1';
      image.src = 'assets/img/fallback.svg';
    });
  });

  // This is a static academic demonstration, so email opens in the user's email app.
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const content = [
      `Nombre: ${data.get('nombre')}`,
      `Correo: ${data.get('correo')}`,
      `Programa: ${data.get('programa')}`,
      '',
      String(data.get('mensaje'))
    ].join('\n');
    const subject = `Consulta desde la propuesta web IESTP Utcubamba - ${data.get('programa')}`;
    const url = `mailto:istputcubamba@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    if (status) status.textContent = 'Se abrirá tu aplicación de correo. Revisa y envía el mensaje desde allí.';
    window.location.href = url;
  });
})();
