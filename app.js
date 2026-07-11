// ---------- utilidades ----------
function esc(str){
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slug(str){
  return String(str || 'pauta')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'pauta';
}

let seccionCounter = 0;
let ejercicioCounter = 0;

// ---------- creación de bloques de ejercicio ----------
function crearEjercicioBlock(seccionEl, datos){
  datos = datos || {};
  ejercicioCounter++;
  const wrap = document.createElement('div');
  wrap.className = 'ejercicio-block';
  wrap.innerHTML = `
    <div class="ejercicio-block-head">
      <span>Ejercicio</span>
      <button type="button" class="mini-btn btn-quitar-ejercicio">✕ quitar</button>
    </div>
    <label>Nombre del ejercicio</label>
    <input type="text" class="ej-nombre" placeholder="Couch Stretch" value="${esc(datos.nombre||'')}">
    <div class="row3">
      <div>
        <label>Series</label>
        <input type="text" class="ej-series" placeholder="2" value="${esc(datos.series||'')}">
      </div>
      <div>
        <label>Repeticiones</label>
        <input type="text" class="ej-reps" placeholder="10" value="${esc(datos.reps||'')}">
      </div>
      <div>
        <label>Unidad</label>
        <input type="text" class="ej-unidad" placeholder="por lado" value="${esc(datos.unidad||'')}">
      </div>
    </div>
    <label>Descripción / técnica</label>
    <textarea class="ej-descripcion" placeholder="Cómo ejecutar el ejercicio, puntos clave y errores a evitar.">${esc(datos.descripcion||'')}</textarea>
    <label>Link de YouTube (opcional — copia el link de "Compartir" en YouTube)</label>
    <input type="url" class="ej-link" placeholder="https://youtu.be/XXXXXXXXXXX" value="${esc(datos.link||'')}">
    <p class="hint">Si dejas el link vacío, no se mostrará el botón "Ver técnica" para este ejercicio.</p>
  `;
  wrap.querySelector('.btn-quitar-ejercicio').addEventListener('click', () => {
    wrap.remove();
    actualizarPreview();
  });
  wrap.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', actualizarPreviewDebounced);
  });
  seccionEl.querySelector('.ejercicios-container').appendChild(wrap);
}

// ---------- creación de bloques de sección ----------
function crearSeccionBlock(datos){
  datos = datos || {};
  seccionCounter++;
  const wrap = document.createElement('div');
  wrap.className = 'seccion-block';
  wrap.innerHTML = `
    <div class="seccion-block-head">
      <span>Sección</span>
      <button type="button" class="mini-btn btn-quitar-seccion">✕ quitar sección</button>
    </div>
    <label>Nombre de la sección</label>
    <input type="text" class="sec-nombre" placeholder="Movilidad / Bloque 1 / Bloque 2" value="${esc(datos.nombre||'')}">
    <label>Subtítulo (opcional)</label>
    <input type="text" class="sec-subtitulo" placeholder="Fuerza · tren inferior" value="${esc(datos.subtitulo||'')}">
    <div class="ejercicios-container"></div>
    <button type="button" class="add-btn wide btn-agregar-ejercicio">+ Agregar ejercicio a esta sección</button>
  `;
  wrap.querySelector('.btn-quitar-seccion').addEventListener('click', () => {
    wrap.remove();
    actualizarPreview();
  });
  wrap.querySelector('.btn-agregar-ejercicio').addEventListener('click', () => {
    crearEjercicioBlock(wrap, {});
    actualizarPreview();
  });
  wrap.querySelectorAll('.sec-nombre, .sec-subtitulo').forEach(inp => {
    inp.addEventListener('input', actualizarPreviewDebounced);
  });
  document.getElementById('secciones').appendChild(wrap);

  const ejercicios = datos.ejercicios && datos.ejercicios.length ? datos.ejercicios : [{}];
  ejercicios.forEach(ej => crearEjercicioBlock(wrap, ej));
}

