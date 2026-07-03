/* ===========================================================
   AUREUM DIGITAL STUDIO — interacciones
   =========================================================== */
(function () {
  'use strict';

  /* ===========================================================
     CONFIGURACIÓN DEL FORMULARIO
     Pega aquí tu webhook de n8n o tu endpoint de Formspree.
     Si lo dejas vacío (''), se usa el "action" del propio <form>
     (FormSubmit, que llega al Gmail).
     =========================================================== */
  const ENDPOINT_URL = '';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header: solido al hacer scroll ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Menu movil ---- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---- Contador animado de stats ---- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dec = (el.dataset.dec | 0);
    if (reduce) { el.textContent = prefix + target.toLocaleString('es-ES') + suffix; return; }
    const dur = 1600; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = prefix + val.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  }

  /* ---- Parallax suave del hero (solo desktop, no touch) ---- */
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (!reduce && !coarse) {
    const layers = document.querySelectorAll('[data-parallax]');
    if (layers.length) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          layers.forEach(l => {
            const speed = parseFloat(l.dataset.parallax) || 0.2;
            l.style.transform = `translate3d(0, ${y * speed}px, 0)`;
          });
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ---- Marcar enlace de nav activo ---- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  /* ---- Formulario: preseleccionar producto(s) según ?servicio= en la URL ---- */
  const servicioParams = new URLSearchParams(location.search).getAll('servicio');
  if (servicioParams.length) {
    // Mapa de valores antiguos/genéricos al producto concreto del formulario
    const mapa = {
      'Sitio Web': 'Web Esencial',
      'Gestión de Redes Sociales': 'RRSS Activa',
      'Automatización con IA': 'Plan Crecimiento',
      'Perfil de Google Business': 'Plan Visibilidad'
    };
    let primero = null;
    servicioParams.forEach((p) => {
      const val = mapa[p] || p;
      const target = document.querySelector(
        `input[name="Packs de interés"][value="${val.replace(/"/g, '\\"')}"]`
      );
      if (target) {
        target.checked = true;
        if (!primero) primero = target;
      }
    });
    // Lleva al usuario a la lista para que vea lo marcado y pueda añadir más
    if (primero) {
      setTimeout(() => {
        primero.closest('fieldset')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }, 150);
    }
  }

  /* ---- Formulario: campo "Otros" del sector (toggle) ---- */
  const sectorSel = document.querySelector('[data-sector]');
  const otrosWrap = document.querySelector('[data-sector-otros]');
  if (sectorSel && otrosWrap) {
    const otrosInput = otrosWrap.querySelector('input');
    const sync = () => {
      const isOtros = sectorSel.value === 'Otros';
      otrosWrap.classList.toggle('field-hidden', !isOtros);
      if (otrosInput) otrosInput.required = isOtros;
      if (!isOtros && otrosInput) otrosInput.value = '';
    };
    sectorSel.addEventListener('change', sync);
    sync();
  }

  /* ---- Formulario: envío (webhook configurable o FormSubmit) ---- */
  const form = document.querySelector('form[data-lead]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Validación nativa del navegador (required, email, checkboxes...)
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Enviando…'; }

      const fd = new FormData(form);

      // Construye un objeto agrupando los valores múltiples (checkboxes) en arrays
      const data = {};
      for (const [k, v] of fd.entries()) {
        if (data[k] !== undefined) { data[k] = [].concat(data[k], v); }
        else { data[k] = v; }
      }

      try {
        let res;
        if (ENDPOINT_URL) {
          res = await fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
        } else {
          res = await fetch(form.action, {
            method: 'POST',
            body: fd,
            headers: { Accept: 'application/json' }
          });
        }
        if (res.ok) {
          const card = form.closest('.form-card');
          const success = document.querySelector('.form-success');
          if (card) card.classList.add('sent');
          if (success) success.classList.add('show');
          else { form.reset(); if (btn) btn.innerHTML = '¡Enviado!'; }
          if (window.dataLayer) window.dataLayer.push({ event: 'lead_submitted' });
        } else {
          throw new Error('bad response');
        }
      } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
        alert('No se ha podido enviar el formulario. Escríbenos a hola@aureumdigital.studio o por WhatsApp.');
      }
    });
  }

  /* ---- Año dinamico en footer ---- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
