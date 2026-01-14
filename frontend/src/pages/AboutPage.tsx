import { Link } from 'react-router-dom';
import { BadgeCheck, Heart, Shield, MapPin, ArrowRight, Calendar, Compass } from 'lucide-react';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <>
      <div className="bg-white -mt-20">
      {/* Hero Section con Immagine */}
      <section className="relative h-[33vh] flex items-center justify-center text-white overflow-hidden">
        {/* Immagine Background */}
        <img
          src="/resources/2148106687.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
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
            Chi siamo
          </h1>
        </div>
      </section>

      {/* Chi siamo - Sezione principale */}
      <section className="w-full pt-24 pb-24 relative overflow-hidden" style={{ backgroundColor: '#f5f3ec' }}>
        <img
          src="/resources/plane shape.png"
          alt=""
          className="absolute -bottom-8 sm:-bottom-12 md:-bottom-16 lg:-bottom-24 -right-16 sm:-right-24 md:-right-32 lg:-right-48 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-contain z-10 pointer-events-none opacity-50 sm:opacity-75 md:opacity-100"
        />
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center">
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
                  Siamo appassionati di trekking e natura
                </h2>
              </div>
              <p className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg" style={{ color: '#1c1a18' }}>
                Siamo un team di appassionati di trekking e natura, dedicati a offrirti esperienze uniche e indimenticabili. La nostra missione è guidarti alla scoperta dei luoghi più belli e suggestivi della Sicilia, condividendo la nostra passione per l'avventura e il rispetto per l'ambiente.
              </p>
              <p className="mb-6 sm:mb-8 text-base sm:text-lg" style={{ color: '#1c1a18' }}>
                Ogni escursione è pensata per offrirti il massimo del comfort senza rinunciare all'autenticità dell'esperienza. Le nostre guide esperte ti accompagnano alla scoperta di luoghi unici, garantendo sicurezza, professionalità e momenti indimenticabili immersi nella natura siciliana.
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
            </div>
          </div>
        </div>
      </section>

      {/* La nostra missione - Perché sceglierci */}
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
              icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />,
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



      {/* Mappa Sicilia */}
      <section className="w-full pt-24 pb-24 relative" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
              DOVE CI TROVIAMO
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                La Sicilia, la nostra casa
              </h2>
            </div>
            <p className="text-base sm:text-lg max-w-3xl mx-auto px-4" style={{ color: '#1c1a18' }}>
              Operiamo in tutta la Sicilia, organizzando escursioni e trekking nelle zone più belle e suggestive dell'isola. Ma a breve ci spingeremo oltre, verso le altre regioni italiane e all'estero.
            </p>
          </div>
          
          <div className="relative rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-lg" style={{ height: '300px', minHeight: '300px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966871.7429994894!2d13.33524656638108!3d37.536609845059594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13106268d05359b3%3A0x10b042967b67d50!2sSicilia!5e0!3m2!1sit!2sit!4v1762819720664!5m2!1sit!2sitnav"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa Sicilia"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full pt-24 pb-24 relative" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-accent uppercase font-semibold mb-2 text-sm sm:text-base">
              PRONTO PER L'AVVENTURA?
            </div>
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                Inizia la tua esperienza oggi
              </h2>
            </div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4" style={{ color: '#1c1a18' }}>
              Unisciti a noi per scoprire le meraviglie della Sicilia attraverso escursioni uniche e indimenticabili. La tua prossima avventura ti aspetta!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
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
                Esplora i tour
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/contacts" 
                className="text-sm sm:text-base px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 font-medium transition-colors inline-flex items-center gap-2 group border-2 border-accent text-accent hover:bg-accent hover:text-white" 
                style={{ borderRadius: '16px' }}
              >
                Contattaci
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      </div>
    </>
  );
}

