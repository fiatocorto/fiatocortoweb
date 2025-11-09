import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="/resources/Bianco.png" 
                alt="Fiato Corto" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-muted">
              Breathless Adventures - Le tue escursioni indimenticabili
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Link Utili</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tours" className="text-muted hover:text-accent transition-colors">
                  Tour
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-muted hover:text-accent transition-colors">
                  Calendario
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Informazioni</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie" className="text-muted hover:text-accent transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted hover:text-accent transition-colors">
                  Termini e Condizioni
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Email: info@fiatocortoadventures.it</li>
              <li>Tel: +39 123 456 7890</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-muted">
          <p>&copy; 2024 Fiato Corto. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}

