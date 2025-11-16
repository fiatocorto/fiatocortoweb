import Footer from '../components/Footer';
import { Shield, AlertTriangle, FileText, Phone, Mail } from 'lucide-react';

export default function TermsPage() {
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
            INFORMAZIONI LEGALI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Termini e Condizioni
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Regolamento e condizioni di partecipazione alle escursioni
          </p>
        </div>
      </section>

      {/* Contenuto principale */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Introduzione */}
          <div className="mb-12">
            <p className="text-lg text-muted mb-6">
              Le presenti condizioni generali regolano la partecipazione alle escursioni organizzate da <strong>Fiato Corto Adventures</strong>. 
              La prenotazione e la partecipazione alle attività implicano l'accettazione integrale di queste condizioni.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Data ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* 1. Condizioni di Salute e Idoneità Fisica */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">1. Condizioni di Salute e Idoneità Fisica</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                La partecipazione alle escursioni richiede un buono stato di salute generale. I partecipanti dichiarano di essere in condizioni 
                fisiche idonee per affrontare l'attività scelta e di non soffrire di patologie che possano compromettere la propria sicurezza o 
                quella degli altri partecipanti.
              </p>
              <p>
                <strong>È obbligatorio informare l'organizzazione:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Di eventuali patologie cardiache, respiratorie, muscolo-scheletriche o altre condizioni mediche rilevanti</li>
                <li>Di allergie o intolleranze alimentari</li>
                <li>Di assunzione di farmaci che potrebbero influenzare le prestazioni fisiche</li>
                <li>Di eventuali limitazioni fisiche o motorie</li>
              </ul>
              <p>
                L'organizzazione si riserva il diritto di escludere dalla partecipazione chiunque non risulti idoneo o non abbia comunicato 
                condizioni che possano compromettere la sicurezza dell'escursione. In caso di dubbi, si consiglia di consultare il proprio 
                medico curante prima della prenotazione.
              </p>
            </div>
          </div>

          {/* 2. Scarico di Responsabilità */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">2. Scarico di Responsabilità</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                Le attività di trekking e escursionismo comportano rischi intrinseci legati all'ambiente naturale e all'attività fisica. 
                I partecipanti sono consapevoli che:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Le escursioni si svolgono in ambiente naturale, con possibili condizioni meteorologiche avverse, terreni impervi e altri pericoli naturali</li>
                <li>Possono verificarsi cadute, scivolamenti, contatti con animali selvatici, punture di insetti e altri incidenti</li>
                <li>L'organizzazione mette in atto tutte le misure di sicurezza possibili, ma non può garantire l'assoluta eliminazione dei rischi</li>
              </ul>
              <p>
                <strong>I partecipanti accettano di:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Seguire scrupolosamente le indicazioni delle guide</li>
                <li>Rispettare le norme di sicurezza e l'ambiente naturale</li>
                <li>Non allontanarsi dal gruppo senza autorizzazione</li>
                <li>Utilizzare l'attrezzatura consigliata e adeguata</li>
                <li>Assumersi la responsabilità delle proprie azioni e decisioni durante l'escursione</li>
              </ul>
              <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <strong>L'organizzazione declina ogni responsabilità per:</strong> incidenti, infortuni, danni a persone o cose derivanti 
                da comportamenti imprudenti, mancato rispetto delle indicazioni, condizioni di salute non comunicate, eventi imprevedibili o 
                forza maggiore, nonché per danni derivanti da attrezzatura non idonea o non utilizzata correttamente.
              </p>
            </div>
          </div>

          {/* 3. Assicurazione */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <h2 className="font-title text-3xl font-bold">3. Assicurazione</h2>
            </div>
            <div className="space-y-4 text-muted">
              <p>
                <strong>Assicurazione Responsabilità Civile:</strong> L'organizzazione è coperta da polizza di assicurazione responsabilità civile 
                per danni a terzi derivanti dall'attività organizzata.
              </p>
              <p>
                <strong>Assicurazione Infortuni:</strong> È fortemente consigliata, ma non obbligatoria, la sottoscrizione di una polizza 
                assicurativa personale che copra:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Infortuni durante l'attività</li>
                <li>Spese mediche e di soccorso</li>
                <li>Rimpatrio sanitario</li>
                <li>Annullamento viaggio</li>
              </ul>
              <p>
                I partecipanti che non dispongono di copertura assicurativa personale partecipano a proprio rischio e pericolo. 
                L'organizzazione non risponde di spese mediche, di soccorso o di rimpatrio che dovessero essere sostenute dal partecipante.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Per informazioni su polizze assicurative consigliate, contattare:</strong><br />
                  <Phone className="w-4 h-4 inline mr-2" />
                  +39 123 456 7890<br />
                  <Mail className="w-4 h-4 inline mr-2" />
                  info@fiatocortoadventures.it
                </p>
              </div>
            </div>
          </div>

          {/* 4. Prenotazioni e Pagamenti */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">4. Prenotazioni e Pagamenti</h2>
            <div className="space-y-4 text-muted">
              <p>
                Le prenotazioni possono essere effettuate online attraverso il sito web o contattando direttamente l'organizzazione. 
                La prenotazione si considera confermata al ricevimento del pagamento.
              </p>
              <p>
                <strong>Modalità di pagamento:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pagamento online con carta di credito/debito</li>
                <li>Pagamento in contanti il giorno dell'escursione (solo se previsto)</li>
                <li>Bonifico bancario (per prenotazioni anticipate)</li>
              </ul>
              <p>
                I prezzi indicati sono comprensivi di: accompagnamento con guida escursionistica, organizzazione dell'escursione. 
                Non sono inclusi: pasti (salvo diversa indicazione), trasporti per raggiungere il punto di partenza, assicurazioni personali, 
                attrezzatura personale.
              </p>
            </div>
          </div>

          {/* 5. Annullamento e Rimborsi */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">5. Annullamento e Rimborsi</h2>
            <div className="space-y-4 text-muted">
              <p><strong>Annullamento da parte del partecipante:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Oltre 15 giorni prima:</strong> rimborso del 100% dell'importo versato</li>
                <li><strong>Da 8 a 15 giorni prima:</strong> rimborso del 50% dell'importo versato</li>
                <li><strong>Da 3 a 7 giorni prima:</strong> rimborso del 30% dell'importo versato</li>
                <li><strong>Meno di 3 giorni prima o mancata presentazione:</strong> nessun rimborso</li>
              </ul>
              <p>
                Le richieste di annullamento devono essere comunicate per iscritto via email a <strong>info@fiatocortoadventures.it</strong> 
                o telefonicamente al <strong>+39 123 456 7890</strong>. La data di ricevimento della comunicazione farà fede per il calcolo 
                della penale.
              </p>
              <p><strong>Annullamento da parte dell'organizzazione:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>In caso di annullamento per cause imputabili all'organizzazione (es. numero minimo partecipanti non raggiunto, 
                    indisponibilità della guida), verrà rimborsato il 100% dell'importo versato</li>
                <li>In caso di annullamento per eventi di forza maggiore (vedi punto 6), si applicano le condizioni previste</li>
                <li>L'organizzazione si riserva il diritto di modificare itinerario, orari o difficoltà in base alle condizioni 
                    meteorologiche o ambientali, senza diritto a rimborso parziale</li>
              </ul>
            </div>
          </div>

          {/* 6. Eventi di Forza Maggiore */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">6. Eventi di Forza Maggiore</h2>
            <div className="space-y-4 text-muted">
              <p>
                Si intendono eventi di forza maggiore tutti quegli eventi imprevedibili, inevitabili ed esterni alla volontà delle parti che 
                rendono impossibile o pericolosa l'esecuzione dell'escursione:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Condizioni meteorologiche avverse (temporali, neve, ghiaccio, vento forte, alluvioni)</li>
                <li>Eventi sismici, frane, valanghe</li>
                <li>Chiusure straordinarie di sentieri o aree naturali da parte delle autorità competenti</li>
                <li>Emergenze sanitarie, pandemie, restrizioni governative</li>
                <li>Scioperi, disordini civili, guerre</li>
                <li>Altri eventi straordinari non prevedibili</li>
              </ul>
              <p>
                <strong>In caso di evento di forza maggiore:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>L'organizzazione si impegna a comunicare tempestivamente l'annullamento o la modifica dell'escursione</li>
                <li>Non è previsto il rimborso dell'importo versato, salvo diversa disposizione di legge</li>
                <li>L'organizzazione può proporre una data alternativa o un'escursione sostitutiva di pari valore</li>
                <li>Le spese già sostenute dall'organizzazione (prenotazioni, servizi, ecc.) non sono rimborsabili</li>
              </ul>
              <p className="bg-blue-50 border-l-4 border-blue-500 p-4">
                Si consiglia vivamente di sottoscrivere un'assicurazione annullamento viaggio che copra anche gli eventi di forza maggiore.
              </p>
            </div>
          </div>

          {/* 7. Modifiche e Cancellazioni dell'Organizzazione */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">7. Modifiche e Cancellazioni dell'Organizzazione</h2>
            <div className="space-y-4 text-muted">
              <p>
                L'organizzazione si riserva il diritto di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modificare itinerario, orari o difficoltà in base alle condizioni ambientali, meteorologiche o per motivi di sicurezza</li>
                <li>Annullare l'escursione se non viene raggiunto il numero minimo di partecipanti (comunicato al momento della prenotazione)</li>
                <li>Sostituire la guida in caso di indisponibilità, garantendo comunque la presenza di una guida qualificata</li>
                <li>Modificare il punto di ritrovo per motivi logistici o di sicurezza</li>
              </ul>
              <p>
                In caso di modifiche sostanziali o cancellazione, i partecipanti saranno informati con il maggior preavviso possibile. 
                In caso di cancellazione da parte dell'organizzazione (esclusi eventi di forza maggiore), verrà rimborsato il 100% dell'importo versato.
              </p>
            </div>
          </div>

          {/* 8. Comportamento e Regole */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">8. Comportamento e Regole</h2>
            <div className="space-y-4 text-muted">
              <p>
                I partecipanti sono tenuti a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Rispettare le indicazioni della guida e non allontanarsi dal gruppo</li>
                <li>Rispettare l'ambiente naturale: non abbandonare rifiuti, non raccogliere piante o animali, non danneggiare la flora e la fauna</li>
                <li>Utilizzare attrezzatura idonea e in buono stato</li>
                <li>Comunicare tempestivamente eventuali problemi fisici o difficoltà durante l'escursione</li>
                <li>Rispettare gli altri partecipanti e mantenere un comportamento civile e rispettoso</li>
                <li>Non consumare alcolici o sostanze stupefacenti durante l'escursione</li>
              </ul>
              <p>
                L'organizzazione si riserva il diritto di escludere immediatamente dall'escursione chiunque non rispetti queste regole, 
                senza diritto a rimborso. In caso di comportamenti pericolosi o dannosi, l'organizzazione può richiedere l'intervento delle 
                autorità competenti.
              </p>
            </div>
          </div>

          {/* 9. Minori */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">9. Partecipazione di Minori</h2>
            <div className="space-y-4 text-muted">
              <p>
                I minori di 18 anni possono partecipare alle escursioni solo se accompagnati da un genitore o da un tutore legale, 
                o con autorizzazione scritta dei genitori/tutori che delegano la responsabilità a un accompagnatore maggiorenne.
              </p>
              <p>
                L'accompagnatore si assume la piena responsabilità del minore durante tutta la durata dell'escursione. 
                L'organizzazione declina ogni responsabilità per incidenti o danni occorsi ai minori, salvo che derivino da negligenza 
                grave o dolo dell'organizzazione stessa.
              </p>
              <p>
                Per alcune escursioni può essere previsto un'età minima di partecipazione, indicata nella descrizione dell'escursione.
              </p>
            </div>
          </div>

          {/* 10. Privacy e Trattamento Dati */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">10. Privacy e Trattamento dei Dati Personali</h2>
            <div className="space-y-4 text-muted">
              <p>
                I dati personali forniti al momento della prenotazione sono trattati in conformità al Regolamento Generale sulla Protezione 
                dei Dati (GDPR) e alla normativa italiana in materia di privacy.
              </p>
              <p>
                I dati sono utilizzati esclusivamente per:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestione delle prenotazioni e organizzazione delle escursioni</li>
                <li>Comunicazioni relative all'escursione prenotata</li>
                <li>Adempimenti di legge e fiscali</li>
                <li>Invio di comunicazioni promozionali (solo con consenso esplicito)</li>
              </ul>
              <p>
                Per maggiori informazioni sul trattamento dei dati personali, consultare l'informativa privacy completa disponibile sul sito web.
              </p>
            </div>
          </div>

          {/* 11. Reclami */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">11. Reclami</h2>
            <div className="space-y-4 text-muted">
              <p>
                Eventuali reclami devono essere presentati per iscritto entro 10 giorni dalla data dell'escursione a:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Fiato Corto Adventures</strong><br />
                  <Mail className="w-4 h-4 inline mr-2" />
                  info@fiatocortoadventures.it<br />
                  <Phone className="w-4 h-4 inline mr-2" />
                  +39 123 456 7890
                </p>
              </div>
              <p>
                L'organizzazione si impegna a rispondere ai reclami entro 30 giorni dalla ricevuta comunicazione.
              </p>
            </div>
          </div>

          {/* 12. Disposizioni Finali */}
          <div className="mb-12">
            <h2 className="font-title text-3xl font-bold mb-6">12. Disposizioni Finali</h2>
            <div className="space-y-4 text-muted">
              <p>
                Le presenti condizioni generali sono regolate dalla legge italiana. Per qualsiasi controversia sarà competente il foro 
                del luogo di residenza dell'organizzazione.
              </p>
              <p>
                L'organizzazione si riserva il diritto di modificare le presenti condizioni generali in qualsiasi momento. 
                Le modifiche saranno pubblicate sul sito web e si applicheranno alle prenotazioni effettuate successivamente alla pubblicazione.
              </p>
              <p>
                In caso di nullità o inefficacia di una o più clausole delle presenti condizioni, le rimanenti clausole resteranno pienamente 
                valide ed efficaci.
              </p>
              <p>
                La partecipazione alle escursioni implica l'accettazione integrale delle presenti condizioni generali. 
                Si consiglia di conservare una copia delle presenti condizioni per riferimento futuro.
              </p>
            </div>
          </div>

          {/* Contatti */}
          <div className="bg-accent/10 p-6 rounded-lg mb-12">
            <h3 className="font-title text-2xl font-bold mb-4">Contatti</h3>
            <p className="text-muted mb-4">
              Per qualsiasi domanda o chiarimento riguardo alle presenti condizioni generali, è possibile contattare:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Fiato Corto Adventures</strong><br />
                <Mail className="w-4 h-4 inline mr-2" />
                info@fiatocortoadventures.it<br />
                <Phone className="w-4 h-4 inline mr-2" />
                +39 123 456 7890
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

