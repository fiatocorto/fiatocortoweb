import { Phone, Mail, MapPin } from 'lucide-react';
import Footer from '../components/Footer';

export default function ContactsPage() {
  return (
    <div className="pt-32 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Sezione Contattaci */}
        <section className="mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute bg-yellow-100 w-3/4 h-8 top-8 left-0"></div>
            <h2 className="font-title text-[48px] font-bold relative">
              Contattaci
            </h2>
          </div>
          <p className="text-lg text-gray-700 mb-12">
            Siamo qui per rispondere alle tue domande e aiutarti a pianificare la tua prossima avventura. 
            Non esitare a contattarci per qualsiasi informazione o assistenza.
          </p>

          {/* Informazioni di contatto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Telefono */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center transition-shadow">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Phone className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Telefono</h3>
              <p className="text-gray-600">+39 123 456 7890</p>
            </div>

            {/* Email */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center transition-shadow">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-gray-600">info@fiatocorto.it</p>
            </div>

            {/* Indirizzo */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center transition-shadow">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Dove operiamo</h3>
              <p className="text-gray-600">Sicilia</p>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action Community */}
      <section className="w-full bg-[#0f172a] p-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4 text-white">Community</h3>
          <p className="text-white mb-6">Unisciti alla community su WhatsApp</p>
          <a
            href="https://chat.whatsapp.com/GMMpUy5Hi5b8GwbjLm1QwT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </section>

      {/* Mappa Sicilia */}
      <section className="w-full pt-32 pb-32 relative">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966871.7429994894!2d13.33524656638108!3d37.536609845059594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13106268d05359b3%3A0x10b042967b67d50!2sSicilia!5e0!3m2!1sit!2sit!4v1762819720664!5m2!1sit!2sitnav"
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

      <Footer />
    </div>
  );
}

