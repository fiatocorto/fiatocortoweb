# Configurazione Variabili d'Ambiente

## Backend (Vercel Environment Variables)

Configura queste variabili nel dashboard Vercel (Settings → Environment Variables):

### Produzione
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=https://your-app.vercel.app
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

### Preview/Development
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=https://your-preview-branch.vercel.app
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

## Frontend (Vercel Environment Variables)

Per il frontend, configura:

### Produzione
```
VITE_API_URL=https://your-app.vercel.app
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Preview/Development
```
VITE_API_URL=https://your-preview-branch.vercel.app
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Nota**: Se `VITE_API_URL` non è impostato, il frontend userà `http://localhost:3001` (utile per sviluppo locale).

## Sviluppo Locale

Crea un file `.env` nella root del progetto:

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/fiatocorto?schema=public
JWT_SECRET=your-local-secret-key
FRONTEND_URL=http://localhost:5173
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# Frontend (opzionale, usa localhost:3001 di default)
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Generare JWT_SECRET

Per generare un JWT_SECRET sicuro:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

## Database URL Format

Il formato per PostgreSQL è:
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

Per Vercel Postgres, la connection string viene fornita automaticamente.

## Configurazione Firebase Authentication

Per abilitare l'autenticazione con Firebase:

### 1. Crea un progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca su "Aggiungi progetto" o seleziona un progetto esistente
3. Segui la procedura guidata per creare il progetto

### 2. Configura Firebase Authentication

1. Nel progetto Firebase, vai su **Authentication** → **Get Started**
2. Abilita **Email/Password** e **Google** come provider di autenticazione
3. Per Google, configura il provider con il tuo Client ID OAuth

### 3. Ottieni le credenziali Firebase

1. Vai su **Project Settings** (icona ingranaggio) → **General**
2. Scorri fino a "Your apps" e clicca sull'icona web `</>`
3. Registra l'app e copia la configurazione Firebase (firebaseConfig)
4. Aggiungi le variabili d'ambiente nel frontend:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 4. Configura Firebase Admin SDK (Backend)

1. Vai su **Project Settings** → **Service accounts**
2. Clicca su **Generate new private key**
3. Scarica il file JSON della service account
4. Copia il contenuto del JSON e aggiungilo come variabile d'ambiente `FIREBASE_SERVICE_ACCOUNT` nel backend

**Nota**: In produzione, puoi anche usare `GOOGLE_APPLICATION_CREDENTIALS` puntando al file JSON invece di usare la variabile d'ambiente.

### 5. Configura domini autorizzati

1. Vai su **Authentication** → **Settings** → **Authorized domains**
2. Aggiungi i tuoi domini:
   - `localhost` (per sviluppo)
   - Il tuo dominio di produzione

