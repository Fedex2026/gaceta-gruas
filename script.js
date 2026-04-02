const tarifas = {
  A: { banderazo: 798.02, km: 28.41, maniobraHora: 1840.78 },
  B: { banderazo: 916.85, km: 31.12, maniobraHora: 2017.65 },
  C: { banderazo: 1089.46, km: 35.43, maniobraHora: 2300.63 },
  D: { banderazo: 1337.08, km: 48.83, maniobraHora: 3172.21 }
};

const PENSION_TARIFAS = {
  bicicleta_motocicleta: 23.00,
  automovil_vagoneta: 73.57,
  camionetas_microbus: 82.76,
  camion_rabon_torton: 137.94,
  autobus_remolque_maquinaria: 160.95
};

const ESPERA_POR_HORA = 909.02;
const ABANDERAMIENTO_GRUA_POR_HORA = 909.02;
const ABANDERAMIENTO_MANUAL_POR_HORA = 76.39;
const CORRALON_COSTO = 0;

const btnAgregarGrua = document.getElementById("btnAgregarGrua");
const btnCalcular = document.getElementById("btnCalcular");
const btnWord = document.getElementById("btnWord");
const btnExcel = document.getElementById("btnExcel");

const gruasExtrasContainer = document.getElementById("gruasExtrasContainer");
const corralonSelect = document.getElementById("corralon");
const seccionCorralon = document.getElementById("seccionCorralon");
const fechaIngresoCorralon = document.getElementById("fechaIngresoCorralon");
const fechaSalidaCorralon = document.getElementById("fechaSalidaCorralon");
const diasPensionInput = document.getElementById("diasPension");
const tipoUnidadCorralon = document.getElementById("tipoUnidadCorralon");
const aplicarIVA = document.getElementById("aplicarIVA");

let contadorGruas = 0;

function money(value) {
  return "$" + Number(value || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function parseDateOnly(value) {
  if (!value) return null;

  const parts = value.split("-");
  if (parts.length !== 3) return null;

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  if (!y || !m || !d) return null;

  const fecha = new Date(y, m - 1, d, 12, 0, 0);
  return isNaN(fecha.getTime()) ? null : fecha;
}

function calcularDiasCorralon() {
  if (!fechaIngresoCorralon || !fechaSalidaCorralon || !diasPensionInput) return;

  const ingreso = parseDateOnly(fechaIngresoCorralon.value);
  const salida = parseDateOnly(fechaSalidaCorralon.value);

  if (!ingreso || !salida) {
    diasPensionInput.value = "";
    return;
  }

  const msPorDia = 1000 * 60 * 60 * 24;
  const diferencia = salida.getTime() - ingreso.getTime();
  const dias = Math.round(diferencia / msPorDia);

  diasPensionInput.value = dias >= 0 ? dias : 0;
}

function toggleCorralon() {
  if (!corralonSelect || !seccionCorralon) return;
  const mostrar = corralonSelect.value === "si";
  seccionCorralon.classList.toggle("hidden", !mostrar);
}

function crearGruaExtra() {
  contadorGruas++;

  const wrapper = document.createElement("div");
  wrapper.className = "grua-extra";

  wrapper.innerHTML = `
    <div class="grua-extra-header">
      <strong>${contadorGruas + 1}ª grúa</strong>
      <button type="button" class="btn-eliminar">Eliminar</button>
    </div>

    <div class="grid">
      <div class="field">
        <label>Tipo de grúa</label>
        <select class="extra-tipo">
          <option value="A">Tipo A</option>
          <option value="B">Tipo B</option>
          <option value="C">Tipo C</option>
          <option value="D">Tipo D</option>
        </select>
      </div>

      <div class="field">
        <label>Placas grúa</label>
        <input type="text" class="extra-placas-grua" placeholder="Placas de la grúa" />
      </div>

      <div class="field">
        <label>Kilómetros</label>
        <input type="number" class="extra-km" placeholder="0" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Horas de espera</label>
        <input type="number" class="extra-espera" placeholder="0" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Horas maniobra</label>
        <input type="number" class="extra-maniobra" placeholder="0" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Abanderamiento grúa</label>
        <select class="extra-abanderamiento-grua">
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      </div>

      <div class="field">
        <label>Horas abanderamiento grúa</label>
        <input type="number" class="extra-horas-abanderamiento-grua" placeholder="0" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Abanderamiento manual</label>
        <select class="extra-abanderamiento-manual">
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      </div>

      <div class="field">
        <label>Horas abanderamiento manual</label>
        <input type="number" class="extra-horas-abanderamiento-manual" placeholder="0" min="0" step="0.01" />
      </div>
    </div>
  `;

  const btnEliminar = wrapper.querySelector(".btn-eliminar");
  btnEliminar.addEventListener("click", () => {
    wrapper.remove();
    recalcularTitulosGruas();
    calcularTodo();
  });

  wrapper.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", calcularTodo);
    el.addEventListener("change", calcularTodo);
  });

  gruasExtrasContainer.appendChild(wrapper);
  recalcularTitulosGruas();
}

