import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  "/kuvat/bgimg.png",
  "/kuvat/Talo1.png",
  "/kuvat/Talo2.png",
  "/kuvat/Talo3.png"
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* Hero & Karuselli */}
      <section className="hero">
        <div className="hero-slides">
          {slides.map((src, index) => (
            <img
              key={src}
              className={`hero-slide ${index === activeIndex ? "is-active" : ""}`}
              src={src}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-logo">
            <img src="/kuvat/Logo_Asuntohintalaskuri.png" alt="Asuntohintalaskurin logo" />
          </div>
          <p className="hero-text">
            Asuntohintalaskuri on ilmainen työkalu, jolla voit laskea asuntosi hinnan antamalla tiedot nykyisestä asunnostasi.
            Laskurimme vertailee asuntoasi alueen muiden samantyylisten asuntojen kanssa ja antaa sinulle hinta-arvion.
          </p>
          <Link className="btn" id="laskuri" to="/calculator">
            Laske asuntosi hinta-arvio
          </Link>
        </div>

        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`hero-dot ${index === activeIndex ? "is-active" : ""}`}
              aria-label={`Kuva ${index + 1} / ${slides.length}`}
              aria-current={index === activeIndex ? "true" : "false"}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Miten toimii */}
      <section className="card home-section">
        <h2>Miten asuntohintalaskuri toimii?</h2>
        <ol className="steps">
          <li>
            <h3>Anna asuntosi tiedot</h3>
            <p>Syötä Asuntohintalaskuriin asunnon perustiedot sekä mahdolliset lisäominaisuudet. Näiden tietojen perusteella laskuri voi arvioida asunnon hinta-arvion.</p>
          </li>
          <li>
            <h3>Hinta-arvio lasketaan</h3>
            <p>Laskurimme vertaa antamiasi tietoja ja laskee asunnosta keskimääräisen hinta-arvion.</p>
          </li>
          <li>
            <h3>Asunnon hinta-arvio</h3>
            <p>Näytämme sinulle arvion asunnon hinnasta. Voit muokata antamiasi tietoja ja laskea uuden arvion nopeasti.</p>
          </li>
        </ol>
      </section>

      {/* Hintaan vaikuttavat tekijät */}
      <section className="card home-section">
        <h2>Mitkä tekijät vaikuttavat hinta-arvioon?</h2>
        <div className="factors">
          <article>
            <h3>Sijainti</h3>
            <p><strong>Kaupunki ja kaupunginosa määrittävät markkinahinnan perustason.</strong></p>
            <p>Keskeiset alueet, palveluiden läheisyys ja hyvät liikenneyhteydet nostavat arvoa, kun taas syrjäisemmät sijainnit laskevat sitä.</p>
          </article>

          <article>
            <h3>Kunto</h3>
            <p><strong>Asunnon kunto vaikuttaa merkittävästi asunnon arvoon.</strong></p>
            <ul>
              <li><strong>Erinomainen</strong> = Uudenveroinen</li>
              <li><strong>Hyvä</strong> = Normaalia kulumaa, ei suuria remonttitarpeita</li>
              <li><strong>Tyydyttävä</strong> = Ikääntynyt, vaatii pintaremonttia</li>
              <li><strong>Välttävä</strong> = Selkeä remontintarve</li>
            </ul>
          </article>

          <article>
            <h3>Asunnon koko ja huoneiden määrä</h3>
            <p><strong>Neliömäärä ja huoneiden määrä on yksi vahvimmista hinnan selittäjistä.</strong></p>
            <p>Suurempi neliömäärä ja toimiva huonejako voi lisätä arvoa myös pienemmissä asunnoissa.</p>
          </article>

          <article>
            <h3>Lisäominaisuudet</h3>
            <p><strong>Mahdolliset lisäominaisuudet voivat nostaa asunnon arvoa merkittävästi.</strong></p>
            <p>Sauna, parveke ja hissi lisäävät asumismukavuutta ja kysyntää.</p>
          </article>
        </div>
      </section>
    </main>
  );
}