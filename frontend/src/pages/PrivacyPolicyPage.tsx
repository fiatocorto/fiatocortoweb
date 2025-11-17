import Footer from '../components/Footer';
import { Shield, Lock, Eye, Mail, Phone, FileText, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            INFORMATIVA PRIVACY
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Informativa sul trattamento dei dati personali ai sensi del GDPR
          </p>
        </div>
      </section>

      {/* Contenuto principale */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Introduzione */}
          <div className="mb-12">
            <p className="text-lg text-muted mb-6">
              La presente informativa descrive come <strong>Fiato Corto Adventures</strong> raccoglie, utilizza e protegge i dati personali 
              degli utenti del sito web e dei partecipanti alle escursioni, in conformità al Regolamento Generale sulla Protezione dei Dati 
              (GDPR - Regolamento UE 2016/679) e alla normativa italiana in materia di privacy (D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018).
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Data ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* 1. Titolare del Trattamento */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">1. Titolare del Trattamento</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Il titolare del trattamento dei dati personali è:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Fiato Corto Adventures</strong><br />
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email: info@fiatocorto.it<br />
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefono: +39 123 456 7890<br />
                  <strong>Operiamo in:</strong> Sicilia, Italia
                </p>
              </div>
              <p>
                Per qualsiasi richiesta relativa al trattamento dei dati personali, è possibile contattare il titolare ai recapiti sopra indicati.
              </p>
            </div>
          </div>

          {/* 2. Dati Raccolti */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">2. Dati Personali Raccolti</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Nel corso dell'utilizzo del sito web e della fruizione dei servizi, raccogliamo le seguenti categorie di dati personali:
              </p>
              
              <p><strong>2.1. Dati forniti direttamente dall'utente:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dati anagrafici:</strong> nome, cognome</li>
                <li><strong>Dati di contatto:</strong> indirizzo email, numero di telefono (se fornito)</li>
                <li><strong>Dati di autenticazione:</strong> password (crittografata), Google ID (per utenti che si registrano tramite Google OAuth)</li>
                <li><strong>Dati relativi alle prenotazioni:</strong> numero di adulti e bambini, note speciali, preferenze</li>
                <li><strong>Dati di pagamento:</strong> informazioni relative alle transazioni (gestite tramite servizi di pagamento esterni)</li>
              </ul>

              <p><strong>2.2. Dati raccolti automaticamente:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, data e ora di accesso</li>
                <li><strong>Cookie e tecnologie simili:</strong> per informazioni dettagliate, consultare la Cookie Policy</li>
                <li><strong>Dati di utilizzo:</strong> informazioni su come interagisci con il sito web</li>
              </ul>

              <p><strong>2.3. Dati di terze parti:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dati forniti da Google quando utilizzi l'autenticazione Google OAuth (nome, email, foto profilo)</li>
                <li>Dati di analytics raccolti tramite Google Analytics (se attivo)</li>
              </ul>
            </div>
          </div>

          {/* 3. Finalità del Trattamento */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">3. Finalità e Base Giuridica del Trattamento</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                I dati personali vengono trattati per le seguenti finalità:
              </p>

              <p><strong>3.1. Esecuzione del contratto e fornitura del servizio (Base giuridica: esecuzione contratto - Art. 6.1.b GDPR):</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestione della registrazione e autenticazione degli utenti</li>
                <li>Gestione delle prenotazioni delle escursioni</li>
                <li>Comunicazione con l'utente in relazione alle prenotazioni (conferme, modifiche, annullamenti)</li>
                <li>Erogazione dei servizi richiesti</li>
                <li>Gestione dei pagamenti e delle fatture</li>
                <li>Generazione e gestione dei codici QR per il check-in</li>
                <li>Invio di informazioni operative relative alle escursioni prenotate</li>
              </ul>

              <p><strong>3.2. Adempimenti di legge (Base giuridica: obbligo di legge - Art. 6.1.c GDPR):</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adempimenti contabili e fiscali</li>
                <li>Conservazione dei dati per obblighi di legge</li>
                <li>Risposta a richieste delle autorità competenti</li>
              </ul>

              <p><strong>3.3. Legittimo interesse (Base giuridica: legittimo interesse - Art. 6.1.f GDPR):</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prevenzione di frodi e abusi</li>
                <li>Miglioramento del sito web e dei servizi</li>
                <li>Analisi statistiche e di utilizzo del sito (dati aggregati e anonimi)</li>
                <li>Gestione di reclami e controversie</li>
              </ul>

              <p><strong>3.4. Consenso (Base giuridica: consenso - Art. 6.1.a GDPR):</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Invio di comunicazioni promozionali e newsletter (solo con consenso esplicito)</li>
                <li>Utilizzo di cookie di profilazione (se previsti)</li>
                <li>Condivisione dati con partner per finalità di marketing (solo con consenso)</li>
              </ul>
            </div>
          </div>

          {/* 4. Modalità di Trattamento */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">4. Modalità di Trattamento e Conservazione</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                I dati personali sono trattati mediante strumenti informatici e telematici, con logiche strettamente correlate alle finalità 
                indicate e, comunque, in modo da garantire la sicurezza e la riservatezza dei dati stessi.
              </p>
              <p>
                <strong>Misure di sicurezza adottate:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crittografia delle password mediante algoritmi di hashing sicuri (bcrypt)</li>
                <li>Utilizzo di protocolli sicuri (HTTPS) per la trasmissione dei dati</li>
                <li>Autenticazione tramite token JWT per le sessioni utente</li>
                <li>Accesso ai dati riservato solo al personale autorizzato</li>
                <li>Backup regolari dei dati</li>
                <li>Aggiornamenti di sicurezza costanti dei sistemi</li>
              </ul>
              <p>
                <strong>Periodo di conservazione:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>I dati delle prenotazioni sono conservati per 10 anni dalla data dell'escursione (obblighi contabili e fiscali)</li>
                <li>I dati degli account utente sono conservati fino alla richiesta di cancellazione da parte dell'utente</li>
                <li>I dati di navigazione e analytics sono conservati per un periodo massimo di 26 mesi (Google Analytics)</li>
                <li>I log di sistema sono conservati per un periodo massimo di 12 mesi</li>
              </ul>
            </div>
          </div>

          {/* 5. Comunicazione e Diffusione */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">5. Comunicazione e Diffusione dei Dati</h2>
            <div className="space-y-4 text-muted">
              <p>
                I dati personali non sono diffusi, ma possono essere comunicati a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Fornitori di servizi tecnici:</strong> provider di hosting, servizi cloud, servizi di email</li>
                <li><strong>Fornitori di servizi di pagamento:</strong> per la gestione delle transazioni (dati minimi necessari)</li>
                <li><strong>Google:</strong> per l'autenticazione OAuth e servizi di analytics (se attivi)</li>
                <li><strong>Autorità competenti:</strong> quando richiesto dalla legge o da provvedimenti dell'autorità giudiziaria</li>
                <li><strong>Partner commerciali:</strong> solo con consenso esplicito dell'utente, per finalità di marketing</li>
              </ul>
              <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                I dati non vengono mai venduti a terze parti. La comunicazione avviene sempre nel rispetto delle garanzie previste dal GDPR 
                e, quando necessario, sulla base di accordi di trattamento dati (Data Processing Agreements).
              </p>
            </div>
          </div>

          {/* 6. Trasferimento Dati all'Estero */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">6. Trasferimento dei Dati all'Estero</h2>
            <div className="space-y-4 text-muted">
              <p>
                Alcuni servizi utilizzati (come Google Analytics, Firebase, servizi cloud) possono comportare il trasferimento di dati 
                personali verso paesi extra-UE. Tali trasferimenti avvengono:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nel rispetto delle garanzie previste dal GDPR (clausole contrattuali standard, Privacy Shield, ecc.)</li>
                <li>Verso paesi riconosciuti come adeguati dalla Commissione Europea</li>
                <li>Con l'adozione di misure di sicurezza appropriate</li>
              </ul>
              <p>
                Per maggiori informazioni sui trasferimenti di dati, è possibile contattare il titolare del trattamento.
              </p>
            </div>
          </div>

          {/* 7. Diritti dell'Interessato */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">7. Diritti dell'Interessato</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Ai sensi degli artt. 15-22 del GDPR, l'interessato ha diritto a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Diritto di accesso (Art. 15):</strong> ottenere conferma dell'esistenza dei propri dati e accedere agli stessi</li>
                <li><strong>Diritto di rettifica (Art. 16):</strong> ottenere la correzione dei dati inesatti o incompleti</li>
                <li><strong>Diritto alla cancellazione (Art. 17 - "diritto all'oblio"):</strong> ottenere la cancellazione dei dati quando non più necessari o in caso di revoca del consenso</li>
                <li><strong>Diritto di limitazione del trattamento (Art. 18):</strong> ottenere la limitazione del trattamento in determinate circostanze</li>
                <li><strong>Diritto alla portabilità dei dati (Art. 20):</strong> ricevere i propri dati in formato strutturato e trasferirli ad altro titolare</li>
                <li><strong>Diritto di opposizione (Art. 21):</strong> opporsi al trattamento per motivi legittimi o per finalità di marketing diretto</li>
                <li><strong>Diritto di revoca del consenso:</strong> revocare il consenso in qualsiasi momento (per i trattamenti basati sul consenso)</li>
                <li><strong>Diritto di proporre reclamo:</strong> presentare reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it)</li>
              </ul>
              <p>
                <strong>Come esercitare i diritti:</strong>
              </p>
              <p>
                Per esercitare i diritti sopra indicati, è possibile inviare una richiesta scritta al titolare del trattamento ai seguenti recapiti:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Fiato Corto Adventures</strong><br />
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email: info@fiatocorto.it<br />
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefono: +39 123 456 7890
                </p>
              </div>
              <p>
                Il titolare risponderà alla richiesta entro 30 giorni dalla ricezione, salvo casi di particolare complessità, 
                per i quali il termine può essere prorogato fino a 60 giorni, previa comunicazione all'interessato.
              </p>
            </div>
          </div>

          {/* 8. Cookie */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">8. Cookie e Tecnologie Simili</h2>
            <div className="space-y-4 text-muted">
              <p>
                Il sito utilizza cookie e tecnologie simili per migliorare l'esperienza di navigazione e per finalità statistiche. 
                Per informazioni dettagliate sui cookie utilizzati, sulle loro finalità e su come gestirli, consultare la 
                <strong> Cookie Policy</strong> disponibile sul sito web.
              </p>
            </div>
          </div>

          {/* 9. Minori */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">9. Trattamento dei Dati di Minori</h2>
            <div className="space-y-4 text-muted">
              <p>
                I servizi del sito sono destinati a utenti maggiorenni. Per i minori di 16 anni, il trattamento dei dati personali 
                richiede il consenso del genitore o del tutore legale.
              </p>
              <p>
                Se veniamo a conoscenza di aver raccolto dati personali di un minore senza il consenso del genitore/tutore, 
                provvederemo immediatamente alla cancellazione di tali dati.
              </p>
            </div>
          </div>

          {/* 10. Modifiche */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">10. Modifiche alla Privacy Policy</h2>
            <div className="space-y-4 text-muted">
              <p>
                Il titolare si riserva il diritto di modificare la presente informativa privacy in qualsiasi momento, 
                anche in conseguenza di modifiche normative o organizzative.
              </p>
              <p>
                Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento. 
                Si consiglia di consultare periodicamente questa pagina per essere informati sulle eventuali modifiche.
              </p>
              <p>
                In caso di modifiche sostanziali, gli utenti registrati saranno informati via email o tramite notifica sul sito.
              </p>
            </div>
          </div>

          {/* Contatti */}
          <div className="bg-accent/10 p-6 rounded-lg mb-12">
            <h3 className="font-title text-2xl font-bold mb-4">Contatti</h3>
            <p className="text-muted mb-4">
              Per qualsiasi domanda, chiarimento o per esercitare i propri diritti in materia di privacy, è possibile contattare:
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

