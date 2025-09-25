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