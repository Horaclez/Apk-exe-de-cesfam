(function () {
  const isElectron = navigator.userAgent.toLowerCase().includes('electron');
  const isCapacitor = Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

  window.APS_PLATFORM = {
    isElectron,
    isCapacitor,
    isWeb: !isElectron && !isCapacitor
  };

  if ('serviceWorker' in navigator && !isElectron && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