function recalcularTitulosGruas() {
  const bloques = document.querySelectorAll(".grua-extra");
  bloques.forEach((bloque, index) => {
    const titulo = bloque.querySelector(".grua-extra-header strong");
    if (titulo) titulo.textContent = `${index + 2}ª grúa`;
  });
}

function obtenerValoresPrincipales() {
  return {
    numeroServicio: document.getElementById("numeroServicio")?.value || "",
    fecha: document.getElementById("fecha")?.value || "",
    hora: document.getElementById("hora")?.value || "",
    tipoServicio: document.getElementById("tipoServicio")?.value || "",
    tipo: document.getElementById("tipoGrua")?.value || "A",
    placas: document.getElementById("placas")?.value || "",
    marca: document.getElementById("marca")?.value || "",
    origen: document.getElementById("origen")?.value || "",
    destino: document.getElementById("destino")?.value || "",
    km: Number(document.getElementById("kilometros")?.value) || 0,
    horasEspera: Number(document.getElementById("horasEspera")?.value) || 0,
    horasManiobra: Number(document.getElementById("horasManiobra")?.value) || 0,
    abanderamientoGrua: document.getElementById("abanderamientoGrua")?.value || "no",
    horasAbanderamientoGrua: Number(document.getElementById("horasAbanderamientoGrua")?.value) || 0,
    abanderamientoManual: document.getElementById("abanderamientoManual")?.value || "no",
    horasAbanderamientoManual: Number(document.getElementById("horasAbanderamientoManual")?.value) || 0,
    corralon: document.getElementById("corralon")?.value || "no",
    placasCorralon: document.getElementById("placasCorralon")?.value || "",
    numeroActa: document.getElementById("numeroActa")?.value || "",
    numeroInventario: document.getElementById("numeroInventario")?.value || "",
    fechaIngresoCorralon: document.getElementById("fechaIngresoCorralon")?.value || "",
    fechaSalidaCorralon: document.getElementById("fechaSalidaCorralon")?.value || "",
    diasPension: Number(document.getElementById("diasPension")?.value) || 0,
    tipoUnidadCorralon: document.getElementById("tipoUnidadCorralon")?.value || "",
    aplicarIVA: document.getElementById("aplicarIVA")?.checked || false
  };
}

function calcularGruasExtras() {
  let totalGruasExtras = 0;
  const detalleGruas = [];

  document.querySelectorAll(".grua-extra").forEach((item, index) => {
    const tipo = item.querySelector(".extra-tipo")?.value || "A";
    const placas = item.querySelector(".extra-placas-grua")?.value || "";
    const km = Number(item.querySelector(".extra-km")?.value) || 0;
    const espera = Number(item.querySelector(".extra-espera")?.value) || 0;
    const maniobraHoras = Number(item.querySelector(".extra-maniobra")?.value) || 0;
    const abanderamientoGrua = item.querySelector(".extra-abanderamiento-grua")?.value || "no";
    const horasAbanderamientoGrua = Number(item.querySelector(".extra-horas-abanderamiento-grua")?.value) || 0;
    const abanderamientoManual = item.querySelector(".extra-abanderamiento-manual")?.value || "no";
    const horasAbanderamientoManual = Number(item.querySelector(".extra-horas-abanderamiento-manual")?.value) || 0;

    const subtotal =
      tarifas[tipo].banderazo +
      (km * tarifas[tipo].km) +
      (espera * ESPERA_POR_HORA) +
      (maniobraHoras * tarifas[tipo].maniobraHora) +
      (abanderamientoGrua === "si" ? horasAbanderamientoGrua * ABANDERAMIENTO_GRUA_POR_HORA : 0) +
      (abanderamientoManual === "si" ? horasAbanderamientoManual * ABANDERAMIENTO_MANUAL_POR_HORA : 0);

    totalGruasExtras += subtotal;

    detalleGruas.push({
      nombre: `${index + 2}ª grúa`,
      tipo,
      placas,
      km,
      espera,
      maniobraHoras,
      abanderamientoGrua,
      horasAbanderamientoGrua,
      abanderamientoManual,
      horasAbanderamientoManual,
      subtotal
    });
  });

  return { totalGruasExtras, detalleGruas };
}

