import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import CardTour from '../components/CardTour';
import Footer from '../components/Footer';

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);
  const [searchForm, setSearchForm] = useState({
    destination: '',
    adults: 1,
    children: 0,
    date: '',
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/api/tours');
      setTours(response.data.tours?.slice(0, 10) || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      // Continua comunque anche se l'API fallisce
      setTours([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to tours page with filters
    const params = new URLSearchParams();
    if (searchForm.destination) params.append('destination', searchForm.destination);
    if (searchForm.date) params.append('date', searchForm.date);
    window.location.href = `/tours?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <img 
            src="/resources/Bianco.png" 
            alt="Fiato Corto" 
            className="h-24 md:h-32 w-auto mx-auto mb-8"
          />
          <Link to="/tours" className="btn-primary text-lg px-8 py-4">
            Vedi Tour
          </Link>
        </div>
      </section>

      {/* Quick Search */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-20 relative z-20">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary mb-2">
                Destinazione
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Dove vuoi andare?"
                  className="w-full pl-10 pr-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  value={searchForm.destination}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, destination: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="md:w-32">
              <label className="block text-sm font-medium text-primary mb-2">
                Adulti
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchForm.adults}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, adults: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div className="md:w-32">
              <label className="block text-sm font-medium text-primary mb-2">
                Bambini
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchForm.children}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, children: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-primary mb-2">
                Data
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchForm.date}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, date: e.target.value })
                }
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full md:w-auto px-8">
                <Search className="w-5 h-5 inline mr-2" />
                Cerca
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-title text-4xl font-bold text-center mb-12">
          Destinazioni Top
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Monte Bianco', 'Cinque Terre', 'Lago di Como'].map((dest) => (
            <div key={dest} className="card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                alt={dest}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-title text-xl font-bold">{dest}</h3>
                <p className="text-sm text-muted mt-2">
                  Scopri le escursioni più belle in {dest}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tours Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-background">
        <h2 className="font-title text-4xl font-bold text-center mb-12">
          Escursioni Popolari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <CardTour key={tour.id} tour={tour} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/tours" className="btn-secondary">
            Vedi tutte le escursioni
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-title text-4xl font-bold text-center mb-12">
          Come Funziona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="w-12 h-12 text-accent" />,
              title: 'Scegli la tua avventura',
              description:
                'Esplora la nostra selezione di escursioni e trova quella perfetta per te.',
            },
            {
              icon: <Calendar className="w-12 h-12 text-accent" />,
              title: 'Prenota la data',
              description:
                'Seleziona la data che preferisci e completa la prenotazione in pochi click.',
            },
            {
              icon: <Users className="w-12 h-12 text-accent" />,
              title: 'Vivi l\'esperienza',
              description:
                'Parti per la tua avventura e crea ricordi indimenticabili.',
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="font-title text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-background">
        <h2 className="font-title text-4xl font-bold text-center mb-12">
          Cosa Dicono i Nostri Clienti
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Giulia B.',
              rating: 5,
              text: 'Esperienza fantastica! La guida era preparatissima e i panorami mozzafiato.',
            },
            {
              name: 'Marco R.',
              rating: 5,
              text: 'Organizzazione perfetta, tutto è andato liscio. Consigliatissimo!',
            },
            {
              name: 'Sara M.',
              rating: 5,
              text: 'Una delle migliori escursioni che abbia mai fatto. Tornerò sicuramente!',
            },
          ].map((review, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted mb-4">"{review.text}"</p>
              <p className="font-medium text-primary">— {review.name}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

