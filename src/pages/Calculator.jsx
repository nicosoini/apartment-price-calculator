import { useState, useEffect } from "react";
import { opetaMalli, teeEnnuste } from "../algoritmi";
import "../styles/calculator.css";

export default function Calculator() {
  const [malli, setMalli] = useState(null);
  const [ladataanMallia, setLadataanMallia] = useState(true);
  const [tulos, setTulos] = useState(null);
  const [virhe, setVirhe] = useState("");

  const [formData, setFormData] = useState({
    kaupunki: "",
    postinumero: "",
    pintaala: "",
    rakennus: "",
    huoneet: "",
    kerros: "",
    rakennusvuosi: "",
    kunto: "",
    tontti: "",
    hissi: false,
    parveke: false,
    sauna: false,
    autopaikka: false
  });

  // Opetetaan malli heti kun sivu ladataan
  useEffect(() => {
    opetaMalli()
      .then((opetettuMalli) => {
        setMalli(opetettuMalli);
        setLadataanMallia(false);
      })
      .catch((err) => {
        console.error("Virhe mallin latauksessa:", err);
        setVirhe("Mallin lataaminen epäonnistui. Varmista, että CSV-tiedosto on public-kansiossa.");
        setLadataanMallia(false);
      });
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVirhe("");

    // Tarkistetaan, että kaikki pakolliset kentät on täytetty
    const pakolliset = [
      "kaupunki", "postinumero", "pintaala", "rakennus",
      "huoneet", "kerros", "rakennusvuosi", "kunto", "tontti"
    ];
    for (const kentta of pakolliset) {
      if (formData[kentta] === "") {
        setVirhe("Täytä kaikki pakolliset kentät ennen laskemista.");
        return;
      }
    }

    if (!malli) {
      setVirhe("Laskentamalli ei ole vielä valmis.");
      return;
    }

    // Muodostetaan syötetaulukko TÄSMÄLLEEN samassa järjestyksessä kuin algoritmi.js:ssä:
    // [pinta_ala, huoneita, rakennusvuosi, asunnon_tyyppi, kaupunki, postinumero, kerros, hissi, parveke, sauna, autopaikka, kunto, tontti]
    const arvioitavaTalo = [
      Number(formData.pintaala),
      Number(formData.huoneet),
      Number(formData.rakennusvuosi),
      Number(formData.rakennus),
      Number(formData.kaupunki),
      Number(formData.postinumero), // esim. "00100" -> 100
      Number(formData.kerros),
      formData.hissi ? 1 : 0,
      formData.parveke ? 1 : 0,
      formData.sauna ? 1 : 0,
      formData.autopaikka ? 1 : 0,
      Number(formData.kunto),
      Number(formData.tontti)
    ];

    const arvio = teeEnnuste(malli, arvioitavaTalo);
    setTulos(arvio);
  };

  return (
    <main>
      <section className="card form-card">
        <h1>Anna asunnon tiedot</h1>
        <p className="form-intro">Täytä asunnon perustiedot, jotta voimme laskea hinta-arvion.</p>

        <form id="laskuri-lomake" className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="kaupunki">Sijainti</label>
            <select id="kaupunki" value={formData.kaupunki} onChange={handleChange} required>
              <option value="" disabled>Valitse kaupunki</option>
              <option value="1">Helsinki</option>
              <option value="2">Espoo</option>
              <option value="3">Tampere</option>
              <option value="4">Turku</option>
              <option value="5">Oulu</option>
              <option value="6">Jyväskylä</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="postinumero">Postinumero</label>
            <input
              id="postinumero"
              type="number"
              inputMode="numeric"
              placeholder="Anna postinumero"
              value={formData.postinumero}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="pintaala">Pinta-ala</label>
            <input
              id="pintaala"
              type="number"
              min="1"
              step="0.5"
              inputMode="decimal"
              placeholder="Anna asunnon pinta-ala m²"
              value={formData.pintaala}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="rakennus">Rakennuksen tyyppi</label>
            <select id="rakennus" value={formData.rakennus} onChange={handleChange} required>
              <option value="" disabled>Valitse rakennuksen tyyppi</option>
              <option value="1">Kerrostalo</option>
              <option value="2">Rivitalo</option>
              <option value="3">Omakotitalo</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="huoneet">Huonemäärä</label>
            <select id="huoneet" value={formData.huoneet} onChange={handleChange} required>
              <option value="" disabled>Valitse huonemäärä</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 tai enemmän</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="kerros">Asuinkerros</label>
            <select id="kerros" value={formData.kerros} onChange={handleChange} required>
              <option value="" disabled>Valitse kerros</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6 tai ylempi</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="rakennusvuosi">Rakennusvuosi</label>
            <input
              id="rakennusvuosi"
              type="number"
              min="1800"
              max="2026"
              inputMode="numeric"
              placeholder="Anna rakennusvuosi"
              value={formData.rakennusvuosi}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="kunto">Asunnon kunto</label>
            <select id="kunto" value={formData.kunto} onChange={handleChange} required>
              <option value="" disabled>Valitse asunnon kunto</option>
              <option value="4">Erinomainen</option>
              <option value="3">Hyvä</option>
              <option value="2">Tyydyttävä</option>
              <option value="1">Huono</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="tontti">Tontti</label>
            <select id="tontti" value={formData.tontti} onChange={handleChange} required>
              <option value="" disabled>Valitse tontin tyyppi</option>
              <option value="1">Omistustontti</option>
              <option value="0">Vuokratontti</option>
            </select>
          </div>

          <fieldset className="field">
            <legend>Lisäominaisuudet</legend>
            <div className="check-list">
              <label className="check">
                <span>Hissi</span>
                <input type="checkbox" id="hissi" checked={formData.hissi} onChange={handleChange} />
              </label>

              <label className="check">
                <span>Parveke</span>
                <input type="checkbox" id="parveke" checked={formData.parveke} onChange={handleChange} />
              </label>

              <label className="check">
                <span>Sauna</span>
                <input type="checkbox" id="sauna" checked={formData.sauna} onChange={handleChange} />
              </label>

              <label className="check">
                <span>Autopaikka</span>
                <input type="checkbox" id="autopaikka" checked={formData.autopaikka} onChange={handleChange} />
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            <button className="btn btn-large" type="submit" disabled={ladataanMallia}>
              {ladataanMallia ? "Alustetaan laskuria..." : "Laske hinta-arvio"}
            </button>

            {virhe && (
              <p className="result" style={{ color: "#d9534f" }} role="alert">
                {virhe}
              </p>
            )}

            {tulos !== null && !virhe && (
              <p id="tulos" className="result" role="status" aria-live="polite">
                Arvioitu hinta: <strong>{tulos.toLocaleString("fi-FI")} €</strong>
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}