function calcularTodo() {
  calcularDiasCorralon();

  const p = obtenerValoresPrincipales();

  const banderazo = tarifas[p.tipo].banderazo;
  const traslado = p.km * tarifas[p.tipo].km;
  const maniobra = p.horasManiobra * tarifas[p.tipo].maniobraHora;
  const espera = p.horasEspera * ESPERA_POR_HORA;

  const costoAbanderamientoGrua =
    p.abanderamientoGrua === "si"
      ? p.horasAbanderamientoGrua * ABANDERAMIENTO_GRUA_POR_HORA
      : 0;

  const costoAbanderamientoManual =
    p.abanderamientoManual === "si"
      ? p.horasAbanderamientoManual * ABANDERAMIENTO_MANUAL_POR_HORA
      : 0;

  const tarifaPension = PENSION_TARIFAS[p.tipoUnidadCorralon] || 0;
  const pension = p.corralon === "si" ? p.diasPension * tarifaPension : 0;
  const costoCorralon = p.corralon === "si" ? CORRALON_COSTO : 0;

  const { totalGruasExtras, detalleGruas } = calcularGruasExtras();

  const subtotal =
    banderazo +
    traslado +
    maniobra +
    totalGruasExtras +
    espera +
    costoAbanderamientoGrua +
    costoAbanderamientoManual +
    pension +
    costoCorralon;

  const iva = p.aplicarIVA ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  const rBanderazo = document.getElementById("rBanderazo");
  const rTraslado = document.getElementById("rTraslado");
  const rManiobras = document.getElementById("rManiobras");
  const rGruasExtras = document.getElementById("rGruasExtras");
  const rEspera = document.getElementById("rEspera");
  const rAbanderamientoGrua = document.getElementById("rAbanderamientoGrua");
  const rAbanderamientoManual = document.getElementById("rAbanderamientoManual");
  const rPension = document.getElementById("rPension");
  const rCorralon = document.getElementById("rCorralon");
  const rSubtotal = document.getElementById("rSubtotal");
  const rIVA = document.getElementById("rIVA");
  const rTotal = document.getElementById("rTotal");

  if (rBanderazo) rBanderazo.textContent = money(banderazo);
  if (rTraslado) rTraslado.textContent = money(traslado);
  if (rManiobras) rManiobras.textContent = money(maniobra);
  if (rGruasExtras) rGruasExtras.textContent = money(totalGruasExtras);
  if (rEspera) rEspera.textContent = money(espera);
  if (rAbanderamientoGrua) rAbanderamientoGrua.textContent = money(costoAbanderamientoGrua);
  if (rAbanderamientoManual) rAbanderamientoManual.textContent = money(costoAbanderamientoManual);
  if (rPension) rPension.textContent = money(pension);
  if (rCorralon) rCorralon.textContent = money(costoCorralon);
  if (rSubtotal) rSubtotal.textContent = money(subtotal);
  if (rIVA) rIVA.textContent = money(iva);
  if (rTotal) rTotal.textContent = money(total);

  return {
    ...p,
    banderazo,
    traslado,
    maniobra,
    totalGruasExtras,
    detalleGruas,
    espera,
    costoAbanderamientoGrua,
    costoAbanderamientoManual,
    pension,
    costoCorralon,
    subtotal,
    iva,
    total,
    tarifaPension
  };
}

