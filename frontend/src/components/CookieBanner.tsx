import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<string | null>(null); // null, 'accepted', 'rejected'

  useEffect(() => {
    // Controlla se c'è già un consenso salvato
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setConsent(savedConsent);
      setShowBanner(false);
    } else {
      // Mostra il banner se non c'è ancora un consenso
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setConsent('accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setConsent('rejected');
    setShowBanner(false);
  };

  const handleOpenBanner = () => {
    setShowBanner(true);
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  // Se non c'è ancora un consenso, mostra il banner
  if (showBanner) {
    return (
      <div className="fixed bottom-0 left-0 md:bottom-4 md:left-4 z-50 w-full md:w-auto md:max-w-md">
        <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 m-4 md:m-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cookie className="text-accent" size={24} />
              <h3 className="text-lg font-bold text-gray-900">
                Gestione Cookie
              </h3>
            </div>
            <button
              onClick={handleCloseBanner}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Chiudi banner"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 mb-6">
            Questo sito utilizza cookie tecnici necessari per il funzionamento. Non utilizziamo cookie di profilazione o marketing. Puoi gestire le tue preferenze in qualsiasi momento.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              Accetta
            </button>
            <button
              onClick={handleReject}
              className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              Rifiuta
            </button>
          </div>

          {/* Link to Cookie Policy */}
          <div className="mt-4 text-center">
            <Link
              to="/cookie"
              className="text-xs text-gray-500 hover:text-accent transition-colors underline"
            >
              Maggiori informazioni
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Se c'è già un consenso, mostra solo l'etichetta piccola
  if (consent) {
    return (
      <button
        onClick={handleOpenBanner}
        className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 shadow-lg rounded-3xl px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-all duration-300 group"
        aria-label="Gestisci preferenze cookie"
      >
        <Settings size={16} className="text-accent group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-xs text-gray-700">
          {consent === 'accepted' ? 'Cookie accettati' : 'Cookie rifiutati'}
        </span>
      </button>
    );
  }

  return null;
};

export default CookieBanner;

