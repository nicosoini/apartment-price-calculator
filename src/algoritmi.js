import Papa from "papaparse";
import MLR from "ml-regression-multivariate-linear";

const TYYPIT = [1, 2, 3]; // 1 = kerrostalo, 2 = rivitalo, 3 = omakotitalo

// Tehdään postinumeroista alueet ekojen 3 numeron mukaan (Eli jaetaan postinumero sadalla)
// esim: 100 -> 1 (Helsinki), 2135 -> 21 (Espoo), 33100 -> 331, 90100 -> 901
// Alkunollat poistuvat automaattisesti kokonaisluvuiksi muuntaessa
function alueTunnus(postinumero) {
  return Math.floor(postinumero / 100);
}

// Muuntaa yhden asunnon tiedot malliin sopivaksi vektoriksi.
// Käytetään sekä opetuksessa että ennusteessa, jotta koodaus on aina identtinen.
//
// Kategoriset tiedot (asunnon tyyppi, alue) koodataan one-hot-sarakkeiksi,
// jotta malli ei oleta niiden numerojärjestyksellä olevan merkitystä.
// Ensimmäinen luokka jätetään pois (vertailuluokka), ettei synny
// täydellistä monikollineaarisuutta vakiotermin kanssa.
//
// Kaupunkia ei tarvita erikseen: alue määrää kaupungin yksiselitteisesti
// (jokaisella kaupungilla on omat postinumerovälinsä).
function rakennaSyote(a, alueet) {
  return [
    a.pinta_ala,
    a.huoneita,
    a.rakennusvuosi,
    a.kerros,
    a.hissi,
    a.parveke,
    a.sauna,
    a.autopaikka,
    a.kunto,
    a.tontti,
    ...TYYPIT.slice(1).map((t) => (a.asunnon_tyyppi === t ? 1 : 0)),
    ...alueet.slice(1).map((al) => (alueTunnus(a.postinumero) === al ? 1 : 0)),
  ];
}

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

  // Ohitetaan rivit, joissa jokin arvo puuttuu
  const rivit = parsed.data.filter((row) =>
    Object.values(row).every((v) => typeof v === "number" && !Number.isNaN(v))
  );

  // Kerätään datassa esiintyvät alueet (järjestettynä, jotta sarakkeet ovat aina samassa järjestyksessä)
  const alueet = [...new Set(rivit.map((row) => alueTunnus(row.postinumero)))].sort((a, b) => a - b);
  console.log("Alueita datassa: ", alueet.length);

  // Erotellaan X (syötteet) ja Y (syötteen tulokset (hinta))
  const x = [];
  const y = [];

  rivit.forEach((row) => {
    x.push(rakennaSyote(row, alueet));
    y.push([row.hinta]);
  });
  console.log("Data luettu ja jäsennelty. Syötteitä: ", x.length, " Ennustettavia arvoja: ", y.length);

  // Luodaan ja opetetaan MLR-malli
  const mlr = new MLR(x, y);
  console.log("MLR-malli opetettu");

  // Palautetaan malli yhdessä alueluettelon kanssa, jotta ennusteessa käytetään samaa koodausta
  return { mlr, alueet };
}

// Ennusteen lasku funktio, joka ottaa opetetun mallin ja arvioitavan asunnon ominaisuudet (objekti)
export function teeEnnuste(malli, arvioitavaTalo) {
  if (!malli.alueet.includes(alueTunnus(arvioitavaTalo.postinumero))) {
    throw new Error("Postinumeroa ei löydy opetusdatasta. Tarkista postinumero.");
  }

  const syote = rakennaSyote(arvioitavaTalo, malli.alueet);
  const ennuste = malli.mlr.predict(syote);
  const tulos = Array.isArray(ennuste) ? ennuste[0] : ennuste;
  console.log("Ennuste tehty: ", Math.round(tulos));
  return Math.round(tulos);
}