function construirHtmlReporte() {
  const d = calcularTodo();

  const filasGruas = d.detalleGruas.length
    ? d.detalleGruas.map(g => `
      <tr>
        <td>${g.nombre}</td>
        <td>${g.tipo}</td>
        <td>${g.placas}</td>
        <td>${g.km}</td>
        <td>${g.espera}</td>
        <td>${g.maniobraHoras}</td>
        <td>${money(g.subtotal)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="7">Sin grúas adicionales</td></tr>`;

  return `
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Reporte Gaceta</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; padding: 28px; }
        .header { background: linear-gradient(90deg, #1e3a8a, #2563eb); color: white; padding: 22px; border-radius: 14px; }
        .title { font-size: 28px; font-weight: bold; }
        .subtitle { margin-top: 6px; font-size: 14px; }
        .box { margin-top: 18px; border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; }
        .box h3 { background: #eff6ff; padding: 12px 16px; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #e5e7eb; padding: 10px; font-size: 14px; text-align: left; }
        th { background: #f8fafc; }
        .total { background: #dbeafe; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Gaceta Grúas Metropolitanas</div>
        <div class="subtitle">Reporte de costos por servicio</div>
      </div>

      <div class="box">
        <h3>Datos del servicio</h3>
        <table>
          <tr><th>Número de servicio</th><td>${d.numeroServicio}</td><th>Fecha</th><td>${d.fecha}</td></tr>
          <tr><th>Hora</th><td>${d.hora}</td><th>Tipo de servicio</th><td>${d.tipoServicio}</td></tr>
          <tr><th>Tipo de grúa principal</th><td>${d.tipo}</td><th>Placas del auto</th><td>${d.placas}</td></tr>
          <tr><th>Marca</th><td>${d.marca}</td><th>Kilómetros</th><td>${d.km}</td></tr>
          <tr><th>Origen</th><td>${d.origen}</td><th>Destino</th><td>${d.destino}</td></tr>
        </table>
      </div>

      <div class="box">
        <h3>Corralón</h3>
        <table>
          <tr><th>Aplica</th><td>${d.corralon}</td><th>Placas corralón</th><td>${d.placasCorralon}</td></tr>
          <tr><th>No. acta</th><td>${d.numeroActa}</td><th>No. inventario</th><td>${d.numeroInventario}</td></tr>
          <tr><th>Fecha ingreso</th><td>${d.fechaIngresoCorralon}</td><th>Fecha salida</th><td>${d.fechaSalidaCorralon}</td></tr>
          <tr><th>Tipo unidad</th><td>${d.tipoUnidadCorralon}</td><th>Días pensión</th><td>${d.diasPension}</td></tr>
        </table>
      </div>

      <div class="box">
        <h3>Grúas adicionales</h3>
        <table>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Placas</th>
            <th>KM</th>
            <th>Espera</th>
            <th>Horas maniobra</th>
            <th>Subtotal</th>
          </tr>
          ${filasGruas}
        </table>
      </div>

      <div class="box">
        <h3>Resumen de costos</h3>
        <table>
          <tr><th>Banderazo</th><td>${money(d.banderazo)}</td></tr>
          <tr><th>Traslado</th><td>${money(d.traslado)}</td></tr>
          <tr><th>Maniobra grúa principal</th><td>${money(d.maniobra)}</td></tr>
          <tr><th>Grúas adicionales</th><td>${money(d.totalGruasExtras)}</td></tr>
          <tr><th>Espera</th><td>${money(d.espera)}</td></tr>
          <tr><th>Abanderamiento grúa</th><td>${money(d.costoAbanderamientoGrua)}</td></tr>
          <tr><th>Abanderamiento manual</th><td>${money(d.costoAbanderamientoManual)}</td></tr>
          <tr><th>Pensión</th><td>${money(d.pension)}</td></tr>
          <tr><th>Corralón</th><td>${money(d.costoCorralon)}</td></tr>
          <tr><th>Subtotal</th><td>${money(d.subtotal)}</td></tr>
          <tr><th>IVA 16%</th><td>${money(d.iva)}</td></tr>
          <tr class="total"><th>Total</th><td>${money(d.total)}</td></tr>
        </table>
      </div>
    </body>
  </html>
  `;
}

function exportarWord() {
  const html = construirHtmlReporte();
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Reporte_Gaceta_${document.getElementById("numeroServicio")?.value || "servicio"}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportarExcel() {
  const d = calcularTodo();

  let csv = "REPORTE GACETA GRUAS METROPOLITANAS\n";
  csv += "Campo,Valor\n";
  csv += `Numero de servicio,${d.numeroServicio}\n`;
  csv += `Fecha,${d.fecha}\n`;
  csv += `Hora,${d.hora}\n`;
  csv += `Tipo de servicio,${d.tipoServicio}\n`;
  csv += `Tipo de grua principal,${d.tipo}\n`;
  csv += `Placas del auto,${d.placas}\n`;
  csv += `Marca,${d.marca}\n`;
  csv += `Origen,${d.origen}\n`;
  csv += `Destino,${d.destino}\n`;
  csv += `Kilometros,${d.km}\n`;
  csv += `Horas espera,${d.horasEspera}\n`;
  csv += `Horas maniobra principal,${d.horasManiobra}\n`;
  csv += `Corralon,${d.corralon}\n`;
  csv += `Placas corralon,${d.placasCorralon}\n`;
  csv += `Numero acta,${d.numeroActa}\n`;
  csv += `Numero inventario,${d.numeroInventario}\n;
  csv += Fecha ingreso corralon,${d.fechaIngresoCorralon}\n`;
  csv += `Fecha salida corralon,${d.fechaSalidaCorralon}\n`;
  csv += `Tipo unidad corralon,${d.tipoUnidadCorralon}\n`;
  csv += `Dias pension,${d.diasPension}\n`;
  csv += "\nConcepto,Monto\n";
  csv += `Banderazo,${d.banderazo}\n`;
  csv += `Traslado,${d.traslado}\n`;
  csv += `Maniobra grua principal,${d.maniobra}\n`;
  csv += `Gruas adicionales,${d.totalGruasExtras}\n`;
  csv += `Espera,${d.espera}\n`;
  csv += `Abanderamiento grua,${d.costoAbanderamientoGrua}\n`;
  csv += `Abanderamiento manual,${d.costoAbanderamientoManual}\n`;
  csv += `Pension,${d.pension}\n`;
  csv += `Corralon,${d.costoCorralon}\n`;
  csv += `Subtotal,${d.subtotal}\n`;
  csv += `IVA 16%,${d.iva}\n`;
  csv += `Total,${d.total}\n`;

  if (d.detalleGruas.length) {
    csv += "\nGRUAS ADICIONALES\n";
    csv += "Nombre,Tipo,Placas,KM,Horas espera,Horas maniobra,Aband grua,Horas aband grua,Aband manual,Horas aband manual,Subtotal\n";
    d.detalleGruas.forEach((g) => {
      csv += `${g.nombre},${g.tipo},${g.placas},${g.km},${g.espera},${g.maniobraHoras},${g.abanderamientoGrua},${g.horasAbanderamientoGrua},${g.abanderamientoManual},${g.horasAbanderamientoManual},${g.subtotal}\n`;
    });
  }

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Reporte_Gaceta_${document.getElementById("numeroServicio")?.value || "servicio"}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

if (corralonSelect) {
  corralonSelect.addEventListener("change", () => {
    toggleCorralon();
    calcularDiasCorralon();
    calcularTodo();
  });
}

if (fechaIngresoCorralon) {
  fechaIngresoCorralon.addEventListener("change", () => {
    calcularDiasCorralon();
    calcularTodo();
  });
}

if (fechaSalidaCorralon) {
  fechaSalidaCorralon.addEventListener("change", () => {
    calcularDiasCorralon();
    calcularTodo();
  });
}

if (tipoUnidadCorralon) {
  tipoUnidadCorralon.addEventListener("change", calcularTodo);
}

if (aplicarIVA) {
  aplicarIVA.addEventListener("change", calcularTodo);
}

if (btnAgregarGrua) {
  btnAgregarGrua.addEventListener("click", crearGruaExtra);
}

if (btnCalcular) {
  btnCalcular.addEventListener("click", calcularTodo);
}

if (btnWord) {
  btnWord.addEventListener("click", exportarWord);
}

if (btnExcel) {
  btnExcel.addEventListener("click", exportarExcel);
}

document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", calcularTodo);
  el.addEventListener("change", calcularTodo);
});

toggleCorralon();
setTimeout(() => {
  calcularDiasCorralon();
  calcularTodo();
}, 200);
