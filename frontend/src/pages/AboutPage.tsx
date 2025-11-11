import { Link } from 'react-router-dom';
import { BadgeCheck, Heart, Shield, MapPin, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/resources/IMG_5093.JPEG)',
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
        
        <div className="relative z-10 text-center px-4">
          <div className="text-accent uppercase font-semibold mb-4 text-lg">
            CHI SIAMO
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            Vivi esperienze uniche con noi
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Un team di appassionati di trekking che ti guida in esperienze uniche tra natura e panorami mozzafiato
          </p>
        </div>
      </section>

      {/* Chi siamo - Sezione principale */}
      <section className="w-full py-32 relative overflow-hidden">
        <img
          src="/resources/plane shape.png"
          alt=""
          className="absolute -bottom-16 md:-bottom-24 -right-32 md:-right-48 w-96 h-96 md:w-[500px] md:h-[500px] object-contain z-10 pointer-events-none opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Immagine a sinistra */}
            <div>
              <img
                src="/resources/IMG_5010.JPEG"
                alt="Chi siamo"
                className="w-full max-w-[500px] aspect-square object-cover rounded-3xl"
              />
            </div>
            
            {/* Contenuto a destra */}
            <div>
              <div className="text-accent uppercase font-semibold mb-2">
                LA NOSTRA STORIA
              </div>
              <div className="relative inline-block mb-6">
                <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
                <h2 className="font-title text-[48px] font-bold relative">
                  Siamo appassionati di trekking e natura
                </h2>
              </div>
              <p className="text-muted mb-6 text-lg">
                Siamo un team di appassionati di trekking e natura, dedicati a offrirti esperienze uniche e indimenticabili. La nostra missione è guidarti alla scoperta dei luoghi più belli e suggestivi della Sicilia, condividendo la nostra passione per l'avventura e il rispetto per l'ambiente.
              </p>
              <p className="text-muted mb-8 text-lg">
                Ogni escursione è pensata per offrirti il massimo del comfort senza rinunciare all'autenticità dell'esperienza. Le nostre guide esperte ti accompagnano alla scoperta di luoghi unici, garantendo sicurezza, professionalità e momenti indimenticabili immersi nella natura siciliana.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Esperienze autentiche',
                  'Professionalità',
                  'Emozioni condivise'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <BadgeCheck className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* La nostra missione */}
      <section className="w-full py-32 relative">
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
          <div className="text-center mb-16">
            <div className="text-accent uppercase font-semibold mb-2">
              MISSIONE
            </div>
            <div className="relative inline-block mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
              <h2 className="font-title text-[48px] font-bold relative">
                La nostra missione
              </h2>
            </div>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              Crediamo che ogni escursione sia un'opportunità per connettersi con la natura, scoprire nuovi orizzonti e creare ricordi indimenticabili. La nostra missione è rendere accessibile a tutti la bellezza della Sicilia attraverso esperienze autentiche e sicure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-accent" />,
                title: 'Passione',
                description: 'La nostra passione per la montagna e la natura si riflette in ogni escursione che organizziamo. Amiamo quello che facciamo e questo si sente.',
              },
              {
                icon: <Shield className="w-8 h-8 text-accent" />,
                title: 'Sicurezza',
                description: 'La sicurezza dei nostri partecipanti è la nostra priorità. Guide esperte e attrezzature adeguate per ogni tipo di escursione.',
              },
              {
                icon: <MapPin className="w-8 h-8 text-accent" />,
                title: 'Esperienza',
                description: 'Conosciamo ogni sentiero, ogni vetta e ogni angolo nascosto della Sicilia. La nostra esperienza è al tuo servizio.',
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-full p-4 w-20 h-20 flex items-center justify-center">
                    {value.icon}
                  </div>
                </div>
                <h3 className="font-title text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted max-w-xs mx-auto">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Le nostre destinazioni */}
      <section className="w-full py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-accent uppercase font-semibold mb-2">
              DESTINAZIONI
            </div>
            <div className="relative inline-block mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
              <h2 className="font-title text-[48px] font-bold relative">
                Esplora la Sicilia con noi
              </h2>
            </div>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              Dalle vette delle Madonie ai sentieri di Ficuzza, scopri paesaggi mozzafiato e natura incontaminata che ti lasceranno senza fiato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/resources/madonie.jpg"
                alt="Madonie"
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-2xl font-bold">Madonie</h3>
              </div>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/resources/ficuzza.jpg"
                alt="Ficuzza"
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-2xl font-bold">Ficuzza</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/resources/inici.jpg"
                alt="Inici"
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-2xl font-bold">Inici</h3>
              </div>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/resources/57165.jpg"
                alt="Sicilia"
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-2xl font-bold">Sicilia</h3>
              </div>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/resources/28088.jpg"
                alt="Natura"
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div 
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
                }}
              >
                <h3 className="text-white text-2xl font-bold">Natura</h3>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/tours" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Vedi tutte le escursioni
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      

      {/* Mappa Sicilia */}
      <section className="w-full pt-8 pb-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-accent uppercase font-semibold mb-2">
              DOVE CI TROVIAMO
            </div>
            <div className="relative inline-block mb-6">
              <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
              <h2 className="font-title text-[48px] font-bold relative">
                La Sicilia, la nostra casa
              </h2>
            </div>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              Operiamo in tutta la Sicilia, organizzando escursioni e trekking nelle zone più belle e suggestive dell'isola. Ma a breve ci spingeremo oltre, verso le altre regioni italiane e all'estero.
            </p>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden " style={{ height: '500px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966871.7429994894!2d13.33524656638108!3d37.536609845059594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13106268d05359b3%3A0x10b042967b67d50!2sSicilia!5e0!3m2!1sit!2sit!4v1762819720664!5m2!1sit!2sit"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa Sicilia"
            ></iframe>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 relative">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/resources/testimonial-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="text-accent uppercase font-semibold mb-4 text-lg">
              PRONTO PER L'AVVENTURA?
            </div>
            <h2 className="font-title text-5xl md:text-6xl font-bold mb-6 text-primary">
              Inizia la tua esperienza oggi
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Unisciti a noi per scoprire le meraviglie della Sicilia attraverso escursioni uniche e indimenticabili. La tua prossima avventura ti aspetta!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tours" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Esplora i tour
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contacts" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
                Contattaci
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

