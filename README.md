# Fiato Corto - Breathless Adventures

Sito gestionale per escursioni con sistema di prenotazioni, calendario, dashboard admin e scanner QR.

## 🚀 Stack Tecnologico

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (prototipo) / PostgreSQL (production ready)
- **ORM**: Prisma
- **Autenticazione**: JWT
- **Icone**: Lucide React
- **Fonts**: Brygada 1918 (titoli), Ubuntu (corpo)

## 📋 Prerequisiti

- Node.js 18+ e npm
- Git

## 🛠️ Installazione

### 1. Clona il repository

```bash
git clone <repository-url>
cd fiatocorto
```

### 2. Installa le dipendenze

```bash
# Installa dipendenze root (opzionale, per script comuni)
npm install

# Installa dipendenze backend
cd backend
npm install

# Installa dipendenze frontend
cd ../frontend
npm install
```

### 3. Setup Database

```bash
cd backend

# Genera Prisma Client
npm run prisma:generate

# Esegui migrazioni
npm run prisma:migrate

# Popola il database con dati di esempio
npm run seed
```

### 4. Configurazione Environment

Crea un file `.env` nella cartella `backend/` (opzionale per sviluppo):

```env
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## ▶️ Avvio

### Sviluppo (con script root)

Dalla root del progetto:

```bash
npm run dev
```

Questo avvia sia frontend (porta 5173) che backend (porta 3001).

### Sviluppo (separato)

**Terminale 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminale 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

```bash
# Build frontend e backend
npm run build

# Avvia backend in produzione
npm start
```

## 🔑 Credenziali di Accesso

Dopo aver eseguito il seed, puoi accedere con:

### Admin
- **Email**: `admin@fiatocorto.it`
- **Password**: `admin123`

- **Email**: `mario.rossi@fiatocorto.it`
- **Password**: `admin123`

### Clienti
- **Email**: `giulia.bianchi@example.com`
- **Password**: `customer123`

- **Email**: `luca.verdi@example.com`
- **Password**: `customer123`

- **Email**: `sofia.neri@example.com`
- **Password**: `customer123`

## 📱 Funzionalità

### Frontend Pubblico

- **Homepage**: Hero section, ricerca rapida, carosello tour, sezioni informative
- **Lista Tour**: Griglia/lista toggle, filtri (destinazione, lingua, prezzo, data)
- **Dettaglio Tour**: Immagini, itinerario, date disponibili, prenotazione
- **Calendario**: Vista mensile con eventi tour
- **Prenotazione**: Flow completo con selezione data, partecipanti, pagamento
- **Account Cliente**: Modifica dati personali
- **Le Mie Prenotazioni**: Elenco, dettagli, QR code, cancellazione

### Admin Dashboard

- **Dashboard**: Statistiche (tour, prenotazioni, incassi)
- **Gestione Tour**: CRUD completo, creazione/modifica tour
- **Gestione Prenotazioni**: Visualizza, modifica stato, gestione rimborsi
- **Calendario Admin**: Vista completa date e disponibilità
- **QR Scanner**: Scanner camera + inserimento manuale per check-in
- **Gestione Utenti**: Creazione nuovi admin
- **Notifiche**: Sistema notifiche con badge e lista

## 🔌 API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione cliente
- `POST /api/auth/login` - Login (ritorna JWT + role)
- `GET /api/auth/me` - Get utente corrente

### Tour
- `GET /api/tours` - Lista tour (filtri: destination, language, minPrice, maxPrice, date)
- `GET /api/tours/:id` - Dettaglio tour (id o slug)
- `POST /api/tours` - Crea tour (admin)
- `PUT /api/tours/:id` - Aggiorna tour (admin)
- `DELETE /api/tours/:id` - Elimina tour (admin)

### Date Tour
- `GET /api/tour-dates?tourId=` - Date di un tour
- `POST /api/tour-dates` - Crea data tour (admin)

### Prenotazioni
- `GET /api/bookings` - Lista prenotazioni (admin: tutte, cliente: proprie)
- `GET /api/bookings/:id` - Dettaglio prenotazione
- `POST /api/bookings` - Crea prenotazione
- `PUT /api/bookings/:id` - Modifica prenotazione
- `DELETE /api/bookings/:id?requestRefund=true` - Cancella/richiedi rimborso

### QR Code
- `POST /api/qrcode/verify` - Verifica QR code (admin, segna check-in)
- `GET /api/qrcode/:token` - Get prenotazione da token QR

### Notifiche
- `GET /api/notifications` - Lista notifiche (admin)
- `GET /api/notifications/unread/count` - Conteggio non lette
- `PUT /api/notifications/:id/seen` - Segna come letta
- `PUT /api/notifications/seen/all` - Segna tutte come lette

### Admin
- `POST /api/admins` - Crea nuovo admin
- `GET /api/admins/dashboard/stats` - Statistiche dashboard

## 🧪 Test QR Scanner

1. Accedi come admin: `admin@fiatocorto.it` / `admin123`
2. Vai su `/admin/qr-scanner`
3. Crea una prenotazione come cliente e copia il token QR
4. Usa lo scanner admin per verificare il QR:
   - **Camera**: Clicca "Avvia Scanner" e inquadra il QR code
   - **Manuale**: Incolla il token nel campo "Inserimento Manuale"

**Nota**: Per la camera, è necessario HTTPS in produzione o localhost per sviluppo.

## 📁 Struttura Progetto

```
fiatocorto/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schema database
│   │   └── dev.db              # Database SQLite (generato)
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth middleware
│   │   ├── utils/              # Utilities
│   │   ├── scripts/            # Seed script
│   │   └── index.ts            # Server entry
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Componenti riutilizzabili
│   │   ├── pages/              # Pagine
│   │   ├── contexts/           # React contexts
│   │   ├── utils/              # Utilities
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json                # Root package (workspaces)
└── README.md
```

## 🎨 Design System

### Colori
- **Accent**: `#fbb017` (giallo trekking)
- **Primary**: `#0f172a` (navy/charcoal)
- **Muted**: `#6b7280`
- **Background**: `#f8fafc`

