import { useState, useEffect } from "react";
import { opetaMalli, teeEnnuste } from "../algoritmi";
import "../styles/calculator.css";

// Kaupunkien postinumerovälit (alkunollat poistettuina, esim. 00100 -> 100), kuten opetusdatassa
const KAUPUNGIN_POSTINUMEROT = {
  1: [100, 1099], // Helsinki
  2: [2100, 2999], // Espoo
  3: [33000, 33999], // Tampere
  4: [20000, 20999], // Turku
  5: [90000, 90999], // Oulu
  6: [40001, 40999], // Jyväskylä
};

export default function Calculator() {
  const [malli, setMalli] = useState(null);
  const [ladataanMallia, setLadataanMallia] = useState(true);
  const [tulos, setTulos] = useState(null);
  const [virhe, setVirhe] = useState("");
  const [errors, setErrors] = useState({});

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
    autopaikka: false,
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
        setVirhe(
          "Mallin lataaminen epäonnistui. Varmista, että CSV-tiedosto on public-kansiossa.",
        );
        setLadataanMallia(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setVirhe("");

    const pakolliset = [
      "kaupunki", "postinumero", "pintaala", "rakennus",
      "huoneet", "kerros", "rakennusvuosi", "kunto", "tontti"
    ];
    const uudetVirheet = {};

    for (const kentta of pakolliset) {
      if (formData[kentta] === "") {
        uudetVirheet[kentta] = "Tämä kenttä on pakollinen";
      }
    }

    if (!uudetVirheet.postinumero && !uudetVirheet.kaupunki) {
      const luku = Number(formData.postinumero);
      const [alaraja, ylaraja] = KAUPUNGIN_POSTINUMEROT[formData.kaupunki];
      if (!Number.isInteger(luku) || luku < alaraja || luku > ylaraja) {
        uudetVirheet.postinumero = "Postinumero ei kuulu valittuun kaupunkiin.";
      }
    }

    setErrors(uudetVirheet);

    if (Object.keys(uudetVirheet).length > 0) {
      return;
    }

    if (!malli) {
      setVirhe("Laskentamalli ei ole vielä valmis.");
      return;
    }

    const postinumero = Number(formData.postinumero);

    const arvioitavaTalo = {
      pinta_ala: Number(formData.pintaala),
      huoneita: Number(formData.huoneet),
      rakennusvuosi: Number(formData.rakennusvuosi),
      asunnon_tyyppi: Number(formData.rakennus),
      postinumero,
      kerros: Number(formData.kerros),
      hissi: formData.hissi ? 1 : 0,
      parveke: formData.parveke ? 1 : 0,
      sauna: formData.sauna ? 1 : 0,
      autopaikka: formData.autopaikka ? 1 : 0,
      kunto: Number(formData.kunto),
      tontti: Number(formData.tontti)
    };

    try {
      setTulos(teeEnnuste(malli, arvioitavaTalo));
    } catch (err) {
      setVirhe(err.message);
      setTulos(null);
    }
  };

    const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: undefined,
      ...(id === "kaupunki" && { postinumero: undefined }),
    }));
  };

  return (
    <main>
      <section className="card form-card">
        <h1>Anna asunnon tiedot</h1>
        <p className="form-intro">
          Täytä asunnon perustiedot, jotta voimme laskea hinta-arvion.
        </p>

        <form
          id="laskuri-lomake"
          className="form-grid"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="field">
            <label htmlFor="kaupunki">Sijainti</label>
            <select
              id="kaupunki"
              value={formData.kaupunki}
              onChange={handleChange}
              required
              aria-invalid={!!errors.kaupunki}
              aria-describedby={errors.kaupunki ? "kaupunki-virhe" : undefined}
            >
              <option value="" disabled>
                Valitse kaupunki
              </option>
              <option value="1">Helsinki</option>
              <option value="2">Espoo</option>
              <option value="3">Tampere</option>
              <option value="4">Turku</option>
              <option value="5">Oulu</option>
              <option value="6">Jyväskylä</option>
            </select>
            {errors.kaupunki && (
              <p id="kaupunki-virhe" className="field-error">
                {errors.kaupunki}
              </p>
            )}
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
              aria-invalid={!!errors.postinumero}
              aria-describedby={
                errors.postinumero ? "postinumero-virhe" : undefined
              }
            />
            {errors.postinumero && (
              <p id="postinumero-virhe" className="field-error">
                {errors.postinumero}
              </p>
            )}
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
              aria-invalid={!!errors.pintaala}
              aria-describedby={errors.pintaala ? "pintaala-virhe" : undefined}
            />
            {errors.pintaala && (
              <p id="pintaala-virhe" className="field-error">
                {errors.pintaala}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="rakennus">Rakennuksen tyyppi</label>
            <select
              id="rakennus"
              value={formData.rakennus}
              onChange={handleChange}
              required
              aria-invalid={!!errors.rakennus}
              aria-describedby={errors.rakennus ? "rakennus-virhe" : undefined}
            >
              <option value="" disabled>
                Valitse rakennuksen tyyppi
              </option>
              <option value="1">Kerrostalo</option>
              <option value="2">Rivitalo</option>
              <option value="3">Omakotitalo</option>
            </select>
            {errors.rakennus && (
              <p id="rakennus-virhe" className="field-error">
                {errors.rakennus}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="huoneet">Huonemäärä</label>
            <select
              id="huoneet"
              value={formData.huoneet}
              onChange={handleChange}
              required
              aria-invalid={!!errors.huoneet}
              aria-describedby={errors.huoneet ? "huoneet-virhe" : undefined}
            >
              <option value="" disabled>
                Valitse huonemäärä
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 tai enemmän</option>
            </select>
            {errors.huoneet && (
              <p id="huoneet-virhe" className="field-error">
                {errors.huoneet}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="kerros">Asuinkerros</label>
            <select
              id="kerros"
              value={formData.kerros}
              onChange={handleChange}
              required
              aria-invalid={!!errors.kerros}
              aria-describedby={errors.kerros ? "kerros-virhe" : undefined}
            >
              <option value="" disabled>
                Valitse kerros
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6 tai ylempi</option>
            </select>
            {errors.kerros && (
              <p id="kerros-virhe" className="field-error">
                {errors.kerros}
              </p>
            )}
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
              aria-invalid={!!errors.rakennusvuosi}
              aria-describedby={
                errors.rakennusvuosi ? "rakennusvuosi-virhe" : undefined
              }
            />
            {errors.rakennusvuosi && (
              <p id="rakennusvuosi-virhe" className="field-error">
                {errors.rakennusvuosi}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="kunto">Asunnon kunto</label>
            <select
              id="kunto"
              value={formData.kunto}
              onChange={handleChange}
              required
              aria-invalid={!!errors.kunto}
              aria-describedby={errors.kunto ? "kunto-virhe" : undefined}
            >
              <option value="" disabled>
                Valitse asunnon kunto
              </option>
              <option value="4">Erinomainen</option>
              <option value="3">Hyvä</option>
              <option value="2">Tyydyttävä</option>
              <option value="1">Huono</option>
            </select>
            {errors.kunto && (
              <p id="kunto-virhe" className="field-error">
                {errors.kunto}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="tontti">Tontti</label>
            <select
              id="tontti"
              value={formData.tontti}
              onChange={handleChange}
              required
              aria-invalid={!!errors.tontti}
              aria-describedby={errors.tontti ? "tontti-virhe" : undefined}
            >
              <option value="" disabled>
                Valitse tontin tyyppi
              </option>
              <option value="1">Omistustontti</option>
              <option value="0">Vuokratontti</option>
            </select>
            {errors.tontti && (
              <p id="tontti-virhe" className="field-error">
                {errors.tontti}
              </p>
            )}
          </div>

          <fieldset className="field">
            <legend>Lisäominaisuudet</legend>
            <div className="check-list">
              <label className="check">
                <span>Hissi</span>
                <input
                  type="checkbox"
                  id="hissi"
                  checked={formData.hissi}
                  onChange={handleChange}
                />
              </label>

              <label className="check">
                <span>Parveke</span>
                <input
                  type="checkbox"
                  id="parveke"
                  checked={formData.parveke}
                  onChange={handleChange}
                />
              </label>

              <label className="check">
                <span>Sauna</span>
                <input
                  type="checkbox"
                  id="sauna"
                  checked={formData.sauna}
                  onChange={handleChange}
                />
              </label>

              <label className="check">
                <span>Autopaikka</span>
                <input
                  type="checkbox"
                  id="autopaikka"
                  checked={formData.autopaikka}
                  onChange={handleChange}
                />
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              className="btn btn-large"
              type="submit"
              disabled={ladataanMallia}
            >
              {ladataanMallia ? "Alustetaan laskuria..." : "Laske hinta-arvio"}
            </button>

            {virhe && (
              <p className="result" style={{ color: "#d9534f" }} role="alert">
                {virhe}
              </p>
            )}

            {tulos !== null && !virhe && (
              <p id="tulos" className="result" role="status" aria-live="polite">
                Arvioitu hinta:{" "}
                <strong>{tulos.toLocaleString("fi-FI")} €</strong>
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
