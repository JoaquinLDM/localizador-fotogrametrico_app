# Localizador Fotogramétrico

App web instalable (PWA) para localizar un punto en el campo por triangulación, combinando GPS, brújula del móvil y fotografías como evidencia.

## Qué hace

- **Cámara en vivo**: captura GPS + azimut (rumbo compensado por inclinación, no solo brújula plana) al disparar, con cruz filar y zoom (óptico si el hardware lo soporta, digital si no).
- **Galería**: importa fotos ya existentes, lee su GPS del EXIF y, si existe, también su dirección de brújula (`GPSImgDirection`). Si no existe, permite marcar el punto exacto sobre la imagen y corrige el azimut según el desplazamiento respecto al centro óptico (usando el campo de visión estimado del EXIF).
- **Triangulación**: con 2 o más tomas, calcula el punto de intersección por mínimos cuadrados y lo muestra en un mapa (Leaflet + OpenStreetMap).
- **Histórico**: cada punto calculado se guarda de forma persistente junto con las fotos de las tomas que lo generaron.

## Instalación como app

1. Publica esta carpeta con GitHub Pages (Settings → Pages → Branch: main).
2. Abre la URL resultante (`.../index.html`) en Chrome para Android.
3. Acepta los permisos de cámara y ubicación.
4. Menú de Chrome (⋮) → **Instalar aplicación** (o el banner que aparece solo).

No requiere servidor propio ni Termux: al estar en HTTPS real, Chrome trata el origen como seguro y todas las APIs (cámara, geolocalización, orientación) funcionan sin configuración adicional.

## Precisión — limitaciones a tener en cuenta

- El azimut viene del sensor de orientación del móvil, no de una brújula óptica. Es razonable esperar varios metros de error, más cuanto más lejos esté el objetivo.
- El azimut es magnético, sin corrección de declinación.
- Con fotos de galería sin `GPSImgDirection`, el rumbo introducido a mano es una estimación, no una medición — trátalo como orientativo.
- Recomendado: mínimo 3 tomas desde ángulos bien separados (nunca casi en línea recta) para que el error de una toma puntual no arrastre todo el resultado.

## Dónde se guarda tu trabajo

Todo lo que capturas (tomas y resultados calculados) se guarda **automáticamente**, sin que tengas que pulsar nada, en el `localStorage` del navegador. Esto tiene implicaciones importantes que conviene entender:

- **No es una carpeta ni un archivo del teléfono.** Vive dentro del almacenamiento interno de la app de Chrome (o del navegador que uses), asociado exclusivamente a esta URL exacta (`https://tuusuario.github.io/localizador-app/`). No lo vas a encontrar navegando con un gestor de archivos — no es un `.txt`, `.db` ni nada abrible directamente.
- **Es local a ese navegador y ese dispositivo.** Si abres la misma URL desde otro móvil, otro navegador (Firefox, Samsung Internet...), o una pestaña de incógnito, no verás nada de lo guardado — cada combinación navegador+dispositivo tiene su propio almacenamiento independiente.
- **Se borra si limpias datos del navegador.** Concretamente, si en Chrome vas a Configuración → Privacidad → Borrar datos de navegación y marcas "Cookies y datos de sitios" (no solo caché), o si entras en `chrome://settings/content/all` → buscas el dominio → "Borrar y restablecer", se pierde todo lo guardado sin posibilidad de recuperarlo.
- **No hay copia en la nube ni sincronización entre dispositivos.** Es solo del navegador local.

### Cómo sacar tu trabajo de ahí, a un archivo de verdad

En la pestaña **Resultados**, cada punto calculado tiene un botón **"Exportar ⬇"**. Genera un archivo `.html` autocontenido (coordenadas + fotos + fecha, todo en un único archivo, abrible sin conexión con cualquier navegador) y lo descarga a la carpeta **Download/Descargas** estándar del teléfono — esa sí es una carpeta real, visible desde cualquier gestor de archivos, que puedes mover, compartir o respaldar como cualquier otro archivo.

**Recomendación práctica:** trata el `localStorage` como una libreta de trabajo temporal mientras estás en el campo, y usa "Exportar" en cuanto termines cada punto que quieras conservar de verdad — no confíes en el guardado automático como archivo permanente a largo plazo.

## Stack técnico

HTML/CSS/JS vanilla, sin build ni dependencias de npm. Librerías cargadas por CDN: [Leaflet](https://leafletjs.com/) (mapa) y [exif-js](https://github.com/exif-js/exif-js) (lectura de metadatos EXIF).