// ---------- construcción del HTML final (mismo diseño del original) ----------
function buildBodyInner(){
  const tipoPauta = esc(document.getElementById('tipoPauta').value || '[TIPO DE PAUTA]');
  const nombrePaciente = esc(document.getElementById('nombrePaciente').value || '[NOMBRE DEL PACIENTE]');
  const mensajeIntro = esc(document.getElementById('mensajeIntro').value || '');
  const frecuencia = esc(document.getElementById('frecuencia').value || '');
  const duracion = esc(document.getElementById('duracion').value || '');
  const tiempoAprox = esc(document.getElementById('tiempoAprox').value || '');
  const porQue = esc(document.getElementById('porQue').value || '');
  const notaDescanso = esc(document.getElementById('notaDescanso').value || '');
  const numSemanas = Math.max(1, parseInt(document.getElementById('numSemanas').value, 10) || 1);
  const sesionesPorSemana = Math.max(1, parseInt(document.getElementById('sesionesPorSemana').value, 10) || 1);
  const notaImportante = esc(document.getElementById('notaImportante').value || '');
  const despedida = esc(document.getElementById('despedida').value || '');

  let seccionesHTML = '';
  document.querySelectorAll('.seccion-block').forEach(secEl => {
    const nombre = esc(secEl.querySelector('.sec-nombre').value || '');
    const subtitulo = esc(secEl.querySelector('.sec-subtitulo').value || '');
    let ejerciciosHTML = '';
    secEl.querySelectorAll('.ejercicio-block').forEach(ejEl => {
      const ejNombre = esc(ejEl.querySelector('.ej-nombre').value || '');
      const series = esc(ejEl.querySelector('.ej-series').value || '');
      const reps = esc(ejEl.querySelector('.ej-reps').value || '');
      const unidad = esc(ejEl.querySelector('.ej-unidad').value || '');
      const descripcion = esc(ejEl.querySelector('.ej-descripcion').value || '');
      const link = ejEl.querySelector('.ej-link').value.trim();

      const dosis = (series || reps) ? `${series}×${reps}` : '';
      const videoBtn = link
        ? `<a class="video-btn" href="${esc(link)}" target="_blank" rel="noopener">▶ Ver técnica</a>`
        : '';

      ejerciciosHTML += `
    <div class="ex-card">
      <div class="ex-top">
        <p class="ex-name">${ejNombre}</p>
        <div class="ex-dose"><p class="num">${dosis}</p><p class="unit">${unidad}</p></div>
      </div>
      <p class="ex-cue">${descripcion}</p>
      <div class="ex-bottom">
        ${videoBtn}
      </div>
    </div>`;
    });

    seccionesHTML += `
  <div class="section">
    <div class="section-head">
      <h2>${nombre}</h2>
      ${subtitulo ? `<span>${subtitulo}</span>` : ''}
    </div>
    ${ejerciciosHTML}
  </div>`;
  });

  let weeksHTML = '';
  for(let w=1; w<=numSemanas; w++){
    let boxesHTML = '';
    for(let s=1; s<=sesionesPorSemana; s++){
      boxesHTML += `<div class="box" onclick="this.classList.toggle('checked'); this.textContent=this.classList.contains('checked')?'✓':''">${s}</div>`;
    }
    weeksHTML += `
      <div class="week-row">
        <span class="week-label">Semana ${w}</span>
        <div class="boxes">${boxesHTML}</div>
      </div>`;
  }

  return `
  <div class="hero">
    <p class="brand"><span>STRONGER</span> AS FUCK</p>
    <h1>Pauta de<br><em>${tipoPauta}</em></h1>
    <p style="font-family:'Open Sans', sans-serif; font-weight:700; font-size:15px; letter-spacing:0.04em; color:var(--ink-dim); margin:0 0 14px; text-transform:uppercase;">${nombrePaciente}</p>
    <p class="sub">${mensajeIntro}</p>
  </div>

  <div class="info-strip">
    <div class="chip accent">
      <p class="label">Frecuencia</p>
      <p class="value">${frecuencia}</p>
    </div>
    <div class="chip">
      <p class="label">Duración</p>
      <p class="value">${duracion}</p>
    </div>
    <div class="chip">
      <p class="label">Tiempo aprox.</p>
      <p class="value">${tiempoAprox}</p>
    </div>
  </div>

  <div class="callout">
    <p class="label">Por qué haces esto</p>
    <p>${porQue}</p>
  </div>
${seccionesHTML}
  <p style="margin:18px 24px 0; font-size:13px; color:var(--ink-dim); text-align:center;">${notaDescanso}</p>

  <div class="tracker">
    <h2>Marca tus sesiones</h2>
    <p>${sesionesPorSemana} por semana, cualquier día que te acomode.</p>
    <div class="weeks">${weeksHTML}
    </div>
  </div>

  <div class="footer-note">
    <p><strong>Importante:</strong> ${notaImportante}</p>
  </div>

  <p class="signoff">${despedida}</p>

  ${LOGO_IMG_TAG}
`;
}

function buildFullHTML(){
  return PLANTILLA_HEAD + '\n<body>\n<div class="wrap">\n' + buildBodyInner() + '\n</div>\n</body>\n</html>\n';
}

// ---------- vista previa ----------
let previewTimer = null;
function actualizarPreviewDebounced(){
  clearTimeout(previewTimer);
  previewTimer = setTimeout(actualizarPreview, 250);
}
function actualizarPreview(){
  document.getElementById('previewFrame').srcdoc = buildFullHTML();
}

