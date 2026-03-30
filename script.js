const tarifas = {
  A: { banderazo: 798.02, km: 28.41, maniobraHora: 1840.78 },
  B: { banderazo: 916.85, km: 31.12, maniobraHora: 2017.65 },
  C: { banderazo: 1089.46, km: 35.43, maniobraHora: 2300.63 },
  D: { banderazo: 1337.08, km: 48.83, maniobraHora: 3172.21 }
};

const ESPERA_POR_HORA = 909.02;
const ABANDERAMIENTO_GRUA_POR_HORA = 909.02;
const ABANDERAMIENTO_MANUAL_POR_HORA = 76.39;
const PENSION_POR_DIA = 0;
const CORRALON_COSTO = 0;

const btnAgregarGrua = document.getElementById("btnAgregarGrua");
const gruasExtrasContainer = document.getElementById("gruasExtrasContainer");
const corralonSelect = document.getElementById("corralon");
const seccionCorralon = document.getElementById("seccionCorralon");
const fechaIngresoCorralon = document.getElementById("fechaIngresoCorralon");
const fechaSalidaCorralon = document.getElementById("fechaSalidaCorralon");
const diasPensionInput = document.getElementById("diasPension");

let contadorGruas = 0;

function money(value) {
  return "$" + Number(value || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function parseDateOnly(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function calcularDiasCorralon() {
  const ingreso = parseDateOnly(fechaIngresoCorralon.value);
  const salida = parseDateOnly(fechaSalidaCorralon.value);

  if (!ingreso || !salida) {
    diasPensionInput.value = "";
    return;
  }

  const diff = salida.getTime() - ingreso.getTime();
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  diasPensionInput.value = dias >= 0 ? dias : 0;
}

function toggleCorralon() {
  const mostrar = corralonSelect.value === "si";
  seccionCorralon.classList.toggle("hidden", !mostrar);
}

function crearGruaExtra() {
  contadorGruas++;

  const wrapper = document.createElement("div");
  wrapper.className = "grua-extra";

  wrapper.innerHTML = `
    <div class="grua-extra-header">
      <strong>Grúa adicional ${contadorGruas}</strong>
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

  wrapper.querySelector(".btn-eliminar").addEventListener("click", () => {
    wrapper.remove();
    calcularTodo();
  });

  wrapper.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", calcularTodo);
    el.addEventListener("change", calcularTodo);
  });

  gruasExtrasContainer.appendChild(wrapper);
}

function obtenerValoresPrincipales() {
  return {
    numeroServicio: document.getElementById("numeroServicio").value || "",
    fecha: document.getElementById("fecha").value || "",
    hora: document.getElementById("hora").value || "",
    tipoServicio: document.getElementById("tipoServicio").value || "",
    tipo: document.getElementById("tipoGrua").value || "A",
    placas: document.getElementById("placas").value || "",
    marca: document.getElementById("marca").value || "",
    origen: document.getElementById("origen").value || "",
    destino: document.getElementById("destino").value || "",
    km: Number(document.getElementById("kilometros").value) || 0,
    horasEspera: Number(document.getElementById("horasEspera").value) || 0,
    horasManiobra: Number(document.getElementById("horasManiobra").value) || 0,
    abanderamientoGrua: document.getElementById("abanderamientoGrua").value,
    horasAbanderamientoGrua: Number(document.getElementById("horasAbanderamientoGrua").value) || 0,
    abanderamientoManual: document.getElementById("abanderamientoManual").value,
    horasAbanderamientoManual: Number(document.getElementById("horasAbanderamientoManual").value) || 0,
    corralon: document.getElementById("corralon").value,
    placasCorralon: document.getElementById("placasCorralon").value || "",
    numeroActa: document.getElementById("numeroActa").value || "",
    numeroInventario: document.getElementById("numeroInventario").value || "",
    fechaIngresoCorralon: document.getElementById("fechaIngresoCorralon").value || "",
    fechaSalidaCorralon: document.getElementById("fechaSalidaCorralon").value || "",
    diasPension: Number(document.getElementById("diasPension").value) || 0
  };
}

function calcularGruasExtras() {
  let totalGruasExtras = 0;
  const detalleGruas = [];

  document.querySelectorAll(".grua-extra").forEach((item, index) => {
    const tipo = item.querySelector(".extra-tipo").value;
    const placas = item.querySelector(".extra-placas-grua").value || "";
    const km = Number(item.querySelector(".extra-km").value) || 0;
    const espera = Number(item.querySelector(".extra-espera").value) || 0;
    const maniobraHoras = Number(item.querySelector(".extra-maniobra").value) || 0;
    const abanderamientoGrua = item.querySelector(".extra-abanderamiento-grua").value;
    const horasAbanderamientoGrua = Number(item.querySelector(".extra-horas-abanderamiento-grua").value) || 0;
    const abanderamientoManual = item.querySelector(".extra-abanderamiento-manual").value;
    const horasAbanderamientoManual = Number(item.querySelector(".extra-horas-abanderamiento-manual").value) || 0;

    const subtotal =
      tarifas[tipo].banderazo +
      (km * tarifas[tipo].km) +
      (espera * ESPERA_POR_HORA) +
      (maniobraHoras * tarifas[tipo].maniobraHora) +
      (abanderamientoGrua === "si" ? horasAbanderamientoGrua * ABANDERAMIENTO_GRUA_POR_HORA : 0) +
      (abanderamientoManual === "si" ? horasAbanderamientoManual * ABANDERAMIENTO_MANUAL_POR_HORA : 0);

    totalGruasExtras += subtotal;

    detalleGruas.push({
      nombre: `Grúa adicional ${index + 1}`,
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

  const pension = p.diasPension * PENSION_POR_DIA;
  const costoCorralon = p.corralon === "si" ? CORRALON_COSTO : 0;

  const { totalGruasExtras, detalleGruas } = calcularGruasExtras();

  const total =
    banderazo +
    traslado +
    maniobra +
    totalGruasExtras +
    espera +
    costoAbanderamientoGrua +
    costoAbanderamientoManual +
    pension +
    costoCorralon;

  document.getElementById("rBanderazo").textContent = money(banderazo);
  document.getElementById("rTraslado").textContent = money(traslado);
  document.getElementById("rManiobras").textContent = money(maniobra);
  document.getElementById("rGruasExtras").textContent = money(totalGruasExtras);
  document.getElementById("rEspera").textContent = money(espera);
  document.getElementById("rAbanderamientoGrua").textContent = money(costoAbanderamientoGrua);
  document.getElementById("rAbanderamientoManual").textContent = money(costoAbanderamientoManual);
  document.getElementById("rPension").textContent = money(pension);
  document.getElementById("rCorralon").textContent = money(costoCorralon);
  document.getElementById("rTotal").textContent = money(total);

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
    total
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
    : <tr><td colspan="7">Sin grúas adicionales</td></tr>;

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
          <tr><th>Días pensión</th><td>${d.diasPension}</td><th></th><td></td></tr>
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
  a.download = `Reporte_Gaceta_${document.getElementById("numeroServicio").value || "servicio"}.doc`;
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
  csv += `Numero inventario,${d.numeroInventario}\n`;
  csv += `Fecha ingreso corralon,${d.fechaIngresoCorralon}\n`;
  csv += `Fecha salida corralon,${d.fechaSalidaCorralon}\n`;
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
  a.download = `Reporte_Gaceta_${document.getElementById("numeroServicio").value || "servicio"}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

corralonSelect.addEventListener("change", () => {
  toggleCorralon();
  calcularTodo();
});

fechaIngresoCorralon.addEventListener("change", () => {
  calcularDiasCorralon();
  calcularTodo();
});

fechaSalidaCorralon.addEventListener("change", () => {
  calcularDiasCorralon();
  calcularTodo();
});

btnAgregarGrua.addEventListener("click", crearGruaExtra);
document.getElementById("btnCalcular").addEventListener("click", calcularTodo);
document.getElementById("btnWord").addEventListener("click", exportarWord);
document.getElementById("btnExcel").addEventListener("click", exportarExcel);

document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", calcularTodo);
  el.addEventListener("change", calcularTodo);
});

toggleCorralon();
calcularTodo();
