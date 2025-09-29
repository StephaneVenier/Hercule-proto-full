
(function () {
  function initNav(scope) {
    const root = scope || document;
    const nav = root.querySelector('.nav');
    const toggle = root.querySelector('.nav-toggle');
    const links = root.getElementById ? root.getElementById('nav-links') : document.getElementById('nav-links');

    if (!nav || !toggle || !links) return;

    // Toggle open/close
    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function toggleMenu() {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => closeMenu());
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close on resize to desktop
    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      if (w !== lastW && w > 900) closeMenu();
      lastW = w;
    });
  }

  async function injectHeader() {
    const mount = document.getElementById('site-header');
    if (!mount) {
      // If there's no mount, still try to init a statically present header
      initNav(document);
      return;
    }

    const url = mount.getAttribute('data-header') || 'header-root.html';

    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      mount.innerHTML = html;
      // After injection, initialize nav within this mount
      initNav(mount);
    } catch (err) {
      console.error('[header.js] Échec du chargement du header:', err);
      // As a fallback, try to init any pre-existing nav
      initNav(document);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
