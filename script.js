const tarifas = {
  A: {
    banderazo: 798.02,
    km: 28.41,
    maniobraHora: 1840.78
  },
  B: {
    banderazo: 916.85,
    km: 31.12,
    maniobraHora: 2017.65
  },
  C: {
    banderazo: 1089.46,
    km: 35.43,
    maniobraHora: 2300.63
  },
  D: {
    banderazo: 1337.08,
    km: 48.83,
    maniobraHora: 3172.21
  }
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

let contadorGruas = 0;

function money(value) {
  return "$" + Number(value).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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
        <label>Kilómetros</label>
        <input type="number" class="extra-km" placeholder="0" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Horas maniobra</label>
        <input type="number" class="extra-maniobra" placeholder="0" min="0" step="0.01" />
      </div>

      <div class="field">
        <label>Placas de la grúa</label>
        <input type="text" class="extra-placas" placeholder="Placas de la grúa" />
      </div>
    </div>
  `;

  wrapper.querySelector(".btn-eliminar").addEventListener("click", () => {
    wrapper.remove();
  });

  gruasExtrasContainer.appendChild(wrapper);
}

btnAgregarGrua.addEventListener("click", crearGruaExtra);

corralonSelect.addEventListener("change", () => {
  const mostrar = corralonSelect.value === "si";
  seccionCorralon.classList.toggle("hidden", !mostrar);
});

document.getElementById("btnCalcular").addEventListener("click", () => {
  const tipo = document.getElementById("tipoGrua").value;
  const km = Number(document.getElementById("kilometros").value) || 0;
  const horasManiobra = Number(document.getElementById("horasManiobra").value) || 0;
  const horasEspera = Number(document.getElementById("horasEspera").value) || 0;
  const diasPension = Number(document.getElementById("diasPension").value) || 0;

  const abanderamientoGrua = document.getElementById("abanderamientoGrua").value;
  const horasAbanderamientoGrua = Number(document.getElementById("horasAbanderamientoGrua").value) || 0;

  const abanderamientoManual = document.getElementById("abanderamientoManual").value;
  const horasAbanderamientoManual = Number(document.getElementById("horasAbanderamientoManual").value) || 0;

  const corralon = document.getElementById("corralon").value;

  const banderazo = tarifas[tipo].banderazo;
  const traslado = km * tarifas[tipo].km;
  const maniobra = horasManiobra * tarifas[tipo].maniobraHora;
  const espera = horasEspera * ESPERA_POR_HORA;

  const costoAbanderamientoGrua =
    abanderamientoGrua === "si"
      ? horasAbanderamientoGrua * ABANDERAMIENTO_GRUA_POR_HORA
      : 0;

  const costoAbanderamientoManual =
    abanderamientoManual === "si"
      ? horasAbanderamientoManual * ABANDERAMIENTO_MANUAL_POR_HORA
      : 0;

  const pension = diasPension * PENSION_POR_DIA;
  const costoCorralon = corralon === "si" ? CORRALON_COSTO : 0;

  let totalGruasExtras = 0;

  document.querySelectorAll(".grua-extra").forEach((item) => {
    const extraTipo = item.querySelector(".extra-tipo").value;
    const extraKm = Number(item.querySelector(".extra-km").value) || 0;
    const extraHorasManiobra = Number(item.querySelector(".extra-maniobra").value) || 0;

    const extraBanderazo = tarifas[extraTipo].banderazo;
    const extraTraslado = extraKm * tarifas[extraTipo].km;
    const extraManiobra = extraHorasManiobra * tarifas[extraTipo].maniobraHora;

    totalGruasExtras += extraBanderazo + extraTraslado + extraManiobra;
  });

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
});
