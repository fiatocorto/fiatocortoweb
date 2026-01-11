import { Link } from 'react-router-dom';
import { Calendar, Users, Star, ArrowRight, ArrowLeft, User, ChevronLeft, ChevronRight, BadgeCheck, Compass, Mountain, Route, Shield } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import api from '../utils/api';
import CardTour from '../components/CardTour';
import Footer from '../components/Footer';

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(1); // Inizia da 1 perché la prima è la slide duplicata
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentNextAdventuresIndex, setCurrentNextAdventuresIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const adventuresCarouselRef = useRef<HTMLDivElement>(null);
  const reviewsCarouselRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [reviewGap, setReviewGap] = useState(1); // Gap in rem
  
  const reviews = [
    {
      name: 'Giulia B.',
      rating: 5,
      text: 'Esperienza fantastica! La guida era preparatissima e i panorami mozzafiato.',
      location: 'Palermo, Sicilia',
    },
    {
      name: 'Marco R.',
      rating: 5,
      text: 'Organizzazione perfetta, tutto è andato liscio. Consigliatissimo!',
      location: 'Catania, Sicilia',
    },
    {
      name: 'Sara M.',
      rating: 5,
      text: 'Una delle migliori escursioni che abbia mai fatto. Tornerò sicuramente!',
      location: 'Messina, Sicilia',
    },
    {
      name: 'Luca T.',
      rating: 5,
      text: 'Guida professionale e panorami spettacolari. Esperienza da ripetere!',
      location: 'Trapani, Sicilia',
    },
    {
      name: 'Elena F.',
      rating: 5,
      text: 'Tutto perfetto, dalla prenotazione all\'escursione. Super consigliato!',
      location: 'Agrigento, Sicilia',
    },
  ];
  
  const slides = [
    {
      title: 'Respira l\'avventura',
      subtitle: 'Scopri escursioni uniche nella natura, dai sentieri più selvaggi alle vette panoramiche',
      buttonText: 'Esplora i tour',
      buttonLink: '/tours',
      backgroundImage: '/resources/2147665051.jpg',
    },
    {
      title: 'Vivi ogni passo',
      subtitle: 'Ogni escursione è un viaggio emozionante tra natura, storia e cultura locale',
      buttonText: 'Le escursioni',
      buttonLink: '/tours',
      backgroundImage: '/resources/11514.jpg',
    },
    {
      title: 'Viaggia con noi',
      subtitle: 'Un team di appassionati di trekking che ti guida in esperienze uniche tra natura e panorami mozzafiato',
      buttonText: 'Chi siamo',
      buttonLink: '/about',
      backgroundImage: '/resources/28088.jpg',
    },
  ];

  const stats = [
    {
      targetValue: 280,
      suffix: '+',
      label: 'Escursionisti',
      icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#fbb017]" />,
    },
    {
      targetValue: 30,
      suffix: '+',
      label: 'Montagne conquistate',
      icon: <Mountain className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#fbb017]" />,
    },
    {
      targetValue: 2400,
      suffix: '',
      label: 'Km percorsi',
      icon: <Route className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#fbb017]" />,
    },
  ];

  // Calcola l'indice reale della slide per ottenere l'immagine di sfondo corretta
  const getRealSlideIndex = () => {
    if (currentSlide === 0) return slides.length - 1;
    if (currentSlide > slides.length) return 0;
    return currentSlide - 1;
  };

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 5000); // Cambia slide ogni 5 secondi

    return () => clearInterval(interval);
  }, [slides.length]);

  // Gestisce il reset quando arriva alla slide duplicata
  useEffect(() => {
    if (currentSlide > slides.length) {
      // Quando arriva alla slide duplicata, aspetta che l'animazione finisca
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1); // Resetta alla prima slide reale
        // Riabilita la transizione dopo un breve delay
        setTimeout(() => setIsTransitioning(true), 50);
      }, 1000); // Aspetta che l'animazione finisca (1 secondo)

      return () => clearTimeout(timer);
    }
  }, [currentSlide, slides.length]);

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

  // Animazione contatore per le statistiche
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Anima ogni statistica
            stats.forEach((stat, index) => {
              const duration = 1200; // 1.2 secondi
              let current = 0;
              const startTime = Date.now();
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Usa easing function per animazione più smooth (ease-out)
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                current = stat.targetValue * easedProgress;
                
                setAnimatedStats((prev) => {
                  const newStats = [...prev];
                  newStats[index] = Math.floor(current);
                  return newStats;
                });
                
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  setAnimatedStats((prev) => {
                    const newStats = [...prev];
                    newStats[index] = stat.targetValue;
                    return newStats;
                  });
                }
              };
              
              requestAnimationFrame(animate);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => {
      if (statsSectionRef.current) {
        observer.unobserve(statsSectionRef.current);
      }
    };
  }, [hasAnimated, stats]);

  // Filtra le 6 escursioni successive alla data corrente
  const upcomingTours = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset ore per confronto corretto
    
    return tours
      .filter(tour => {
        if (!tour.dateStart) return false;
        const tourDate = new Date(tour.dateStart);
        tourDate.setHours(0, 0, 0, 0);
        return tourDate >= now; // Solo tour futuri o di oggi
      })
      .sort((a, b) => {
        // Ordina per data crescente
        const dateA = new Date(a.dateStart).getTime();
        const dateB = new Date(b.dateStart).getTime();
        return dateA - dateB;
      })
      .slice(0, 6); // Prendi le prime 6
  }, [tours]);

  // Calcola il gap per il carousel delle recensioni
  useEffect(() => {
    const updateGap = () => {
      const gap = window.innerWidth >= 640 ? 1.5 : 1; // 1.5rem per sm+, 1rem per mobile
      setReviewGap(gap);
    };
    
    updateGap();
    window.addEventListener('resize', updateGap);
    return () => window.removeEventListener('resize', updateGap);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[calc(100vh-120px)] flex items-center justify-center text-white overflow-hidden">
        {/* Background images carousel */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => {
            const realIndex = index;
            const isActive = getRealSlideIndex() === realIndex;
            return (
              <div
                key={index}
                className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  opacity: isActive ? 1 : 0,
                  transition: isTransitioning ? 'opacity 1s ease-in-out' : 'none',
                  zIndex: isActive ? 1 : 0,
                }}
              />
            );
          })}
          {/* Duplica la prima immagine per il loop */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${slides[0].backgroundImage})`,
              opacity: getRealSlideIndex() === 0 && currentSlide > slides.length ? 1 : 0,
              transition: isTransitioning ? 'opacity 1s ease-in-out' : 'none',
              zIndex: getRealSlideIndex() === 0 && currentSlide > slides.length ? 1 : 0,
            }}
          />
        </div>
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            backgroundImage: 'linear-gradient(rgb(15 23 42 / 0%), rgb(0 21 67 / 65%))'
          }} 
        />
        
        {/* Carousel */}
        <div className="relative z-10 w-full h-full overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex h-full"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
            }}
          >
            {/* Duplica l'ultima slide all'inizio per il loop infinito */}
            {slides[slides.length - 1] && (
              <div
                className="min-w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px] font-bold mb-2 sm:mb-3 md:mb-4">{slides[slides.length - 1].title}</h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 px-4">{slides[slides.length - 1].subtitle}</p>
                <Link
                  to={slides[slides.length - 1].buttonLink}
                  className="btn-primary text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 flex items-center gap-2"
                >
                  {slides[slides.length - 1].buttonText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            )}
            {/* Slide originali */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px] font-bold mb-2 sm:mb-3 md:mb-4">{slide.title}</h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 px-4">{slide.subtitle}</p>
                <Link
                  to={slide.buttonLink}
                  className="btn-primary text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 flex items-center gap-2"
                >
                  {slide.buttonText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
              </div>
            ))}
            {/* Duplica la prima slide alla fine per il loop infinito */}
            {slides[0] && (
              <div
                className="min-w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px] font-bold mb-2 sm:mb-3 md:mb-4">{slides[0].title}</h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 px-4">{slides[0].subtitle}</p>
                <Link
                  to={slides[0].buttonLink}
                  className="btn-primary text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 flex items-center gap-2"
                >
                  {slides[0].buttonText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            )}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-row space-x-2">
            {slides.map((_, index) => {
              // Calcola l'indice reale considerando che currentSlide parte da 1
              const realIndex = currentSlide === 0 ? slides.length - 1 : (currentSlide - 1) % slides.length;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentSlide(index + 1); // +1 perché la prima slide è duplicata
                  }}
                  className={`h-2 sm:h-3 rounded-full transition-all ${
                    index === realIndex ? 'bg-accent w-6 sm:w-8' : 'bg-white/50 w-2 sm:w-3'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Numeri chiave */}
      <section ref={statsSectionRef} className="w-full bg-[#0f172a] py-6 sm:py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-4 sm:gap-5"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#272728] flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-white leading-tight">
                    {animatedStats[index]}{stat.suffix}
                  </div>
                  <div className="text-xl text-white/80 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prossime avventure */}
      {upcomingTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
              <img 
                src="/resources/Icona Gialla.png" 
                alt="" 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
              />
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative">
                Prossime avventure
              </h2>
            </div>
          </div>
          <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="overflow-hidden py-4 sm:py-6 md:py-10">
              <div 
                ref={adventuresCarouselRef}
                className="flex gap-4 sm:gap-4 lg:gap-6 transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(calc(-${currentNextAdventuresIndex} * (calc((100% - 3rem) / 3) + 1.5rem)))`
                }}
              >
                {upcomingTours.map((tour) => (
                  <div key={tour.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-[calc((100%-3rem)/3)]">
                    <CardTour tour={tour} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons - solo se ci sono più di 3 tour */}
            {upcomingTours.length > 3 && (
              <>
                <button
                  onClick={() => {
                    setCurrentNextAdventuresIndex((prev) => {
                      const maxIndex = Math.max(0, upcomingTours.length - 3);
                      if (prev === 0) return maxIndex;
                      return prev - 1;
                    });
                  }}
                  className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                  aria-label="Card precedente"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </button>
                <button
                  onClick={() => {
                    setCurrentNextAdventuresIndex((prev) => {
                      const maxIndex = Math.max(0, upcomingTours.length - 3);
                      if (prev >= maxIndex) return 0;
                      return prev + 1;
                    });
                  }}
                  className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                  aria-label="Card successiva"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </button>
              </>
            )}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link to="/tours" className="btn-secondary text-sm sm:text-base">
              Vedi tutte le escursioni
            </Link>
          </div>
        </section>
      )}

      {/* Chi siamo */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative overflow-hidden">
        <img
          src="/resources/plane shape.png"
          alt=""
          className="absolute -bottom-8 sm:-bottom-12 md:-bottom-16 lg:-bottom-24 -right-16 sm:-right-24 md:-right-32 lg:-right-48 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-contain z-10 pointer-events-none opacity-50 sm:opacity-75 md:opacity-100"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Immagine a sinistra */}
          <div className="order-2 md:order-1 relative flex justify-center md:justify-start">
            {/* Prima immagine - rettangolare in altezza */}
            <img
              src="/resources/11514.jpg"
              alt="Chi siamo"
              className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[440px] h-auto aspect-[440/588] object-cover rounded-t-lg rounded-b-full"
            />
            {/* Seconda immagine - rotonda e sovrapposta */}
            <img
              src="/resources/28088.jpg"
              alt=""
              className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -right-4 sm:-right-6 md:-right-8 w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full object-cover border-2 sm:border-3 md:border-4 border-white"
            />
          </div>
          
          {/* Contenuto a destra */}
          <div className="order-1 md:order-2">
            <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
              CHI SIAMO
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative">
                Vivi esperienze uniche con noi
              </h2>
            </div>
            <p className="text-muted mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg">
              Siamo un team di appassionati di trekking e natura, dedicati a offrirti esperienze uniche e indimenticabili. La nostra missione è guidarti alla scoperta dei luoghi più belli e suggestivi, condividendo la nostra passione per l'avventura e il rispetto per l'ambiente.
            </p>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                'Esperienze autentiche',
                'Professionalità',
                'Emozioni condivise'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              Chi Siamo
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Le nostre vette */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Contenuto a sinistra */}
            <div>
              <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
                MONTI E VETTE
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
                <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative">
                  Le nostre vette
                </h2>
              </div>
              <p className="text-muted mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg max-w-lg">
                Conquista le vette più iconiche della Sicilia con le nostre escursioni guidate. Dalle cime più alte delle Madonie alle rocce scoscese, ogni vetta ti regalerà panorami unici e un senso di conquista indimenticabile.
              </p>
              <Link 
                to="/tours" 
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-gray-800 font-medium rounded-full transition-colors text-sm sm:text-base"
                style={{ 
                  backgroundColor: '#f2f2f2'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fbb017';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f2f2f2';
                }}
              >
                Portami lì
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
            
            {/* Foto a destra */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Prima foto */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
                <img
                  src="/resources/carbonara.webp"
                  alt="Vetta"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl sm:rounded-3xl"
                />
                <div 
                  className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4"
                  style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                  }}
                >
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">Pizzo Carbonara</h3>
                </div>
              </div>
              
              {/* Seconda foto */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
                <img
                  src="/resources/roccabus.webp"
                  alt="Vetta"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl sm:rounded-3xl"
                />
                <div 
                  className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4"
                  style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                  }}
                >
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">Rocca Busambra</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tre foto aggiuntive */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Foto a sinistra */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
              <img
                src="/resources/cofano.jpg"
                alt="Vetta"
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl sm:rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">Monte Cofano</h3>
              </div>
            </div>
            
            {/* Foto centrale */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden sm:col-span-2 md:col-span-1">
              <img
                src="/resources/cammarata.jpg"
                alt="Vetta"
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl sm:rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">Monte Cammarata</h3>
              </div>
            </div>
            
            {/* Foto a destra */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden sm:col-span-1">
              <img
                src="/resources/pellegrino.jpg"
                alt="Vetta"
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl sm:rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">Monte Pellegrino</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
              <img 
                src="/resources/Icona Gialla.png" 
                alt="" 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
              />
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative">
                Perché sceglierci?
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />,
              title: 'Guide esperte e professionali',
              description:
                'Guide certificate che ti accompagnano in sicurezza attraverso i sentieri più belli della Sicilia.',
            },
            {
              icon: <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />,
              title: 'Passione per la montagna',
              description:
                'Conosciamo ogni sentiero e ogni vetta. La nostra passione si trasforma in esperienze autentiche.',
            },
            {
              icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />,
              title: 'Sicurezza al primo posto',
              description:
                'Attrezzature professionali, percorsi testati e gruppi ridotti per la massima sicurezza.',
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="bg-white rounded-full p-3 sm:p-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative group">
                  {step.icon}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-3 sm:-m-4"></div>
                </div>
              </div>
              <h3 className="font-title text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted text-sm sm:text-base max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Viaggiare con standard più elevati */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Contenuto a sinistra */}
            <div>
              <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
                Appassionati di avventure
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
                <h2 className="font-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-bold relative">
                  Trekking in montagna con passione e professionalità
                </h2>
              </div>
              <p className="text-muted mb-6 sm:mb-8 text-base sm:text-lg">
                Ogni escursione è pensata per offrirti un'esperienza autentica e sicura tra le vette siciliane. Le nostre guide esperte ti accompagnano alla scoperta di sentieri unici e panorami mozzafiato, garantendo sicurezza, professionalità e momenti indimenticabili immersi nella natura incontaminata.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Prima: icona + titolo */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-accent/10 rounded-full p-3 sm:p-4">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-title text-lg sm:text-xl font-bold">
                      Prenotazioni<br />facili
                    </h3>
                  </div>
                </div>
                
                {/* Seconda: icona + titolo */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-accent/10 rounded-full p-3 sm:p-4">
                      <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-title text-lg sm:text-xl font-bold">
                      Guide con<br />Esperienza
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Foto a destra */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
              <img
                src="/resources/IMG_5010.JPEG"
                alt="Escursione in montagna"
                className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="w-full relative py-16 sm:py-24 md:py-32">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/resources/testimonial-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Contenuto a sinistra */}
            <div>
              <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
                TESTIMONIANZE
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
                <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative">
                  Cosa ne pensano i<br className="hidden sm:block" /> nostri clienti?
                </h2>
              </div>
              <p className="text-muted mb-6 sm:mb-8 text-base sm:text-lg max-w-lg">
                I nostri partecipanti ai trekking condividono le loro esperienze: appassionati di montagna, amanti della natura e avventurieri che hanno scelto di esplorare la Sicilia con noi. Le loro voci raccontano emozioni, panorami mozzafiato e momenti indimenticabili vissuti insieme.
              </p>
              
              {/* Navigation */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setCurrentReviewIndex((prev) => {
                      const maxIndex = reviews.length - 1;
                      if (prev === 0) return maxIndex;
                      return prev - 1;
                    });
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Recensione precedente"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => {
                    setCurrentReviewIndex((prev) => {
                      const maxIndex = reviews.length - 1;
                      if (prev >= maxIndex) return 0;
                      return prev + 1;
                    });
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Recensione successiva"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Carosello recensioni a destra */}
            <div className="relative">
              <div className="overflow-hidden py-4">
                <div 
                  ref={reviewsCarouselRef}
                  className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(calc(-${currentReviewIndex} * (100% + ${reviewGap}rem)))`
                  }}
                >
                  {reviews.map((review, index) => (
                    <div key={index} className="flex-shrink-0 w-full">
                      <div className="card p-6 sm:p-8 md:p-10 shadow-none h-full flex flex-col" style={{ filter: 'none' }}>
                        <div className="flex items-center mb-4 sm:mb-6">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-accent text-accent" />
                          ))}
                        </div>
                        <p className="text-muted mb-4 sm:mb-6 text-base sm:text-lg flex-grow">"{review.text}"</p>
                        <div className="border-t border-gray-200 mb-4 sm:mb-6"></div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm sm:text-base">{review.name}</p>
                            <p className="text-muted text-xs sm:text-sm">{review.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

