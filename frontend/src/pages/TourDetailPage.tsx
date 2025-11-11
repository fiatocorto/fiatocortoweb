import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, Calendar, Check, X } from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState<any>(null);

  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/api/tours/${slug}`);
      setTour(response.data.tour);
      if (response.data.tour.tourDates?.length > 0) {
        setSelectedDate(response.data.tour.tourDates[0]);
      }
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
    if (selectedDate) {
      navigate(`/booking/${selectedDate.id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Caricamento...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Tour non trovato</p>
      </div>
    );
  }

  const images = JSON.parse(tour.images || '[]');
  const includes = JSON.parse(tour.includes || '[]');
  const excludes = JSON.parse(tour.excludes || '[]');

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="font-title text-4xl font-bold mb-4">{tour.title}</h1>
          <div className="flex items-center space-x-4 text-muted mb-6">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {tour.durationValue} {tour.durationUnit}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {tour.language}
            </span>
          </div>

          <ImageGallery images={images} coverImage={tour.coverImage} />

          <div className="mt-8">
            <h2 className="font-title text-2xl font-bold mb-4">Descrizione</h2>
            <p className="text-muted leading-relaxed">{tour.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-title text-2xl font-bold mb-4">Itinerario</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">
              {tour.itinerary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="font-bold mb-3 flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                Include
              </h3>
              <ul className="space-y-2">
                {includes.map((item: string, index: number) => (
                  <li key={index} className="text-muted flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 flex items-center">
                <X className="w-5 h-5 text-red-600 mr-2" />
                Non Include
              </h3>
              <ul className="space-y-2">
                {excludes.map((item: string, index: number) => (
                  <li key={index} className="text-muted flex items-center">
                    <X className="w-4 h-4 text-red-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {tour.terms && (
            <div className="mt-8">
              <h2 className="font-title text-2xl font-bold mb-4">Termini e Condizioni</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line">{tour.terms}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="mb-6">
              <div className="text-4xl font-bold text-accent mb-2">
                €{selectedDate?.priceOverride || tour.priceAdult}
              </div>
              <p className="text-sm text-muted">a persona (adulto)</p>
              {tour.priceChild > 0 && (
                <p className="text-sm text-muted mt-1">
                  €{tour.priceChild} per bambino
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Date Disponibili
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tour.tourDates?.map((date: any) => (
                  <button
                    key={date.id}
                    onClick={() => setSelectedDate(date)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedDate?.id === date.id
                        ? 'border-accent bg-accent/10'
                        : 'border-muted hover:border-accent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {format(new Date(date.dateStart), 'dd MMMM yyyy', { locale: it })}
                        </p>
                        {date.dateEnd && (
                          <p className="text-sm text-muted">
                            fino a {format(new Date(date.dateEnd), 'dd MMMM', { locale: it })}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            date.availableSeats === 0
                              ? 'text-red-600'
                              : date.availableSeats <= 10
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}
                        >
                          {date.availableSeats === 0
                            ? 'Esaurito'
                            : `${date.availableSeats} posti`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && selectedDate.availableSeats > 0 && (
              <button onClick={handleBook} className="btn-primary w-full">
                Prenota Ora
              </button>
            )}

            {selectedDate && selectedDate.availableSeats === 0 && (
              <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                Esaurito
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

