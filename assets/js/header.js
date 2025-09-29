(function(){
  const host = document.getElementById('site-header');
  if(!host){ return; }
  const path = host.getAttribute('data-header');
  if(!path){ console.warn('header.js: missing data-header path'); return; }
  fetch(path, {credentials:'same-origin'})
    .then(r => r.text())
    .then(html => { host.innerHTML = html; })
    .catch(err => {
      console.error('header.js: failed to load header', err);
      host.innerHTML = '<div style="padding:8px;border:1px solid #555;border-radius:8px">Menu indisponible</div>';
    });
})();

(function () {
  // Attendre que le header soit injecté si tu le charges dynamiquement
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('nav-links');
    if (!nav || !toggle || !links) return;

    // Toggle open/close
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fermer le menu quand on clique un lien (pratique sur mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fermer si on clique en dehors (mobile)
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Fermer sur Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Si le header est chargé via fetch/innerHTML, lance initNav après insertion
  // Sinon, lance-le directement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
