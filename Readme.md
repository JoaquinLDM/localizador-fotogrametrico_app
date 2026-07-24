# Localizador Fotogramétrico

App web instalable (PWA) para localizar un punto en el campo por triangulación, combinando GPS, brújula del móvil y fotografías como evidencia.

## Qué hace

- **Cámara en vivo**: captura GPS + azimut (rumbo compensado por inclinación, no solo brújula plana) al disparar, con cruz filar y zoom (óptico si el hardware lo soporta, digital si no).
- **Galería**: importa fotos ya existentes, lee su GPS del EXIF y, si existe, también su dirección de brújula (`GPSImgDirection`). Si no existe, permite marcar el punto exacto sobre la imagen y corrige el azimut según el desplazamiento respecto al centro óptico (usando el campo de visión estimado del EXIF).
- **Triangulación**: con 2 o más tomas, calcula el punto de intersección por mínimos cuadrados y lo muestra en un mapa (Leaflet + OpenStreetMap).
- **Histórico**: cada punto calculado se guarda de forma persistente junto con las fotos de las tomas que lo generaron.

## Instalación como app

1. Publica esta carpeta con GitHub Pages (Settings → Pages → Branch: main).
2. Abre la URL resultante (`.../localizador-fotogrametrico.html`) en Chrome para Android.
3. Acepta los permisos de cámara y ubicación.
4. Menú de Chrome (⋮) → **Instalar aplicación** (o el banner que aparece solo).

No requiere servidor propio ni Termux: al estar en HTTPS real, Chrome trata el origen como seguro y todas las APIs (cámara, geolocalización, orientación) funcionan sin configuración adicional.

## Precisión — limitaciones a tener en cuenta

- El azimut viene del sensor de orientación del móvil, no de una brújula óptica. Es razonable esperar varios metros de error, más cuanto más lejos esté el objetivo.
- El azimut es magnético, sin corrección de declinación.
- Con fotos de galería sin `GPSImgDirection`, el rumbo introducido a mano es una estimación, no una medición — trátalo como orientativo.
- Recomendado: mínimo 3 tomas desde ángulos bien separados (nunca casi en línea recta) para que el error de una toma puntual no arrastre todo el resultado.

## Almacenamiento

Las tomas y el histórico de resultados se guardan en `localStorage`, local al navegador/dispositivo. No hay sincronización entre dispositivos ni copia en la nube — si necesitas conservar resultados a largo plazo, expórtalos manualmente (captura de pantalla o anota las coordenadas) antes de borrar datos del navegador.

## Stack técnico

HTML/CSS/JS vanilla, sin build ni dependencias de npm. Librerías cargadas por CDN: [Leaflet](https://leafletjs.com/) (mapa) y [exif-js](https://github.com/exif-js/exif-js) (lectura de metadatos EXIF).
