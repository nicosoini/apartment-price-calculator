import "../styles/contact.css";

export default function Contact() {
  return (
    <main className="page-contact">
      <section className="card contact-card">
        <h1>Asunnolle hinta Oy</h1>
        <address>
          <p>Postiosoite: Katu 30, 01000 Vantaa</p>
          <p>Sähköposti: <a href="mailto:asuntohintalaskuri@info.fi">asuntohintalaskuri@info.fi</a></p>
          <p>Puhelin: <a href="tel:+358401234567">+358 40 1234567</a></p>
        </address>
      </section>
    </main>
  );
}