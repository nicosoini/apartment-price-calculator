import Papa from "papaparse";
import MLR from "ml-regression-multivariate-linear";

// Opetetaan malli ja palautetaan se, jotta sitä voidaan käyttää ennustamiseen
export async function opetaMalli() {
  // Selaimessa CSV haetaan fetch-kutsulla public-kansiosta
  const response = await fetch("/asunnot_suomi_10000_numeric_v2.csv");
  const csvData = await response.text();
  console.log("CSV-tiedosto luettu: ", csvData.length, " merkkiä");

  // jäsennetään opetusdata CSV-muodosta JavaScript-objekteiksi
  const parsed = Papa.parse(csvData, {
    header: true,         // Käytetään ensimmäistä riviä otsikoina
    dynamicTyping: true,  // Muuntaa numeromerkkijonot automaattisesti luvuiksi (number)
    skipEmptyLines: true  // Ohitetaan tyhjät rivit
  });
  console.log("CSV-tiedosto jäsennelty. Rivit: ", parsed.data.length);

  // Erotellaan X (syötteet) ja Y (syötteen tulokset (hinta))
  const x = [];
  const y = [];

  parsed.data.forEach((row) => {
    x.push([
      row.pinta_ala, row.huoneita, row.rakennusvuosi,
      row.asunnon_tyyppi, row.kaupunki, row.postinumero, 
      row.kerros, row.hissi, row.parveke, 
      row.sauna, row.autopaikka, row.kunto,
      row.tontti
    ]);

    y.push([row.hinta]);
  });
  console.log("Data luettu ja jäsennelty. Syötteitä: ", x.length, " Ennustettavia arvoja: ", y.length);

  // Luodaan ja opetetaan MLR-malli
  const mlr = new MLR(x, y);
  console.log("MLR-malli opetettu");
  return mlr;
}

// Ennusteen lasku funktio, joka ottaa opetetun MLR-mallin ja arvioitavan talon ominaisuudet
export function teeEnnuste(OpetettuMLR, arvioitavaTalo) {
  const ennuste = OpetettuMLR.predict(arvioitavaTalo);
  const tulos = Array.isArray(ennuste) ? ennuste[0] : ennuste;
  console.log("Ennuste tehty: ", Math.round(tulos));
  return Math.round(tulos);
}