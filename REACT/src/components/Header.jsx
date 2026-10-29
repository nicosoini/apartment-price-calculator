import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isCalculatorPage = location.pathname === "/calculator";

  return (
    <header className="site-header">
      <Link className="logo-header" to="/">
        <div className="logo">
          <img src="/kuvat/Logo_Asuntohintalaskuri.png" alt="Asuntohintalaskurin logo" />
        </div>
        <h1 className="site-name">Asuntohintalaskuri</h1>
      </Link>

      {isCalculatorPage ? (
        <Link className="btn btn-small" to="/contact">Ilmoita ongelmasta</Link>
      ) : (
        <Link className="btn btn-small" to="/calculator">Laskuriin</Link>
      )}
    </header>
  );
}