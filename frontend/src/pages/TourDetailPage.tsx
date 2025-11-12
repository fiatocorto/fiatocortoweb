import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Calendar, Check, X, Globe, Activity, Headphones, Mail, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import ImageGallery from '../components/ImageGallery';
import QRBadge from '../components/QRBadge';
import Footer from '../components/Footer';

export default function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      navigate(`/booking/${tour.id}`);
    }
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

  const images = JSON.parse(tour.images || '[]');
  const includes = JSON.parse(tour.includes || '[]');
  const excludes = JSON.parse(tour.excludes || '[]');

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="font-title text-4xl font-bold mb-4">{tour.title}</h1>
          <div className="flex items-center space-x-4 mb-6" style={{ color: 'rgb(73, 77, 89)' }}>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(tour.dateStart), 'dd MMMM yyyy', { locale: it })}
            </span>
          </div>

          <ImageGallery images={images} coverImage={tour.coverImage} />

          <div className="mt-8">
            <h3 className="font-bold mb-3">Descrizione</h3>
            <p className="leading-relaxed" style={{ color: 'rgb(73, 77, 89)' }}>{tour.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#f5f7ff' }}>
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Durata</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.durationValue} {tour.durationUnit}
                </p>
              </div>
              
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#f5f7ff' }}>
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Difficoltà</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.difficulty || 'N/A'}
                </p>
              </div>
              
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#f5f7ff' }}>
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Partecipanti</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.maxSeats} persone
                </p>
              </div>
              
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#f5f7ff' }}>
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-bold" style={{ fontSize: '20px' }}>Lingua</h4>
                </div>
                <p className="ml-7" style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {tour.language}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#f5f7ff' }}>
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
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#f5f7ff' }}>
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

        <div className="lg:col-span-1">
          <div className="space-y-6  top-24 self-start">
            {/* Prezzo, Data e Posti */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#f5f7ff' }}>
              <div className="mb-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#1e293b' }}>
                  €{tour.priceAdult} <span className="text-sm font-normal" style={{ color: 'rgb(73, 77, 89)' }}>a persona</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2" style={{ fontSize: '20px' }}>Data</h4>
                <p style={{ fontSize: '16px', color: 'rgb(73, 77, 89)' }}>
                  {format(new Date(tour.dateStart), 'dd MMMM yyyy', { locale: it })}
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
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#f5f7ff' }}>
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
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#f5f7ff' }}>
              <div className="flex justify-center mb-4">
                <div className="rounded-full flex items-center justify-center" style={{ width: '64px', height: '64px', backgroundColor: '#e0e7ff' }}>
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
      <Footer />
    </div>
  );
}

