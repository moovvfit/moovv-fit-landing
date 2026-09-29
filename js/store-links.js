// =============================================
// App store links
// Loaded on every page, before main.js, so the nav link's href is already a
// store URL by the time main.js binds smooth-scroll to a[href^="#"].
// =============================================
(function () {
  const APP_STORE_URL = 'https://apps.apple.com/in/app/moovvfit/id6793878794';
  const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=fit.moovv.app';

  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch support tells them apart.
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);

  // On phones, "download the app" goes straight to the store. Desktop keeps
  // the link to the badges section.
  if (isIOS || isAndroid) {
    document.querySelectorAll('[data-download-link]').forEach(link => {
      link.href = isIOS ? APP_STORE_URL : GOOGLE_PLAY_URL;
      link.dataset.store = isIOS ? 'app_store' : 'google_play';
    });
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-store]');
    if (link && window.posthog) {
      posthog.capture('store_click', {
        store: link.dataset.store,
        placement: link.dataset.placement
      });
    }
  });
})();
