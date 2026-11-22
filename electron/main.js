const { app, BrowserWindow, session } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();

function crear() {
  const w = new BrowserWindow({
    width: 1280, height: 860, minWidth: 380, minHeight: 600,
    title: 'APS-Master CL',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  w.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
  w.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  w.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) e.preventDefault(); });
}

app.whenReady().then(() => {
  // App 100% local: bloquea toda solicitud de red
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] },
    (d, cb) => cb({ cancel: true })
  );
  crear();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) crear(); });
});
app.on('second-instance', () => {
  const w = BrowserWindow.getAllWindows()[0];
  if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
