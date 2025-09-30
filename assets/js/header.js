
(function () {
  // Inline fallback HTML if fetch fails
  const FALLBACK_HEADER_HTML = `<nav class="nav" role="navigation" aria-label="Navigation principale">
  <div class="row">
    <div class="brand">
      <img src="/assets/img/logo-hercule.jpg" alt="" aria-hidden="true" style="height:36px;vertical-align:middle;border-radius:6px;margin-right:8px">
      Hercule <span class="accent">Project</span>
    </div>
    <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-links">
      <span class="bar" aria-hidden="true"></span>
      <span class="bar" aria-hidden="true"></span>
      <span class="bar" aria-hidden="true"></span>
    </button>
    <div class="links" id="nav-links">
      <a class="btn" href="/index.html">Accueil</a>
      <a class="btn" href="/concept.html">Concept</a>
      <a class="btn" href="/niveaux/">Niveaux</a>
      <a class="btn" href="/defis-equipes/">Défis d'équipes</a>
      <a class="btn" href="/entreprises.html">Entreprises</a>
      <a class="btn" href="/participer.html">Participer</a>
      <a class="btn" href="/faq.html">FAQ</a>
      <a class="btn" href="/voter.html">Voter</a>
      <a class="btn" href="/boutique.html">Boutique</a>
      <a class="btn primary" href="/blog.html">Blog</a>
    </div>
  </div>
</nav>`;

  function initNav(scope) {
    const root = scope || document;
    const nav = root.querySelector('.nav');
    const toggle = root.querySelector('.nav-toggle');
    const links = root.getElementById ? root.getElementById('nav-links') : document.getElementById('nav-links');
    if (!nav || !toggle || !links) return;

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (nav.classList.contains('is-open')) closeMenu(); else openMenu();
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      if (w !== lastW && w > 900) closeMenu();
      lastW = w;
    });
  }

  async function injectHeader() {
    const mount = document.getElementById('site-header');
    const explicitUrl = mount ? mount.getAttribute('data-header') : null;
    const url = explicitUrl || '/header-root.html';

    if (!mount) {
      initNav(document);
      return;
    }

    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      mount.innerHTML = html;
    } catch (err) {
      console.error('[header.js] Échec du chargement du header depuis', url, err);
      mount.innerHTML = FALLBACK_HEADER_HTML;
    }
    initNav(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
