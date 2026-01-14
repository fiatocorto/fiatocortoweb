import { useState } from 'react';
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';

export default function ContactsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Come posso prenotare un'escursione?",
      answer: "Puoi prenotare un'escursione direttamente dal nostro sito web. Seleziona il tour che ti interessa, scegli la data disponibile e completa la prenotazione online. Riceverai una conferma via email con tutti i dettagli dell'escursione."
    },
    {
      question: "Quali sono i requisiti di forma fisica per partecipare?",
      answer: "Le nostre escursioni sono adatte a diversi livelli di preparazione fisica. Ogni tour ha una descrizione del livello di difficoltà. Ti consigliamo di scegliere un'escursione adatta alla tua condizione fisica. In caso di dubbi, contattaci per ricevere consigli personalizzati."
    },
    {
      question: "Cosa è incluso nel prezzo del tour?",
      answer: "Il prezzo include la guida esperta, l'assicurazione, e l'organizzazione dell'escursione. Alcuni tour possono includere anche pranzo o snack. I dettagli specifici sono indicati nella descrizione di ogni tour. L'attrezzatura personale (scarpe da trekking, zaino, ecc.) non è inclusa."
    },
    {
      question: "Cosa devo portare con me?",
      answer: "Ti consigliamo di portare: scarpe da trekking, abbigliamento comodo e a strati, zaino, acqua (almeno 1,5 litri), snack, crema solare, cappello e, se necessario, bastoncini da trekking. Una lista dettagliata verrà inviata via email dopo la prenotazione."
    },
    {
      question: "Posso cancellare o modificare la prenotazione?",
      answer: "Sì, puoi modificare o cancellare la tua prenotazione fino a 48 ore prima della data dell'escursione. Le cancellazioni effettuate entro questo termine sono rimborsabili. Per modifiche o cancellazioni, contattaci via email o telefono."
    },
    {
      question: "Le escursioni si svolgono anche in caso di maltempo?",
      answer: "La sicurezza è la nostra priorità. In caso di condizioni meteorologiche avverse, valuteremo insieme se posticipare o annullare l'escursione. Ti contatteremo tempestivamente per comunicarti eventuali cambiamenti. In caso di annullamento da parte nostra, ti offriremo un rimborso completo o la possibilità di riprogrammare."
    },
    {
      question: "Sono adatte le escursioni per bambini?",
      answer: "Alcune delle nostre escursioni sono adatte anche per famiglie con bambini. Ti invitiamo a contattarci per trovare l'escursione più adatta alla tua famiglia."
    },
    {
      question: "Come posso raggiungere il punto di incontro?",
      answer: "Il punto di incontro esatto e le indicazioni per raggiungerlo ti verranno inviati via email dopo la prenotazione. Solitamente forniamo anche coordinate GPS e indicazioni stradali dettagliate."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
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
            Contattaci
          </h1>
        </div>
      </section>

      <div className="w-full py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sezione Contattaci */}
        <section className="mb-12 sm:mb-14 md:mb-16">
          <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
            <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
              Contattaci
            </h2>
          </div>
          <p className="text-base sm:text-lg mb-8 sm:mb-10 md:mb-12" style={{ color: '#1c1a18' }}>
            Siamo qui per rispondere alle tue domande e aiutarti a pianificare la tua prossima avventura. 
            Non esitare a contattarci per qualsiasi informazione o assistenza.
          </p>

          {/* Informazioni di contatto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-14 md:mb-16">
            {/* Telefono */}
            <div className="group relative">
              {/* Card con effetto glassmorphism e bordo accent */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/50 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                {/* Accent gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col items-center">
                  {/* Icona */}
                  <div className="mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  
                  {/* Titolo */}
                  <div className="text-base sm:text-lg md:text-xl font-semibold group-hover:text-primary transition-colors duration-300 mb-2" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                    Telefono
                  </div>
                  
                  {/* Descrizione */}
                  <p className="text-sm sm:text-base max-w-xs mx-auto flex-grow" style={{ color: '#1c1a18' }}>+39 123 456 7890</p>
                </div>
                
                {/* Decorative element bottom right */}
                <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="group relative">
              {/* Card con effetto glassmorphism e bordo accent */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/50 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                {/* Accent gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col items-center">
                  {/* Icona */}
                  <div className="mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  
                  {/* Titolo */}
                  <div className="text-base sm:text-lg md:text-xl font-semibold group-hover:text-primary transition-colors duration-300 mb-2" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                    Email
                  </div>
                  
                  {/* Descrizione */}
                  <p className="text-sm sm:text-base max-w-xs mx-auto flex-grow break-all" style={{ color: '#1c1a18' }}>info@fiatocorto.it</p>
                </div>
                
                {/* Decorative element bottom right */}
                <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Indirizzo */}
            <div className="group relative sm:col-span-2 md:col-span-1">
              {/* Card con effetto glassmorphism e bordo accent */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-200/50 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                {/* Accent gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col items-center">
                  {/* Icona */}
                  <div className="mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  
                  {/* Titolo */}
                  <div className="text-base sm:text-lg md:text-xl font-semibold group-hover:text-primary transition-colors duration-300 mb-2" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                    Dove operiamo
                  </div>
                  
                  {/* Descrizione */}
                  <p className="text-sm sm:text-base max-w-xs mx-auto flex-grow" style={{ color: '#1c1a18' }}>Sicilia</p>
                </div>
                
                {/* Decorative element bottom right */}
                <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sezione FAQ */}
        <section className="mb-12 sm:mb-14 md:mb-16">
          <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
            <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
              Domande Frequenti
            </h2>
          </div>
          <p className="text-base sm:text-lg mb-8 sm:mb-10 md:mb-12" style={{ color: '#1c1a18' }}>
            Trova risposte alle domande più comuni sui nostri tour e servizi. 
            Se non trovi quello che cerchi, non esitare a contattarci.
          </p>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 pr-4 flex-1">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-gray-50 text-gray-700 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>
      </div>

      {/* Call to Action Community */}
      <section className="w-full py-16 sm:py-20 md:py-24 text-center" style={{ backgroundColor: '#4f3e2d' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
            <img 
              src="/resources/Icona Gialla.png" 
              alt="" 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
            />
          </div>
          <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative text-white" style={{ fontFamily: 'Nohemi, sans-serif' }}>
              Community
            </h2>
          </div>
          <p className="text-white mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
            Unisciti alla nostra community su WhatsApp per rimanere aggiornato sulle nostre escursioni, condividere esperienze e connetterti con altri appassionati di trekking.
          </p>
          <a
            href="https://chat.whatsapp.com/GMMpUy5Hi5b8GwbjLm1QwT"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-white text-sm sm:text-base px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 font-medium transition-colors inline-flex items-center gap-2 group" 
            style={{ borderRadius: '16px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#976e19';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Unisciti alla community WhatsApp
          </a>
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
      <Footer />
      </div>
    </>
  );
}

