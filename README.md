# Editor de Pautas — Stronger As Fuck

App web de un solo cliente (sin backend) para armar pautas de ejercicios personalizadas
y generarlas como un archivo `.html` autocontenido, listo para enviar a cada
paciente/alumno por WhatsApp, mail, etc.

## Qué hace

1. El kinesiólogo abre `index.html` en el navegador.
2. Rellena los datos generales (paciente, frecuencia, duración), agrega secciones
   (Movilidad, Bloque 1, Bloque 2...) y dentro de cada sección agrega ejercicios
   (nombre, series×reps, descripción, link de YouTube).
3. A la derecha hay una vista previa en vivo con el diseño de marca real.
4. Al terminar, genera el archivo final de dos formas:
   - **"Ver pauta / Compartir"**: abre la pauta ya renderizada en una pestaña nueva
     (método robusto en celular — usa `document.write` en vez de forzar descarga,
     porque forzar descarga de un blob dentro de un iframe/WebView en iOS suele
     generar archivos vacíos/corruptos). Desde ahí el usuario usa el botón nativo
     de Compartir/Guardar del navegador.
   - **"Descargar (PC)"**: descarga directa vía Blob + `<a download>`, pensado
     para uso en computador de escritorio.
5. El archivo resultante es un `.html` único (CSS y logo en base64 embebidos), sin
   dependencias externas: el paciente lo abre y listo.

## Estructura del proyecto

```
editor-pautas/
├── index.html                  # Markup del editor (el formulario + vista previa)
├── style.css                   # Estilos de la interfaz del editor (no de la pauta)
├── app.js                      # Lógica: crear/quitar secciones y ejercicios,
│                                # armar el HTML final, vista previa, ver/descargar
└── assets/
    ├── pauta-template.js       # const PLANTILLA_HEAD = `...`
    │                           # Head + CSS EXACTO del diseño de marca de la pauta
    │                           # (lo que se le envía al paciente). Editar SOLO
    │                           # si se quiere cambiar el diseño visual de la pauta.
    └── logo.js                 # const LOGO_IMG_TAG = `...`
                                 # Logo en base64 embebido en cada pauta generada
```

Importante: `pauta-template.js` y `logo.js` definen constantes globales (`PLANTILLA_HEAD`,
`LOGO_IMG_TAG`) que `app.js` usa para construir el archivo final. Por eso en `index.html`
se cargan en ese orden, antes que `app.js`.

## Cómo correrlo

No necesita servidor ni build: basta abrir `index.html` directo en el navegador
(doble clic, o arrastrarlo a una pestaña). Para desarrollo con recarga en vivo,
cualquier servidor estático simple sirve, ej:

```bash
npx serve .
# o
python3 -m http.server 8000
```

## Ideas para próximas mejoras (para pedirle a Claude Code)

- **Publicarla online** (GitHub Pages, Vercel o Netlify) para no depender de abrir
  un archivo local — el kinesiólogo entraría a una URL fija desde el celular.
- **Guardar pacientes/plantillas frecuentes**: hoy cada pauta se arma desde cero.
  Se podría guardar en `localStorage` (o una base de datos si se agrega backend)
  una librería de ejercicios reutilizables y pacientes ya cargados.
- **Cargar una pauta ya generada para editarla** (subir el .html y parsear sus
  datos de vuelta al formulario).
- **Exportar además a PDF** directo, sin pasar por "Imprimir > Guardar como PDF".
- **Historial de pautas enviadas** por paciente.
- Convertirla en **PWA instalable** en el celular (ícono en el home, funciona offline).
- Si el kinesiólogo quiere manejar más de un profesional/marca, agregar
  configuración de marca (nombre, colores, logo) en vez de tenerlo hardcodeado
  en `assets/logo.js` y `assets/pauta-template.js`.

## Origen

Este proyecto nació de una pauta armada a mano en HTML para un paciente puntual;
se generalizó primero a una plantilla editable y luego a esta app, para que
cualquier pauta futura salga de este mismo esquema sin tener que tocar código
cada vez.
