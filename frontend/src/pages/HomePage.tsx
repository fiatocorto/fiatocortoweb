import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Plus, Minus, User, Baby, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { it } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../utils/api';
import CardTour from '../components/CardTour';
import Footer from '../components/Footer';

registerLocale('it', it);

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [searchForm, setSearchForm] = useState({
    destination: '',
    adults: 1,
    children: 0,
    date: getTodayDate(),
  });

  const [datePickerDate, setDatePickerDate] = useState<Date | null>(
    searchForm.date ? new Date(searchForm.date) : new Date()
  );

  const [calendarViewDate, setCalendarViewDate] = useState<Date>(
    searchForm.date ? new Date(searchForm.date) : new Date()
  );

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const formatMonth = (date: Date): string => {
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return months[date.getMonth()];
  };

  const slides = [
    {
      title: 'Respira l\'avventura',
      subtitle: 'Scopri escursioni uniche nella natura, dai sentieri più selvaggi alle vette panoramiche',
      buttonText: 'Esplora i tour',
      buttonLink: '/tours',
    },
    {
      title: 'Vivi ogni passo',
      subtitle: 'Ogni escursione è un viaggio emozionante tra natura, storia e cultura locale',
      buttonText: 'Le escursioni',
      buttonLink: '/tours',
    },
    {
      title: 'Viaggia con noi',
      subtitle: 'Un team di appassionati di trekking che ti guida in esperienze uniche tra natura e panorami mozzafiato',
      buttonText: 'Chi siamo',
      buttonLink: '/about',
    },
  ];

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Cambia slide ogni 5 secondi

    return () => clearInterval(interval);
  }, [slides.length]);

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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-120px)] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/resources/11514.jpg)',
            backgroundPosition: 'center center',
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: 'linear-gradient(rgb(15 23 42 / 0%), rgb(0 21 67 / 65%))'
            }} 
          />
        </div>
        
        {/* Carousel */}
        <div className="relative z-10 w-full h-full overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full flex flex-col items-center justify-center text-center px-4"
              >
                <h1 className="text-[100px] font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                <Link
                  to={slide.buttonLink}
                  className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
                >
                  {slide.buttonText}
                  <ArrowRight className="w-5 h-5" />
          </Link>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-accent w-8' : 'bg-white/50 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="w-full">
        <div className="bg-[#0f172a] p-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-16 w-full px-4 sm:px-6 lg:px-8 justify-center items-center">
            <div className="flex-shrink-0">
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Destinazione
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Dove vuoi andare?"
                  className="w-auto min-w-[300px] pl-10 pr-4 h-[60px] bg-[#1e293b] rounded-lg focus:outline-none text-white placeholder:text-gray-400"
                  value={searchForm.destination}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, destination: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="h-16 border-l border-white/10 self-center"></div>
            <div className="flex-shrink-0">
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Adulti
              </label>
              <div className="flex items-center justify-center gap-4">
                <User className="w-8 h-8 text-accent flex-shrink-0" />
                <span className="text-[60px] font-medium text-white text-center" style={{ fontSize: '60px', lineHeight: '1' }}>
                  {searchForm.adults}
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setSearchForm({ ...searchForm, adults: searchForm.adults + 1 })}
                    className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchForm({ ...searchForm, adults: Math.max(1, searchForm.adults - 1) })}
                    className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-16 border-l border-white/10 self-center"></div>
            <div className="flex-shrink-0">
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Bambini
              </label>
              <div className="flex items-center justify-center gap-4">
                <Baby className="w-8 h-8 text-accent flex-shrink-0" />
                <span className="text-[60px] font-medium text-white text-center" style={{ fontSize: '60px', lineHeight: '1' }}>
                  {searchForm.children}
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setSearchForm({ ...searchForm, children: searchForm.children + 1 })}
                    className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchForm({ ...searchForm, children: Math.max(0, searchForm.children - 1) })}
                    className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-16 border-l border-white/10 self-center"></div>
            <div className="flex-shrink-0">
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Data
              </label>
              <div className="flex items-center justify-center gap-4">
                <Calendar className="w-8 h-8 text-accent flex-shrink-0" />
                <div className="flex-shrink-0">
                  <DatePicker
                    key={`${calendarViewDate.getFullYear()}-${calendarViewDate.getMonth()}`}
                    selected={datePickerDate}
                    open={isDatePickerOpen}
                    onInputClick={() => setIsDatePickerOpen(true)}
                    onCalendarOpen={() => setIsDatePickerOpen(true)}
                    onCalendarClose={() => setIsDatePickerOpen(false)}
                    onChange={(date: Date | null) => {
                      setDatePickerDate(date);
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setSearchForm({ ...searchForm, date: `${year}-${month}-${day}` });
                      }
                    }}
                    onMonthChange={(date: Date) => {
                      setCalendarViewDate(date);
                      setDatePickerDate(date);
                    }}
                    onYearChange={(date: Date) => {
                      setCalendarViewDate(date);
                      setDatePickerDate(date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    calendarStartDay={1}
                    locale="it"
                    className="flex-shrink-0"
                    popperClassName="z-[9999]"
                    shouldCloseOnSelect={false}
                  formatWeekDay={(name) => {
                    const short = name.substring(0, 3);
                    return short.charAt(0).toUpperCase() + short.slice(1);
                  }}
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    decreaseYear,
                    increaseYear,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => {
                    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                                   'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
                    const today = new Date();
                    const currentYear = today.getFullYear();
                    const currentMonth = today.getMonth();
                    const isCurrentYear = date.getFullYear() === currentYear;
                    const isCurrentMonth = isCurrentYear && date.getMonth() === currentMonth;
                    const isYearDisabled = date.getFullYear() <= currentYear;
                    const isMonthDisabled = isCurrentYear && date.getMonth() <= currentMonth;
                    
                    return (
                      <div className="react-datepicker__header-custom">
                        <div className="flex items-center justify-between px-2 pb-2">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (!isYearDisabled) {
                                decreaseYear();
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            disabled={isYearDisabled}
                            className="react-datepicker__navigation react-datepicker__navigation--previous w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Anno precedente"
                          >
                            <ChevronLeft className="w-5 h-5 text-black" />
                          </button>
                          <div className="flex items-center gap-3">
                            <select
                              value={date.getMonth()}
                              onChange={(e) => {
                                const newDate = new Date(date);
                                const newMonth = parseInt(e.target.value);
                                newDate.setMonth(newMonth);
                                // Assicurati che il giorno sia valido per il nuovo mese
                                const lastDayOfMonth = new Date(newDate.getFullYear(), newMonth + 1, 0).getDate();
                                if (newDate.getDate() > lastDayOfMonth) {
                                  newDate.setDate(lastDayOfMonth);
                                }
                                setCalendarViewDate(newDate);
                                setDatePickerDate(newDate);
                                const year = newDate.getFullYear();
                                const month = String(newDate.getMonth() + 1).padStart(2, '0');
                                const day = String(newDate.getDate()).padStart(2, '0');
                                setSearchForm({ 
                                  ...searchForm, 
                                  date: `${year}-${month}-${day}` 
                                });
                              }}
                              className="react-datepicker__month-select"
                            >
                              {months.map((month, index) => {
                                const isMonthOptionDisabled = isCurrentYear && index < currentMonth;
                                return (
                                  <option key={index} value={index} disabled={isMonthOptionDisabled}>
                                    {month}
                                  </option>
                                );
                              })}
                            </select>
                            <select
                              value={date.getFullYear()}
                              onChange={(e) => {
                                const newDate = new Date(date);
                                newDate.setFullYear(parseInt(e.target.value));
                                setCalendarViewDate(newDate);
                                setDatePickerDate(newDate);
                                const year = newDate.getFullYear();
                                const month = String(newDate.getMonth() + 1).padStart(2, '0');
                                const day = String(newDate.getDate()).padStart(2, '0');
                                setSearchForm({ 
                                  ...searchForm, 
                                  date: `${year}-${month}-${day}` 
                                });
                              }}
                              className="react-datepicker__year-select"
                            >
                              {Array.from({ length: 6 }, (_, i) => currentYear + i).map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              increaseYear();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            className="react-datepicker__navigation react-datepicker__navigation--next w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                            aria-label="Anno successivo"
                          >
                            <ChevronRight className="w-5 h-5 text-black" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-2">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (!isMonthDisabled) {
                                decreaseMonth();
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            disabled={isMonthDisabled}
                            className="react-datepicker__navigation react-datepicker__navigation--previous w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Mese precedente"
                          >
                            <ChevronLeft className="w-5 h-5 text-black" />
                          </button>
                          <div className="flex-1"></div>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              increaseMonth();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            className="react-datepicker__navigation react-datepicker__navigation--next w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                            aria-label="Mese successivo"
                          >
                            <ChevronRight className="w-5 h-5 text-black" />
                          </button>
                        </div>
                      </div>
                    );
                  }}
                  customInput={
                    <div className="flex items-center justify-center gap-4 cursor-pointer py-0">
                      {searchForm.date ? (
                        <>
                          <span className="text-[60px] font-medium text-white leading-none" style={{ fontSize: '60px', lineHeight: '1' }}>
                            {new Date(searchForm.date).getDate()}
                          </span>
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-base text-gray-300">
                              {formatMonth(new Date(searchForm.date))}
                            </span>
                            <span className="text-base text-gray-300">
                              {new Date(searchForm.date).getFullYear()}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Seleziona data</span>
                      )}
                    </div>
                }
                  />
                </div>
            </div>
            </div>
            <div className="flex items-center justify-center">
              <button type="submit" className="btn-primary w-full md:w-auto px-16 py-5">
                <Search className="w-5 h-5 inline mr-2" />
                Cerca
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Chi siamo */}
      <section className="w-full py-32 relative">
        <img
          src="/resources/plane shape.png"
          alt=""
          className="absolute -bottom-16 md:-bottom-24 -right-32 md:-right-48 w-96 h-96 md:w-[500px] md:h-[500px] object-contain z-10 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Immagine a sinistra */}
          <div className="order-2 md:order-1 relative">
            {/* Prima immagine - rettangolare in altezza */}
            <img
              src="/resources/11514.jpg"
              alt="Chi siamo"
              className="w-[440px] h-[588px] object-cover rounded-t-lg rounded-b-full"
            />
            {/* Seconda immagine - rotonda e sovrapposta */}
            <img
              src="/resources/28088.jpg"
              alt=""
              className="absolute -bottom-8 -right-8 w-[350px] h-[350px] rounded-full object-cover border-4 border-white"
            />
          </div>
          
          {/* Contenuto a destra */}
          <div className="order-1 md:order-2">
            <div className="text-accent uppercase font-semibold mb-2">
              CHI SIAMO
            </div>
            <div className="relative inline-block mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
              <h2 className="font-title text-[48px] font-bold relative">
                Vivi esperienze uniche con noi
              </h2>
            </div>
            <p className="text-muted mb-6 text-lg">
              Siamo un team di appassionati di trekking e natura, dedicati a offrirti esperienze uniche e indimenticabili. La nostra missione è guidarti alla scoperta dei luoghi più belli e suggestivi, condividendo la nostra passione per l'avventura e il rispetto per l'ambiente.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Esperienze autentiche',
                'Professionalità',
                'Emozioni condivise'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <BadgeCheck className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-primary inline-flex items-center gap-2">
              Chi Siamo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* best choices */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-accent uppercase font-semibold mb-2">
            ESCURSIONI
          </div>
          <div className="relative inline-block mb-6">
            <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
            <h2 className="font-title text-[48px] font-bold relative">
              Le più scelte
            </h2>
          </div>
        </div>
        <div className="relative px-16">
          <div className="overflow-hidden py-10 px-4">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(calc(-${currentTourIndex} * ((100% - 3rem) / 3 + 1.5rem)))`
              }}
            >
              {tours.slice(0, 5).map((tour) => (
                <div key={tour.id} className="flex-shrink-0" style={{ width: `calc((100% - 3rem) / 3)` }}>
                  <CardTour tour={tour} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button
            onClick={() => {
              setCurrentTourIndex((prev) => {
                if (prev === 0) return tours.slice(0, 5).length - 3;
                return prev - 1;
              });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            aria-label="Card precedente"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={() => {
              setCurrentTourIndex((prev) => {
                const maxIndex = tours.slice(0, 5).length - 3;
                if (prev >= maxIndex) return 0;
                return prev + 1;
              });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            aria-label="Card successiva"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>
        <div className="text-center mt-8">
          <Link to="/tours" className="btn-secondary">
            Vedi tutte le escursioni
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-32 relative">
        <div className="absolute inset-0" ></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/resources/24.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="text-accent uppercase font-semibold mb-2">
              PERCHÉ
            </div>
            <div className="relative inline-block mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
              <h2 className="font-title text-[48px] font-bold relative">
                Perché sceglierci?
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="w-8 h-8 text-accent" />,
              title: 'Scegli la tua avventura',
              description:
                'Esplora la nostra selezione di escursioni e trova quella perfetta per te.',
            },
            {
              icon: <Calendar className="w-8 h-8 text-accent" />,
              title: 'Prenota la data',
              description:
                'Seleziona la data che preferisci e completa la prenotazione in pochi click.',
            },
            {
              icon: <Users className="w-8 h-8 text-accent" />,
              title: 'Vivi l\'esperienza',
              description:
                'Parti per la tua avventura e crea ricordi indimenticabili.',
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4 w-20 h-20 flex items-center justify-center relative group">
                  {step.icon}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-4"></div>
                </div>
              </div>
              <h3 className="font-title text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 py-16">
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

