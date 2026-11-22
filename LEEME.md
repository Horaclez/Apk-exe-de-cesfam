# APS-Master CL - repositorio unificado

Un solo código fuente (`www/`) distribuido en tres formatos:

| Formato | Cómo se obtiene |
|---|---|
| PWA | Publicar el contenido de `www/` en un hosting HTTPS (p. ej. GitHub Pages) e instalar desde el navegador |
| Windows (.exe portable) | Electron + electron-builder, automático con GitHub Actions |
| Android (.apk) | Capacitor + Gradle, automático con GitHub Actions |

## Estructura
    www/                 núcleo único: index.html, platform.js, sw.js, manifest.webmanifest, icons/
    electron/main.js     envoltorio de escritorio (carga www/index.html y bloquea la red)
    capacitor.config.json  envoltorio móvil (webDir: www)
    build/icon.png       icono del .exe
    .github/workflows/build.yml  compilación automática

`www/platform.js` detecta si corre en navegador, Electron o Capacitor: el service worker solo se registra en navegador con http(s).
Use siempre rutas relativas (`./`, `icons/...`) dentro de `www/`.

## Puesta en marcha (sin instalar nada en su computador)
1. Cree un repositorio vacío en GitHub (rama `main`).
2. Suba TODO el contenido de esta carpeta, incluida la carpeta oculta `.github`
   (lo más seguro es hacerlo con git; si usa la web, cree a mano el archivo `.github/workflows/build.yml`
   con "Add file > Create new file" y pegue su contenido).
3. En GitHub: Settings > Actions > General > Workflow permissions: elija "Read and write permissions".
4. Abra la pestaña Actions: el flujo "Build" corre solo con cada push a `main`
   (o ejecútelo con "Run workflow"). Demora entre 5 y 15 minutos.
5. Descargue el .exe y el .apk desde la pestaña Releases, o desde Actions > (ejecución) > Artifacts.

Si el flujo falla, abra la ejecución, copie el mensaje de error del paso que salió en rojo y envíelo para corregirlo.

Opcional: para dejar fijas las dependencias y el proyecto Android en el repositorio, ejecute una vez en su computador
(Node.js 20 o superior) `npm install` y `npx cap add android`, y suba `package-lock.json` y `android/`.

## Probar en local
    npm start                   # abre la app de escritorio
    npm run serve               # sirve www/ en http://localhost (prueba de la PWA)

## Notas
- El APK es de depuración (instalable en equipos propios). Para Google Play se necesita keystore y firma.
- El .exe no está firmado: Windows SmartScreen mostrará una advertencia.
- Capacitor 6 se usa porque compila con Java 17 (la 7 exige Java 21).
- Al actualizar la app, cambie `V` en `www/sw.js` (v2, v3...) para que la PWA refresque su caché.
