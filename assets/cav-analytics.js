/* Cares & Andrade Valentim · Google Analytics 4 com consentimento (LGPD)
   O Analytics só é carregado depois que o visitante aceita os cookies. */
(function () {
  var GA_ID = 'G-41Z0PRC2TT';
  var KEY = 'cav_consent_v1';
  var loaded = false;

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (loaded) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  /* Envia um evento somente se houver consentimento */
  window.cavTrack = function (name, params) {
    if (getConsent() === 'granted' && window.gtag) window.gtag('event', name, params || {});
  };

  function banner(position) {
    var css = document.createElement('style');
    css.textContent =
      '.cav-cookie{position:fixed;left:12px;right:12px;' + (position === 'top' ? 'top:12px' : 'bottom:12px') + ';z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#141414;color:#e6e6e6;border:1px solid #333;border-radius:14px;padding:16px 18px;box-shadow:0 8px 28px rgba(0,0,0,.35);' +
      'font:400 13.5px/1.5 Montserrat,system-ui,sans-serif}' +
      '.cav-cookie a{color:#fff}' +
      '.cav-cookie .b{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}' +
      '.cav-cookie button{flex:1;min-width:120px;padding:11px 14px;border-radius:9px;font:600 13.5px Montserrat,system-ui,sans-serif;cursor:pointer}' +
      '.cav-cookie .ok{background:#fff;color:#111;border:none}' +
      '.cav-cookie .no{background:transparent;color:#ddd;border:1.5px solid #666}' +
      '@media (max-width:900px){.cav-cookie{' + (position === 'top' ? '' : 'bottom:86px') + '}}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.className = 'cav-cookie'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Aviso de cookies');
    var base = document.documentElement.getAttribute('data-cav-base') || '';
    d.innerHTML = 'Usamos cookies de medição (Google Analytics) para entender como o site é utilizado e melhorar o atendimento. ' +
      'Você pode aceitar ou recusar. <a href="' + base + 'privacidade.html">Política de Privacidade</a>.' +
      '<div class="b"><button class="no" type="button">Recusar</button><button class="ok" type="button">Aceitar</button></div>';
    document.body.appendChild(d);
    d.querySelector('.ok').onclick = function () { setConsent('granted'); d.remove(); loadGA(); };
    d.querySelector('.no').onclick = function () { setConsent('denied'); d.remove(); };
  }

  /* Cliques automáticos: WhatsApp, telefone e assistentes */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a'); if (!a) return;
    var h = a.getAttribute('href') || '';
    var where = (a.className || a.tagName).toString().slice(0, 40);
    if (h.indexOf('wa.me/') > -1) window.cavTrack('click_whatsapp', { link_location: where });
    else if (h.indexOf('tel:') === 0) window.cavTrack('click_telefone', { link_location: where });
    else if (/(^|\/)(atendimento|elvis|junior)\/?$/.test(h)) window.cavTrack('abrir_assistente', { destino: h });
  }, true);

  function init() {
    var c = getConsent();
    if (c === 'granted') loadGA();
    else if (c !== 'denied') banner(document.documentElement.getAttribute('data-cav-banner') || 'bottom');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
