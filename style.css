const tarifas = {
A: {
banderazo: 1200,
km: 45,
maniobra: 350,
pension: 150
},
B: {
banderazo: 1800,
km: 55,
maniobra: 450,
pension: 200
},
C: {
banderazo: 2500,
km: 65,
maniobra: 550,
pension: 250
},
D: {
banderazo: 3200,
km: 75,
maniobra: 650,
pension: 300
}
};

document.getElementById("btnCalcular").addEventListener("click", () => {

const tipo = document.getElementById("tipoGrua").value;
const km = Number(document.getElementById("kilometros").value);
const maniobras = Number(document.getElementById("maniobras").value);
const dias = Number(document.getElementById("diasPension").value);
const abanderamiento = document.getElementById("abanderamiento").value;
const corralon = document.getElementById("corralon").value;

const banderazo = tarifas[tipo].banderazo;
const traslado = km * tarifas[tipo].km;
const maniobra = maniobras * tarifas[tipo].maniobra;
const pension = dias * tarifas[tipo].pension;

const abander = abanderamiento === "si" ? 800 : 0;
const corral = corralon === "si" ? 600 : 0;

const total =
banderazo +
traslado +
maniobra +
pension +
abander +
corral;

document.getElementById("rBanderazo").textContent = "$" + banderazo.toLocaleString();
document.getElementById("rTraslado").textContent = "$" + traslado.toLocaleString();
document.getElementById("rManiobras").textContent = "$" + maniobra.toLocaleString();
document.getElementById("rAbanderamiento").textContent = "$" + abander.toLocaleString();
document.getElementById("rCorralon").textContent = "$" + corral.toLocaleString();
document.getElementById("rPension").textContent = "$" + pension.toLocaleString();
document.getElementById("rTotal").textContent = "$" + total.toLocaleString();

});
