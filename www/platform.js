(function () {
  var ua = navigator.userAgent || '';
  var isElectron = /Electron\//.test(ua);
  var isCapacitor = !!(window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === 'function' &&
    window.Capacitor.isNativePlatform());
  var isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  var plat = isElectron ? 'electron' : isCapacitor ? 'capacitor' : 'web';

  window.APS_PLATFORM = plat;
  document.documentElement.setAttribute('data-platform', plat);

  if (plat === 'web' && isHttp && 'serviceWorker' in navigator) {
    // PWA en navegador (HTTPS o localhost)
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  } else if ('serviceWorker' in navigator) {
    // Electron, Capacitor o file://: no se usa service worker; limpia restos
    try {
      navigator.serviceWorker.getRegistrations()
        .then(function (r) { r.forEach(function (x) { x.unregister(); }); })
        .catch(function () {});
    } catch (e) {}
  }
})();
