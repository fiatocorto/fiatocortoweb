import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Calendar, Check, X, Globe, Activity, Headphones, Mail, HelpCircle, Share2, Copy, Edit } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import ImageGallery from '../components/ImageGallery';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import QRBadge from '../components/QRBadge';

export default function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booking, setBooking] = useState({
    adults: 1,
    children: 0,
    paymentMethod: 'ONSITE' as 'ONSITE' | 'CARD_STUB' | 'FREE',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/api/tours/${slug}`);
      setTour(response.data.tour);
    } catch (error) {
      console.error('Failed to fetch tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (tour) {
      // Reset booking state
      setBooking({
        adults: 1,
        children: 0,
        paymentMethod: tour.priceAdult === 0 && tour.priceChild === 0 ? 'FREE' : 'ONSITE',
        notes: '',
      });
      setBookingResult(null);
      setShowBookingModal(true);
    }
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    const priceAdult = tour.priceAdult || 0;
    const priceChild = tour.priceChild || 0;
    return booking.adults * priceAdult + booking.children * priceChild;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    setSubmitting(true);
    try {
      const response = await api.post('/api/bookings', {
        tourId: tour.id,
        ...booking,
      });
      setBookingResult(response.data);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Errore nella prenotazione');
    } finally {
      setSubmitting(false);
    }
  };

  const getShareUrl = () => {
    return window.location.href;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Guarda questo tour: ${tour?.title}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p style={{ color: 'rgb(73, 77, 89)' }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p style={{ color: 'rgb(73, 77, 89)' }}>Tour non trovato</p>
        </div>
      </div>
    );
  }

  // Helper function to safely parse JSON or return array
  const safeParseArray = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (!value || value === '') {
      return [];
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If it's not valid JSON, try splitting by comma
        return value.split(',').map((item: string) => item.trim()).filter((item: string) => item.length > 0);
      }
    }
    return [];
  };

  const images = safeParseArray(tour.images);
  const includes = safeParseArray(tour.includes);
  const excludes = safeParseArray(tour.excludes);
  
  // Parse gallery images (comma-separated string)
  const galleryImages = tour.gallery 
    ? tour.gallery.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0)
    : [];
  
  // Combine all images: coverImage, gallery images, and additional images
  const allImages = [
    ...(tour.coverImage ? [tour.coverImage] : []),
    ...galleryImages,
    ...images
  ].filter(Boolean);

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Prima riga: Titolo, Data, Condividi */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h1 className="font-title text-4xl font-bold mb-2">{tour.title}</h1>
            <div className="flex items-center space-x-4" style={{ color: 'rgb(73, 77, 89)' }}>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(tour.dateStart), 'dd MMMM yyyy', { locale: it })}
            </span>
              {tour.dateEnd && !isSameDay(new Date(tour.dateStart), new Date(tour.dateEnd)) && (
                <>
                  <span>-</span>
                  <span className="flex items-center">
                    {format(new Date(tour.dateEnd), 'dd MMMM yyyy', { locale: it })}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-full hover:border-accent hover:bg-accent/5 transition-colors whitespace-nowrap"
            >
              <Share2 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Condividi</span>
            </button>
            {user?.role === 'ADMIN' && tour && (
              <button
                onClick={() => navigate(`/admin/tours/${tour.id}/edit`)}
                className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-full hover:border-accent hover:bg-accent/5 transition-colors whitespace-nowrap"
              >
                <Edit className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">Modifica</span>
              </button>
            )}
          </div>
          </div>

        {/* Seconda riga: Immagine a sinistra, Riquadro prezzi a destra */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mb-8">
          <div>
            <ImageGallery images={allImages.slice(1)} coverImage={allImages[0] || tour.coverImage} />

            {/* Contenuto principale */}
          <div className="mt-8">
            <h3 className="font-bold mb-3">Descrizione</h3>
            <p className="leading-relaxed" style={{ color: 'rgb(73, 77, 89)' }}>{tour.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#fffcf7' }}>
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Durata</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.durationValue} {tour.durationUnit}
                </p>
              </div>
              
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#fffcf7' }}>
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Difficoltà</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.difficulty || 'N/A'}
                </p>
              </div>
              
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#fffcf7' }}>
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Partecipanti</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.maxSeats} persone
                </p>
              </div>
              
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#fffcf7' }}>
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Lingua</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.language}
                </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#fffcf7' }}>
              <h3 className="font-bold mb-3 flex items-center">
                Incluso
              </h3>
              <ul className="space-y-2">
                {includes.map((item: string, index: number) => (
                  <li key={index} className="flex items-center" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#fffcf7' }}>
              <h3 className="font-bold mb-3 flex items-center">
                Escluso
              </h3>
              <ul className="space-y-2">
                {excludes.map((item: string, index: number) => (
                  <li key={index} className="flex items-center" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                    <X className="w-4 h-4 text-red-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-3">Itinerario</h3>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: 'rgb(73, 77, 89)' }}>
              {tour.itinerary}
            </p>
          </div>

          {tour.terms && (
            <div className="mt-8">
              <h3 className="font-bold mb-3">Termini e Condizioni</h3>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: 'rgb(73, 77, 89)' }}>{tour.terms}</p>
            </div>
          )}
            </div>
        </div>

          <div>
            <div className="space-y-6">
            {/* Prezzo, Data e Posti */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#fffcf7' }}>
              <div className="mb-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#1e293b' }}>
                  {tour.priceAdult === 0 ? 'Free' : (
                    <>
                      €{tour.priceAdult} <span className="text-sm font-normal" style={{ color: 'rgb(73, 77, 89)' }}>a persona</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2" style={{ fontSize: '20px' }}>Date</h4>
                <p style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {format(new Date(tour.dateStart), 'dd MMMM yyyy', { locale: it })}
                  {tour.dateEnd && !isSameDay(new Date(tour.dateStart), new Date(tour.dateEnd)) && (
                    <> - {format(new Date(tour.dateEnd), 'dd MMMM yyyy', { locale: it })}</>
                  )}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2" style={{ fontSize: '20px' }}>Posti rimanenti</h4>
                <p style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.availableSeats === 0
                    ? 'Esaurito'
                    : `${tour.availableSeats} posti disponibili`}
                </p>
              </div>

              {tour.availableSeats > 0 && (
                <button onClick={handleBook} className="btn-primary w-full">
                  Prenota Ora
                </button>
              )}

              {tour.availableSeats === 0 && (
                <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                  Esaurito
                </button>
              )}
            </div>

            {/* Informazioni di contatto */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#fffcf7' }}>
              <h3 className="font-bold mb-4" style={{ fontSize: '20px' }}>Informazioni di contatto</h3>
              
              <div className="flex items-center mb-3">
                <div className="bg-white rounded-lg p-2 mr-3">
                  <Headphones className="w-5 h-5 text-accent" />
                </div>
                <p style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>+39 123 456 7890</p>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-2 mr-3">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <p style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>info@fiatocortoadventures.it</p>
              </div>
            </div>

            {/* Hai domande? */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#fffcf7' }}>
              <div className="flex justify-center mb-4">
                <div className="rounded-full flex items-center justify-center" style={{ width: '64px', height: '64px', backgroundColor: '#feefd3' }}>
                  <HelpCircle className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="font-bold mb-3 text-center" style={{ fontSize: '20px' }}>Hai domande?</h3>
              <p className="mb-4" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                Sei in cerca di informazioni? Inviaci una richiesta dalla pagina contatti.
              </p>
              <button 
                onClick={() => navigate('/contacts')} 
                className="btn-primary w-full"
              >
                Contattaci
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Modal Condividi */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Condividi questo tour"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Link del tour
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copiato!' : 'Copia'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-primary mb-3">Condividi su:</p>
            <div className="space-y-2">
              <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="font-semibold">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Prenotazione */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setBookingResult(null);
        }}
        size="lg"
        title={bookingResult ? undefined : "Conferma Prenotazione"}
      >
        {bookingResult ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-title text-3xl font-bold mb-4">
              Prenotazione Confermata!
            </h2>
            <p className="text-muted mb-6">
              La tua prenotazione è stata creata con successo. Riceverai una conferma via email.
            </p>
            <div className="flex justify-center mb-6">
              <QRBadge qrCode={bookingResult.qrToken} />
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-muted">
                <strong>Codice prenotazione:</strong> {bookingResult.booking.id}
              </p>
              <p className="text-sm text-muted">
                <strong>Totale:</strong> {calculateTotal() === 0 ? 'Free' : `€${bookingResult.booking.totalPrice.toFixed(2)}`}
              </p>
            </div>
            <div className="flex space-x-4 justify-center">
              <button 
                onClick={() => {
                  setShowBookingModal(false);
                  navigate('/bookings');
                }} 
                className="btn-primary"
              >
                Le mie prenotazioni
              </button>
              <button 
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingResult(null);
                }} 
                className="btn-secondary"
              >
                Chiudi
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            {/* Nome del tour e date */}
            <div className="mb-6">
              <h2 className="font-title text-2xl font-bold mb-2">{tour?.title}</h2>
              <div className="flex items-center text-muted">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {tour && format(new Date(tour.dateStart), 'dd MMMM yyyy', { locale: it })}
                  {tour && tour.dateEnd && !isSameDay(new Date(tour.dateStart), new Date(tour.dateEnd)) && (
                    <> - {format(new Date(tour.dateEnd), 'dd MMMM yyyy', { locale: it })}</>
                  )}
                </span>
              </div>
            </div>

            {/* Dettagli prenotazione */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Dettagli prenotazione</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Numero adulti
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={tour?.availableSeats || 0}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={booking.adults}
                    onChange={(e) =>
                      setBooking({ ...booking, adults: parseInt(e.target.value) || 1 })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Numero bambini
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={(tour?.availableSeats || 0) - booking.adults}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    value={booking.children}
                    onChange={(e) =>
                      setBooking({ ...booking, children: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              {/* Metodo di pagamento */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Il metodo di pagamento
                </label>
                {tour && (tour.priceAdult === 0 && tour.priceChild === 0) ? (
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={true}
                        readOnly
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Free</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-accent/5 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONSITE"
                        checked={booking.paymentMethod === 'ONSITE'}
                        onChange={(e) =>
                          setBooking({ ...booking, paymentMethod: e.target.value as any })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Paga in loco</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-accent/5 transition-colors opacity-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CARD_STUB"
                        disabled
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Paga online (non disponibile)</div>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Note (opzionale)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none resize-none"
                  rows={3}
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  placeholder="Allergie, richieste speciali, ecc."
                />
              </div>
            </div>

            {/* Riepilogo */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">Riepilogo</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted">Adulti x{booking.adults}</span>
                  <span>
                    {booking.adults * (tour?.priceAdult || 0) === 0 
                      ? 'Free' 
                      : `€${(booking.adults * (tour?.priceAdult || 0)).toFixed(2)}`}
                  </span>
                </div>
                {booking.children > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Bambini x{booking.children}</span>
                    <span>
                      {booking.children * (tour?.priceChild || 0) === 0 
                        ? 'Free' 
                        : `€${(booking.children * (tour?.priceChild || 0)).toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Totale</span>
                  <span className="text-accent">
                    {calculateTotal() === 0 ? 'Free' : `€${calculateTotal().toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Pulsante conferma */}
            <button
              type="submit"
              disabled={submitting || (booking.adults + booking.children > (tour?.availableSeats || 0))}
              className="w-full px-6 py-3 bg-accent rounded-full hover:bg-accent/90 transition-colors font-semibold text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Conferma in corso...' : 'Conferma prenotazione'}
            </button>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

