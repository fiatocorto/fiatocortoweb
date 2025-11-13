# Guida al Deploy su Vercel

Questa guida spiega come deployare l'applicazione Fiato Corto su Vercel.

## Prerequisiti

1. Account Vercel (gratuito)
2. Database PostgreSQL (puoi usare Vercel Postgres, Neon, Supabase, o altri provider)

## Configurazione Database

### Opzione 1: Vercel Postgres (Consigliato)

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Crea un nuovo progetto o apri il progetto esistente
3. Vai su **Storage** → **Create Database** → **Postgres**
4. Copia la connection string (DATABASE_URL)

### Opzione 2: Provider Esterni

Puoi usare:
- **Neon** (https://neon.tech) - gratuito
- **Supabase** (https://supabase.com) - gratuito
- **Railway** (https://railway.app) - gratuito
- Altri provider PostgreSQL

## Variabili d'Ambiente

Configura queste variabili d'ambiente su Vercel:

1. Vai su **Settings** → **Environment Variables**
2. Aggiungi:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-app.vercel.app
```

**Nota**: `FRONTEND_URL` sarà il dominio del tuo deploy Vercel (es. `https://fiatocorto.vercel.app`)

## Deploy

### Metodo 1: Deploy Automatico (GitHub/GitLab/Bitbucket)

1. Connetti il repository a Vercel
2. Vercel rileverà automaticamente la configurazione
3. Assicurati che le variabili d'ambiente siano configurate
4. Fai il deploy!

### Metodo 2: Deploy via CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy in produzione
vercel --prod
```

## Migrazione Database

Dopo il primo deploy, devi eseguire le migrazioni Prisma:

```bash
# Via Vercel CLI
vercel env pull .env.local
cd backend
npx prisma migrate deploy
```

Oppure puoi eseguire le migrazioni manualmente connettendoti al database.

## Build Commands

Vercel eseguirà automaticamente:
- `npm install` (root)
- `cd frontend && npm install && npm run build` (per il frontend)
- `prisma generate` (per Prisma Client)

## Struttura del Deploy

- **Frontend**: Deployato come static site in `frontend/dist`
- **Backend**: Deployato come serverless function in `/api`
- **Routes**: 
  - `/api/*` → Backend Express
  - `/*` → Frontend React

## Troubleshooting

### Errore: "Prisma Client not generated"
Assicurati che `prisma generate` sia eseguito durante il build. È già configurato nel `package.json`.

### Errore: "Database connection failed"
Verifica che:
- `DATABASE_URL` sia configurato correttamente
- Il database sia accessibile pubblicamente (se necessario)
- Le credenziali siano corrette

### Errore: "CORS error"
Verifica che `FRONTEND_URL` sia impostato correttamente con il dominio Vercel (es. `https://your-app.vercel.app`)

## Note Importanti

1. **SQLite non funziona su Vercel**: Il progetto è stato migrato a PostgreSQL
2. **Serverless Functions**: Il backend Express funziona come serverless function
3. **Cold Starts**: La prima richiesta dopo un periodo di inattività potrebbe essere più lenta
4. **File Uploads**: Se hai bisogno di upload file, considera l'uso di Vercel Blob o servizi esterni

## Supporto

Per problemi o domande, consulta:
- [Documentazione Vercel](https://vercel.com/docs)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)

