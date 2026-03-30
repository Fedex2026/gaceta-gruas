const tarifas = {

A: {
banderazo: 798.02,
km: 28.41,
maniobra: 1640.78
},

B: {
banderazo: 916.85,
km: 31.12,
maniobra: 2017.65
},

C: {
banderazo: 1089.46,
km: 35.43,
maniobra: 2300.63
},

D: {
banderazo: 1337.08,
km: 48.83,
maniobra: 3172.21
}

};

const ABANDERAMIENTO = 909.02;
const ESPERA = 909.02;
const MANUAL = 76.39;

document.getElementById("btnCalcular").addEventListener("click", () => {

const tipo = document.getElementById("tipoGrua").value;
const km = Number(document.getElementById("kilometros").value);
const maniobras = Number(document.getElementById("maniobras").value);
const dias = Number(document.getElementById("diasPension").value);

const banderazo = tarifas[tipo].banderazo;
const traslado = km * tarifas[tipo].km;
const maniobra = maniobras * tarifas[tipo].maniobra;

const total =
banderazo +
traslado +
maniobra;

document.getElementById("rBanderazo").textContent = "$" + banderazo.toFixed(2);
document.getElementById("rTraslado").textContent = "$" + traslado.toFixed(2);
document.getElementById("rManiobras").textContent = "$" + maniobra.toFixed(2);
document.getElementById("rTotal").textContent = "$" + total.toFixed(2);

});
