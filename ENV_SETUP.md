# Configurazione Variabili d'Ambiente

## Backend (Vercel Environment Variables)

Configura queste variabili nel dashboard Vercel (Settings → Environment Variables):

### Produzione
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=https://your-app.vercel.app
```

### Preview/Development
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=https://your-preview-branch.vercel.app
```

## Frontend (Vercel Environment Variables)

Per il frontend, configura:

### Produzione
```
VITE_API_URL=https://your-app.vercel.app
```

### Preview/Development
```
VITE_API_URL=https://your-preview-branch.vercel.app
```

**Nota**: Se `VITE_API_URL` non è impostato, il frontend userà `http://localhost:3001` (utile per sviluppo locale).

## Sviluppo Locale

Crea un file `.env` nella root del progetto:

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/fiatocorto?schema=public
JWT_SECRET=your-local-secret-key
FRONTEND_URL=http://localhost:5173

# Frontend (opzionale, usa localhost:3001 di default)
VITE_API_URL=http://localhost:3001
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