### Typography
- **Titoli**: Brygada 1918, 48px bold (H1)
- **Paragrafi**: Ubuntu, 16px regular

### Componenti
- `CardTour`: Card tour con immagine, badge posti, prezzo
- `TourGrid`: Griglia/lista toggle
- `ImageGallery`: Galleria immagini con lightbox
- `QRBadge`: Componente QR code
- `Modal`: Modale riutilizzabile
- `Badge`: Badge per stati (posti, pagamento, ecc.)

## 🔮 Future Enhancements

- [ ] Integrazione Stripe per pagamenti online
- [ ] OAuth (Google/Facebook login)
- [ ] Mappe dinamiche con Leaflet/Mapbox
- [ ] Storage file S3 per immagini
- [ ] Email notifications reali (Nodemailer/SendGrid)
- [ ] Sistema di recensioni
- [ ] Chat supporto clienti
- [ ] Export report prenotazioni (PDF/Excel)
- [ ] Multi-lingua (i18n)
- [ ] PWA support
- [ ] App mobile (React Native)

## 🐛 Troubleshooting

### Database non si crea
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### Porta già in uso
Modifica `PORT` in `backend/.env` o `vite.config.ts` per frontend.

### Camera non funziona (QR Scanner)
- In produzione serve HTTPS
- In sviluppo usa `localhost` o `127.0.0.1`
- Verifica permessi browser per camera

### Errori CORS
Verifica `FRONTEND_URL` in `backend/.env` corrisponde all'URL frontend.

## 📝 Note Tecniche

- **Pagamenti**: Attualmente solo stub. "Paga online" mostra bottone ma non integra Stripe.
- **Mappe**: Placeholder per mappe. Hook pronti per Mapbox/Leaflet.
- **Storage Media**: Prototipo usa URL esterni. In production usare S3 o storage locale.
- **Notifiche**: Sistema stub che logga in console. Pronto per integrazione email/webhook.

## 📄 Licenza

Questo progetto è un prototipo MVP. Per uso commerciale, implementare le funzionalità mancanti e seguire best practices di sicurezza.

## 👥 Supporto

Per domande o problemi, apri una issue nel repository.

---

**Fiato Corto - Breathless Adventures** 🏔️

