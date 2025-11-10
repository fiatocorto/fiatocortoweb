import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

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
          
          {/* Quarta colonna: Contattaci */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: '24px' }}>Community</h4>
            <div className="border-b-2 border-white mb-4" style={{ width: '60px' }}></div>
            <p className="text-white mb-4" style={{ fontSize: '16px' }}>Unisci alla community su WhatsApp</p>
            <a
              href="https://chat.whatsapp.com/GMMpUy5Hi5b8GwbjLm1QwT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <div style={{ backgroundColor: '#1e293b' }} className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-sm">
              &copy; 2025 Fiato Corto. Tutti i diritti riservati.
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

