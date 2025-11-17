import Footer from '../components/Footer';
import { Cookie, Settings, BarChart, Shield, Info, Mail, Phone } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/resources/2148106687.jpg)',
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
            INFORMATIVA COOKIE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Informazioni sull'utilizzo dei cookie e tecnologie simili
          </p>
        </div>
      </section>

      {/* Contenuto principale */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Introduzione */}
          <div className="mb-12">
            <p className="text-lg text-muted mb-6">
              La presente Cookie Policy descrive i tipi di cookie e tecnologie simili utilizzati dal sito web di 
              <strong> Fiato Corto Adventures</strong>, le finalità per cui vengono utilizzati e come gestirli.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Data ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* 1. Cosa sono i Cookie */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">1. Cosa sono i Cookie</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell'utente (computer, tablet, smartphone) 
                quando si visita un sito web. I cookie permettono al sito di riconoscere il dispositivo e memorizzare alcune informazioni 
                sulle preferenze dell'utente o sulle azioni compiute.
              </p>
              <p>
                I cookie possono essere:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookie di sessione:</strong> temporanei, vengono eliminati alla chiusura del browser</li>
                <li><strong>Cookie persistenti:</strong> rimangono memorizzati sul dispositivo per un periodo determinato o fino alla loro eliminazione manuale</li>
                <li><strong>Cookie di prima parte:</strong> impostati direttamente dal sito web visitato</li>
                <li><strong>Cookie di terze parti:</strong> impostati da domini diversi da quello visitato</li>
              </ul>
            </div>
          </div>

          {/* 2. Tipi di Cookie Utilizzati */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">2. Tipi di Cookie Utilizzati sul Sito</h2>
            </div>
            <div className="space-y-6 text-muted">
              
              <div>
                <h3 className="font-semibold text-xl mb-3">2.1. Cookie Tecnici (Necessari)</h3>
                <p>
                  Questi cookie sono essenziali per il funzionamento del sito e non possono essere disattivati. 
                  Non richiedono il consenso dell'utente.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p><strong>Cookie utilizzati:</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Cookie di autenticazione:</strong> memorizzano il token di sessione per mantenere l'utente loggato</li>
                    <li><strong>Cookie di sicurezza:</strong> proteggono da attacchi e garantiscono la sicurezza delle comunicazioni</li>
                    <li><strong>Cookie di preferenze:</strong> memorizzano le preferenze dell'utente (lingua, tema, ecc.)</li>
                    <li><strong>Cookie di funzionalità:</strong> permettono il corretto funzionamento delle funzionalità del sito</li>
                  </ul>
                  <p className="mt-3"><strong>Durata:</strong> Cookie di sessione (eliminati alla chiusura del browser) o persistenti (fino a 1 anno)</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-3">2.2. Cookie di Analytics</h3>
                <p>
                  Questi cookie ci aiutano a comprendere come gli utenti interagiscono con il sito, raccogliendo informazioni in forma aggregata e anonima.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p><strong>Google Analytics:</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Finalità:</strong> analisi statistiche del traffico, pagine visitate, tempo di permanenza, provenienza del traffico</li>
                    <li><strong>Dati raccolti:</strong> dati aggregati e anonimi (non identificano l'utente)</li>
                    <li><strong>Durata:</strong> fino a 26 mesi</li>
                    <li><strong>Privacy:</strong> Google Analytics può utilizzare cookie di terze parti. Per maggiori informazioni: 
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                        Privacy Policy di Google
                      </a>
                    </li>
                  </ul>
                  <p className="mt-3">
                    <strong>Disattivazione:</strong> È possibile disattivare Google Analytics installando il componente aggiuntivo del browser 
                    disponibile al seguente link:{' '}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      Google Analytics Opt-out
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-3">2.3. Cookie di Autenticazione (Firebase/Google OAuth)</h3>
                <p>
                  Utilizziamo Firebase Authentication e Google OAuth per permettere agli utenti di registrarsi e accedere tramite il proprio account Google.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p><strong>Cookie utilizzati:</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Cookie di autenticazione Firebase:</strong> gestiscono la sessione di autenticazione</li>
                    <li><strong>Cookie Google OAuth:</strong> gestiscono il processo di login con Google</li>
                    <li><strong>Finalità:</strong> autenticazione sicura, mantenimento della sessione utente</li>
                    <li><strong>Durata:</strong> cookie di sessione o persistenti (fino a 1 anno)</li>
                    <li><strong>Privacy:</strong> Per maggiori informazioni:{' '}
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Privacy Policy di Google
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-3">2.4. Cookie di Preferenze Locali (LocalStorage)</h3>
                <p>
                  Utilizziamo anche tecnologie simili ai cookie, come LocalStorage, per memorizzare informazioni localmente sul dispositivo.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p><strong>Dati memorizzati in LocalStorage:</strong></p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Token di autenticazione:</strong> per mantenere la sessione utente</li>
                    <li><strong>Preferenze utente:</strong> impostazioni di visualizzazione, preferenze di navigazione</li>
                    <li><strong>Durata:</strong> fino alla cancellazione manuale o alla disconnessione</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Finalità dei Cookie */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">3. Finalità dell'Utilizzo dei Cookie</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Utilizziamo i cookie per le seguenti finalità:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Funzionalità essenziali:</strong> garantire il corretto funzionamento del sito e delle sue funzionalità</li>
                <li><strong>Autenticazione:</strong> mantenere l'utente loggato durante la navigazione</li>
                <li><strong>Sicurezza:</strong> proteggere il sito da attacchi e garantire la sicurezza delle comunicazioni</li>
                <li><strong>Analisi e miglioramento:</strong> comprendere come gli utenti utilizzano il sito per migliorare l'esperienza</li>
                <li><strong>Personalizzazione:</strong> memorizzare le preferenze dell'utente per personalizzare l'esperienza</li>
                <li><strong>Performance:</strong> ottimizzare le prestazioni del sito</li>
              </ul>
            </div>
          </div>

          {/* 4. Cookie di Terze Parti */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">4. Cookie di Terze Parti</h2>
            <div className="space-y-4 text-muted">
              <p>
                Il sito utilizza servizi di terze parti che possono impostare cookie sul dispositivo dell'utente:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Google (Firebase, Google Analytics, Google OAuth):</strong></p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Servizi di autenticazione e analytics</li>
                  <li>Privacy Policy:{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      https://policies.google.com/privacy
                    </a>
                  </li>
                  <li>Cookie Policy:{' '}
                    <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      https://policies.google.com/technologies/cookies
                    </a>
                  </li>
                </ul>
              </div>

              <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <strong>Nota importante:</strong> Non abbiamo controllo diretto sui cookie impostati da terze parti. 
                Ti consigliamo di consultare le rispettive privacy policy e cookie policy per maggiori informazioni.
              </p>
            </div>
          </div>

          {/* 5. Gestione dei Cookie */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">5. Come Gestire i Cookie</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Puoi gestire le preferenze sui cookie in diversi modi:
              </p>

              <p><strong>5.1. Impostazioni del Browser:</strong></p>
              <p>
                La maggior parte dei browser consente di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Visualizzare i cookie memorizzati e eliminarli</li>
                <li>Bloccare i cookie di terze parti</li>
                <li>Bloccare tutti i cookie</li>
                <li>Eliminare tutti i cookie alla chiusura del browser</li>
              </ul>
              <p className="mt-3">
                <strong>Link alle guide per i principali browser:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <p className="mt-4"><strong>5.2. Disattivazione Google Analytics:</strong></p>
              <p>
                Per disattivare Google Analytics, puoi installare il componente aggiuntivo del browser disponibile al seguente link:{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Google Analytics Opt-out Browser Add-on
                </a>
              </p>

              <p className="mt-4"><strong>5.3. Impostazioni LocalStorage:</strong></p>
              <p>
                Per eliminare i dati memorizzati in LocalStorage, puoi utilizzare le impostazioni del browser o eliminare manualmente 
                i dati di navigazione. Nota: l'eliminazione di LocalStorage potrebbe comportare la disconnessione dal sito.
              </p>

              <p className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                <strong>Importante:</strong> La disattivazione o l'eliminazione di alcuni cookie potrebbe compromettere il funzionamento 
                del sito o di alcune sue funzionalità. I cookie tecnici necessari non possono essere disattivati senza compromettere 
                l'utilizzo del sito.
              </p>
            </div>
          </div>

          {/* 6. Consenso */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">6. Consenso all'Utilizzo dei Cookie</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                <strong>Cookie tecnici (necessari):</strong> Non richiedono il consenso dell'utente, in quanto essenziali per il 
                funzionamento del sito.
              </p>
              <p>
                <strong>Cookie di analytics e di terze parti:</strong> Richiedono il consenso dell'utente. Al primo accesso al sito, 
                viene mostrato un banner informativo che consente all'utente di accettare o rifiutare i cookie non necessari.
              </p>
              <p>
                Il consenso può essere revocato in qualsiasi momento modificando le impostazioni dei cookie tramite le impostazioni 
                del browser o contattando il titolare del trattamento.
              </p>
            </div>
          </div>

          {/* 7. Aggiornamenti */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">7. Aggiornamenti della Cookie Policy</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Il titolare si riserva il diritto di modificare la presente Cookie Policy in qualsiasi momento, anche in conseguenza 
                di modifiche normative o tecnologiche.
              </p>
              <p>
                Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento. Si consiglia 
                di consultare periodicamente questa pagina per essere informati sulle eventuali modifiche.
              </p>
            </div>
          </div>

          {/* Contatti */}
          <div className="bg-accent/10 p-6 rounded-lg mb-12">
            <h3 className="font-title text-2xl font-bold mb-4">Contatti</h3>
            <p className="text-muted mb-4">
              Per qualsiasi domanda o chiarimento riguardo all'utilizzo dei cookie, è possibile contattare:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Fiato Corto Adventures</strong><br />
                <Mail className="w-4 h-4 inline mr-2" />
                Email: info@fiatocorto.it<br />
                <Phone className="w-4 h-4 inline mr-2" />
                Telefono: +39 123 456 7890
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

