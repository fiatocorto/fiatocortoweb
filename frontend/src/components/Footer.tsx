import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Prima colonna: Logo */}
          <div>
            <div className="mb-4">
              <img 
                src="/resources/Bianco.png" 
                alt="Fiato Corto" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          
          {/* Seconda colonna: Menu */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: '24px' }}>Menu</h4>
            <div className="border-b-2 border-white mb-4" style={{ width: '60px' }}></div>
            <ul className="space-y-2" style={{ fontSize: '16px' }}>
              <li>
                <Link to="/" className="text-white hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-white hover:text-accent transition-colors">
                  Tour
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-accent transition-colors">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-white hover:text-accent transition-colors">
                  Contattaci
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Terza colonna: Link utili */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: '24px' }}>Link utili</h4>
            <div className="border-b-2 border-white mb-4" style={{ width: '60px' }}></div>
            <ul className="space-y-2" style={{ fontSize: '16px' }}>
              <li>
                <Link to="/privacy" className="text-white hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie" className="text-white hover:text-accent transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-accent transition-colors">
                  Termini e condizioni
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Quarta colonna: Community */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: '24px' }}>Community</h4>
            <div className="border-b-2 border-white mb-4" style={{ width: '60px' }}></div>
            <p className="text-white mb-4" style={{ fontSize: '16px' }}>Unisciti alla community Fiato Corto</p>
            <div className="flex items-center gap-3">
              {/* WhatsApp Button - Round, no text */}
              <a
                href="https://chat.whatsapp.com/GMMpUy5Hi5b8GwbjLm1QwT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              {/* Instagram Button - Round */}
              <a
                href="https://www.instagram.com/fiato.corto/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <div style={{ backgroundColor: '#1e293b' }} className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-sm">
              &copy; 2026 Fiato Corto. Tutti i diritti riservati.
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-white text-sm hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookie" className="text-white text-sm hover:text-accent transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