// ---------- descarga (funciona bien en PC; en celular puede fallar dentro de vistas embebidas) ----------
function descargarHTML(){
  const html = buildFullHTML();
  const blob = new Blob([html], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const nombrePaciente = document.getElementById('nombrePaciente').value;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pauta_' + slug(nombrePaciente) + '.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---------- ver pauta en pestaña nueva (método robusto para celular) ----------
// En vez de forzar una descarga de archivo (que en iOS/WebViews dentro de un iframe
// suele generar un archivo vacío o corrupto), abrimos una ventana/pestaña nueva y
// escribimos el HTML directamente en ella con document.write. Desde ahí, el navegador
// del celular permite usar su propio botón de "Compartir" / "Guardar en Archivos" /
// "Imprimir > Guardar como PDF", que sí funciona de forma nativa y confiable.
function verPautaNuevaPestana(){
  const html = buildFullHTML();
  const win = window.open('', '_blank');
  if(!win){
    alert('Tu navegador bloqueó la ventana emergente. Revisa la configuración de "bloqueo de ventanas emergentes" para este sitio e inténtalo de nuevo.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

// ---------- descargar como PDF (misma vista, vía librería html2pdf.js) ----------
function descargarPDF(){
  const html = buildFullHTML();
  const nombrePaciente = document.getElementById('nombrePaciente').value;

  if(typeof html2pdf === 'undefined'){
    alert('No se pudo cargar el generador de PDF (revisa tu conexión a internet e inténtalo de nuevo).');
    return;
  }

  // Renderizamos la pauta en un iframe oculto para que aplique su CSS/tipografía
  // real (html2pdf necesita un elemento del DOM ya "vivo", no solo el string).
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-99999px';
  iframe.style.top = '0';
  iframe.style.width = '660px';
  iframe.style.height = '100px';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  iframe.onload = () => {
    const target = iframe.contentDocument.querySelector('.wrap') || iframe.contentDocument.body;
    // ajustamos el alto del iframe al contenido real para que html2canvas capture todo
    iframe.style.height = target.scrollHeight + 'px';

    const opciones = {
      margin: 0,
      filename: 'Pauta_' + slug(nombrePaciente) + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#10163F', useCORS: true, windowWidth: 660 },
      jsPDF: { unit: 'px', format: [660, target.scrollHeight], orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opciones).from(target).save().then(() => {
      iframe.remove();
    }).catch((err) => {
      alert('Ocurrió un error generando el PDF: ' + err.message);
      iframe.remove();
    });
  };

  iframe.srcdoc = html;
}

// ---------- compartir nativo (WhatsApp / Mail / etc. vía Web Share API) ----------
async function compartirPauta(){
  const html = buildFullHTML();
  const nombrePaciente = document.getElementById('nombrePaciente').value;
  const filename = 'Pauta_' + slug(nombrePaciente) + '.html';
  const file = new File([html], filename, { type: 'text/html' });

  if(navigator.canShare && navigator.canShare({ files: [file] })){
    try{
      await navigator.share({
        files: [file],
        title: 'Pauta de ejercicios',
        text: 'Te comparto tu pauta de ejercicios — Stronger As Fuck.'
      });
    }catch(err){
      if(err.name !== 'AbortError'){
        alert('No se pudo compartir: ' + err.message);
      }
    }
  } else {
    alert('Compartir directo solo funciona en navegadores de celular compatibles (Chrome/Safari en Android o iOS). En PC usa "Ver pauta" o "Descargar (PC)" y adjunta el archivo manualmente.');
  }
}

// ---------- menú desplegable "Ver pauta / Compartir" ----------
const verDropdown = document.getElementById('verDropdown');
const verDropdownMenu = document.getElementById('verDropdownMenu');
document.getElementById('verBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  verDropdownMenu.hidden = !verDropdownMenu.hidden;
});
document.addEventListener('click', (e) => {
  if(!verDropdown.contains(e.target)){
    verDropdownMenu.hidden = true;
  }
});
document.getElementById('verNuevaPestanaBtn').addEventListener('click', () => {
  verDropdownMenu.hidden = true;
  verPautaNuevaPestana();
});
document.getElementById('descargarPdfBtn').addEventListener('click', () => {
  verDropdownMenu.hidden = true;
  descargarPDF();
});
document.getElementById('compartirBtn').addEventListener('click', () => {
  verDropdownMenu.hidden = true;
  compartirPauta();
});

// ---------- inicialización ----------
document.getElementById('addSeccionBtn').addEventListener('click', () => {
  crearSeccionBlock({});
  actualizarPreview();
});
document.getElementById('downloadBtn').addEventListener('click', descargarHTML);

document.querySelectorAll('#tipoPauta, #nombrePaciente, #mensajeIntro, #frecuencia, #duracion, #tiempoAprox, #porQue, #notaDescanso, #numSemanas, #sesionesPorSemana, #notaImportante, #despedida')
  .forEach(inp => inp.addEventListener('input', actualizarPreviewDebounced));

// nota importante prellenada con el texto original por defecto
document.getElementById('notaImportante').value = 'si algún ejercicio te da dolor agudo, más de 3/10 o distinto al habitual, no lo fuerces. Bájale la intensidad, o sáltalo y me cuentas.';
document.getElementById('notaDescanso').value = 'El descanso lo vas viendo tú, pero aprox. 1–2 min entre series.';

// una sección de ejemplo para partir
crearSeccionBlock({nombre:'Movilidad', ejercicios:[{}]});

actualizarPreview();
