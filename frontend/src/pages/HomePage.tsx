import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Star, ArrowRight, ArrowLeft, User, ChevronLeft, ChevronRight, BadgeCheck, Compass, Mountain, Route, Shield } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Lottie from 'lottie-react';
import api from '../utils/api';
import CardTour from '../components/CardTour';
import Footer from '../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<any[]>([]);
  const [scrollDownAnimation, setScrollDownAnimation] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(1); // Inizia da 1 perché la prima è la slide duplicata
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentNextAdventuresIndex, setCurrentNextAdventuresIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const adventuresCarouselRef = useRef<HTMLDivElement>(null);
  const adventuresCarouselContainerRef = useRef<HTMLDivElement>(null);
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
      icon: <Users className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent" />,
    },
    {
      targetValue: 30,
      suffix: '+',
      label: 'Montagne conquistate',
      icon: <Mountain className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent" />,
    },
    {
      targetValue: 2400,
      suffix: '',
      label: 'Km percorsi',
      icon: <Route className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent" />,
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
    // Carica l'animazione Lottie
    fetch('/resources/Scroll Down.json')
      .then(res => res.json())
      .then(data => setScrollDownAnimation(data))
      .catch(err => console.error('Failed to load scroll animation:', err));
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
    <div className="bg-white -mt-20">
      {/* Nuova Hero Section con Video */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/resources/loopvideo.mp4" type="video/mp4" />
          Il tuo browser non supporta il tag video.
        </video>
        
        {/* Overlay verde scuro per leggibilità */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            backgroundImage: 'linear-gradient(rgb(0 0 0 / 50%), rgb(0 28 11 / 80%))'
          }} 
        />
        
        {/* Contenuto centrato */}
        <div className="relative z-20 text-center px-4 sm:px-6 md:px-8">
          <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
            <img 
              src="/resources/Icona Gialla.png" 
              alt="" 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
            />
          </div>
          <h1 className="text-[72px] font-medium mb-4 sm:mb-6 md:mb-8" style={{ fontFamily: 'Nohemi, sans-serif' }}>
            Vivi la montagna<br />in Sicilia
          </h1>
          
          {/* Barra di ricerca */}
           <form 
             className="w-full max-w-md mx-auto mb-6 sm:mb-8"
             onSubmit={(e) => {
               e.preventDefault();
               navigate('/tours');
             }}
          >
             <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg" style={{ padding: '8px 6px 8px 16px' }}>
               <img 
                 src="/resources/trekkingicon.svg" 
                 alt="" 
                 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
               />
               <span className="flex-1 text-primary text-sm sm:text-base ml-2 text-left">
                 Portami a esplorare le montagne
               </span>
               <button
                 type="submit"
                 className="flex items-center gap-2 bg-accent text-white rounded-full transition-colors font-medium text-sm sm:text-base group"
                 style={{ padding: '12px 24px' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = '#976e19';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = '';
                 }}
               >
                 <span>Esplora</span>
                 <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
               </button>
             </div>
          </form>
        </div>
        
        {/* Animazione Lottie Scroll Down */}
        {scrollDownAnimation && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <Lottie
              animationData={scrollDownAnimation}
              loop={true}
              style={{ width: 35, height: 55 }}
            />
          </div>
        )}
      </section>

      {/* Numeri chiave */}
      <section ref={statsSectionRef} className="w-full relative pt-24 pb-24" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative"
              >
                {/* Card con effetto glassmorphism e bordo accent */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/50 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
                  {/* Accent gradient glow on hover */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    {/* Icona */}
                    <div className="mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    
                    {/* Numero con gradiente accent */}
                    <div className="relative mb-2">
                      <div 
                        className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight"
                        style={{
                          fontFamily: 'Nohemi, sans-serif',
                          background: 'linear-gradient(135deg, #fbb017 0%, #ffd54f 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {animatedStats[index]}{stat.suffix}
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div className="text-lg sm:text-xl md:text-2xl font-semibold text-primary/80 group-hover:text-primary transition-colors duration-300" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Decorative element bottom right */}
                  <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prossime avventure */}
      {upcomingTours.length > 0 && (
        <section className="w-full pb-24" style={{ backgroundColor: '#f5f3ec' }}>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 sm:mb-5 md:mb-6">
              <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
                <img 
                  src="/resources/Icona Gialla.png" 
                  alt="" 
                  className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
                />
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                Le nostre prossime avventure
              </h2>
              </div>
            </div>
            <div 
              ref={adventuresCarouselContainerRef}
              className="relative px-4 sm:px-8 md:px-12 lg:px-16"
              onMouseMove={(e) => {
                if (!adventuresCarouselContainerRef.current || upcomingTours.length <= 5) return;
                const rect = adventuresCarouselContainerRef.current.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const width = rect.width;
                const threshold = 150; // Distanza dal bordo per attivare la freccia
                
                // Mostra freccia sinistra se il mouse è nei primi 150px
                setShowLeftArrow(mouseX < threshold);
                // Mostra freccia destra se il mouse è negli ultimi 150px
                setShowRightArrow(mouseX > width - threshold);
              }}
              onMouseLeave={() => {
                setShowLeftArrow(false);
                setShowRightArrow(false);
              }}
            >
              <div className="overflow-hidden py-4 sm:py-6 md:py-10">
                <div 
                  ref={adventuresCarouselRef}
                  className="flex gap-4 sm:gap-4 lg:gap-6 transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(calc(-${currentNextAdventuresIndex} * (calc((100% - 6rem) / 5) + 1.5rem)))`
                  }}
                >
                  {upcomingTours.map((tour) => (
                    <div key={tour.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-[calc((100%-6rem)/5)]">
                      <CardTour tour={tour} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation arrows - solo se ci sono più di 5 tour */}
              {upcomingTours.length > 5 && (
                <>
                  {/* Freccia sinistra */}
                  <button
                    onClick={() => {
                      setCurrentNextAdventuresIndex((prev) => {
                        const maxIndex = Math.max(0, upcomingTours.length - 5);
                        if (prev === 0) return maxIndex;
                        return prev - 1;
                      });
                    }}
                    className={`absolute left-0 top-0 h-full w-20 sm:w-24 md:w-28 flex items-center justify-start pl-4 sm:pl-6 md:pl-8 z-20 transition-opacity duration-300 ${
                      showLeftArrow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    aria-label="Card precedente"
                  >
                    {/* Sfondo verticale sfumato */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to right, #f5f3ec 0%, #f5f3ec 70%, rgba(245, 243, 236, 0.8) 70%, transparent 100%)',
                      }}
                    />
                    {/* Icona */}
                    <ChevronLeft className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary z-10" />
                  </button>
                  
                  {/* Freccia destra */}
                  <button
                    onClick={() => {
                      setCurrentNextAdventuresIndex((prev) => {
                        const maxIndex = Math.max(0, upcomingTours.length - 5);
                        if (prev >= maxIndex) return 0;
                        return prev + 1;
                      });
                    }}
                    className={`absolute right-0 top-0 h-full w-20 sm:w-24 md:w-28 flex items-center justify-end pr-4 sm:pr-6 md:pr-8 z-20 transition-opacity duration-300 ${
                      showRightArrow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    aria-label="Card successiva"
                  >
                    {/* Sfondo verticale sfumato */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to left, #f5f3ec 0%, #f5f3ec 70%, rgba(245, 243, 236, 0.8) 70%, transparent 100%)',
                      }}
                    />
                    {/* Icona */}
                    <ChevronRight className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary z-10" />
                  </button>
                </>
              )}
            </div>
            <div className="text-center mt-6 sm:mt-8">
              <Link 
                to="/tours" 
                className="btn-primary text-white text-sm sm:text-base px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 font-medium transition-colors inline-flex items-center gap-2 group" 
                style={{ borderRadius: '16px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#976e19';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                Mostra tutte
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Chi siamo */}
      <section className="w-full pt-24 pb-24 relative overflow-hidden" style={{ backgroundColor: '#f5f3ec' }}>
        <img
          src="/resources/plane shape.png"
          alt=""
          className="absolute -bottom-8 sm:-bottom-12 md:-bottom-16 lg:-bottom-24 -right-16 sm:-right-24 md:-right-32 lg:-right-48 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-contain z-10 pointer-events-none opacity-50 sm:opacity-75 md:opacity-100"
        />
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Immagine a sinistra */}
          <div className="order-2 md:order-1 relative flex justify-center md:justify-start">
            <div className="relative">
              {/* Riquadro marrone chiaro dietro */}
              <div 
                className="absolute top-0 left-0 w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] aspect-square rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] transform rotate-2"
                style={{ backgroundColor: '#d4a574', zIndex: 0 }}
              ></div>
              {/* Immagine quadrata */}
              <div className="relative transform -rotate-2" style={{ zIndex: 1 }}>
                <img
                  src="/resources/chisiamo.jpeg"
                  alt="Chi siamo"
                  className="w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] aspect-square object-cover object-bottom rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
                />
              </div>
            </div>
          </div>
          
          {/* Contenuto a destra */}
          <div className="order-1 md:order-2">
            <div className="mb-2">
              <img 
                src="/resources/Icona Gialla.png" 
                alt="Chi siamo" 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
              />
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                Vivi esperienze uniche con noi
              </h2>
            </div>
            <p className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg" style={{ color: '#1c1a18' }}>
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
                  <span className="text-sm sm:text-base" style={{ color: '#1c1a18' }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link 
              to="/about" 
              className="btn-primary text-white text-sm sm:text-base px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 font-medium transition-colors inline-flex items-center gap-2 group" 
              style={{ borderRadius: '16px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#976e19';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              Scopri chi siamo
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Le nostre vette */}
      <section className="w-full pt-24 pb-24 relative" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Contenuto a sinistra */}
            <div>
              <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
                MONTI E VETTE
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
                <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                  Le nostre vette
                </h2>
              </div>
              <p className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg max-w-lg" style={{ color: '#1c1a18' }}>
                Conquista le vette più iconiche della Sicilia con le nostre escursioni guidate. Dalle cime più alte delle Madonie alle rocce scoscese, ogni vetta ti regalerà panorami unici e un senso di conquista indimenticabile.
              </p>
              <Link 
                to="/tours" 
                className="btn-primary text-white text-sm sm:text-base px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 font-medium transition-colors inline-flex items-center gap-2 group" 
                style={{ borderRadius: '16px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#976e19';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                Portami lì
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Foto a destra */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Prima foto */}
              <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img
                  src="/resources/carbonara.webp"
                  alt="Vetta"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
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
              <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img
                  src="/resources/roccabus.webp"
                  alt="Vetta"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
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
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Foto a sinistra */}
            <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <img
                src="/resources/cofano.jpg"
                alt="Vetta"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
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
            <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden sm:col-span-2 md:col-span-1 transition-transform duration-300 hover:-translate-y-2">
              <img
                src="/resources/cammarata.jpg"
                alt="Vetta"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
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
            <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden sm:col-span-1 transition-transform duration-300 hover:-translate-y-2">
              <img
                src="/resources/pellegrino.jpg"
                alt="Vetta"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
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
      <section className="w-full relative pb-24">
        {/* Background image fixed */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/resources/2148106687.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            zIndex: 0
          }}
        />
        {/* Overlay con stesso stile della hero section */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            backgroundImage: 'linear-gradient(rgb(0 0 0 / 50%), rgb(0 28 11 / 80%))'
          }} 
        />
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-0 relative z-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
              <img 
                src="/resources/Icona Gialla.png" 
                alt="" 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
              />
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative text-white" style={{ fontFamily: 'Nohemi, sans-serif' }}>
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
            <div key={index} className="group relative">
              {/* Card con effetto glassmorphism e bordo accent */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/50 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 h-full flex flex-col">
                {/* Accent gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col items-center text-center">
                  {/* Icona */}
                  <div className="mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  
                  {/* Titolo */}
                  <div className="text-base sm:text-lg md:text-xl font-semibold group-hover:text-primary transition-colors duration-300 mb-2" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                    {step.title}
                  </div>
                  
                  {/* Descrizione */}
                  <p className="text-sm sm:text-base max-w-xs mx-auto flex-grow" style={{ color: '#1c1a18' }}>{step.description}</p>
                </div>
                
                {/* Decorative element bottom right */}
                <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Viaggiare con standard più elevati */}
      <section className="w-full pt-24 pb-24 relative" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Contenuto a sinistra */}
            <div>
              <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
                Appassionati di avventure
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
                <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                  Trekking in montagna con passione e professionalità
                </h2>
              </div>
              <p className="mb-6 sm:mb-8 text-base sm:text-lg" style={{ color: '#1c1a18' }}>
                Ogni escursione è pensata per offrirti un'esperienza autentica e sicura tra le vette siciliane. Le nostre guide esperte ti accompagnano alla scoperta di sentieri unici e panorami mozzafiato, garantendo sicurezza, professionalità e momenti indimenticabili immersi nella natura incontaminata.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {/* Prima: icona + titolo */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-accent/10 rounded-full p-4 sm:p-5 md:p-6">
                      <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-title text-lg sm:text-xl md:text-2xl font-bold" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                      Prenotazioni<br />facili
                    </h3>
                  </div>
                </div>
                
                {/* Seconda: icona + titolo */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-accent/10 rounded-full p-4 sm:p-5 md:p-6">
                      <Compass className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-title text-lg sm:text-xl md:text-2xl font-bold" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                      Guide con<br />Esperienza
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Foto a destra */}
            <div className="relative flex justify-center md:justify-end">
              <div className="relative">
                {/* Riquadro marrone chiaro dietro */}
                <div 
                  className="absolute top-0 left-0 w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] aspect-square rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] transform rotate-6"
                  style={{ backgroundColor: '#d4a574', zIndex: 0 }}
                ></div>
                {/* Immagine */}
                <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transform rotate-2" style={{ zIndex: 1 }}>
                  <img
                    src="/resources/IMG_5010.JPEG"
                    alt="Escursione in montagna"
                    className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] aspect-square object-cover rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="w-full relative pt-24 pb-24" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 sm:gap-16 md:gap-20 items-center">
            {/* Recensioni a sinistra - griglia 2x2 */}
            <div className="order-2 md:order-1 md:col-span-3 grid grid-cols-2 gap-4 sm:gap-6">
              {reviews.slice(0, 4).map((review, index) => (
                <div key={index} className="bg-white p-6 sm:p-8 md:p-10 shadow-lg h-full flex flex-col rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem]">
                  <div className="flex items-center mb-4 sm:mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted mb-4 sm:mb-6 text-base sm:text-lg flex-grow" style={{ color: '#1c1a18' }}>"{review.text}"</p>
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
              ))}
            </div>
            
            {/* Contenuto a destra */}
            <div className="order-1 md:order-2 md:col-span-2">
              <div className="mb-4 sm:mb-5 md:mb-6">
                <img 
                  src="/resources/Icona Gialla.png" 
                  alt="" 
                  className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain mb-4 sm:mb-5 md:mb-6"
                />
              </div>
              <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
                <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
                <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                  Cosa ne pensano i<br className="hidden sm:block" /> nostri clienti?
                </h2>
              </div>
              <p className="text-muted mb-6 sm:mb-8 text-base sm:text-lg max-w-lg" style={{ color: '#1c1a18' }}>
                I nostri partecipanti ai trekking condividono le loro esperienze: appassionati di montagna, amanti della natura e avventurieri che hanno scelto di esplorare la Sicilia con noi. Le loro voci raccontano emozioni, panorami mozzafiato e momenti indimenticabili vissuti insieme.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

