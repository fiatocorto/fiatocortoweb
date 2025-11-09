# Quick Start Guide

## Setup Rapido

1. **Installa dipendenze**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Setup database**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

3. **Avvia in sviluppo**
   
   **Opzione A - Script root (consigliato)**
   ```bash
   # Dalla root
   npm run dev
   ```
   
   **Opzione B - Separato**
   ```bash
   # Terminale 1
   cd backend && npm run dev
   
   # Terminale 2
   cd frontend && npm run dev
   ```

4. **Accedi all'app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Credenziali Test

**Admin:**
- Email: `admin@fiatocorto.it`
- Password: `admin123`

**Cliente:**
- Email: `giulia.bianchi@example.com`
- Password: `customer123`

## Test QR Scanner

1. Login come admin
2. Vai su `/admin/qr-scanner`
3. Crea una prenotazione come cliente
4. Copia il token QR dalla prenotazione
5. Usa lo scanner admin per verificare

## Comandi Utili

```bash
# Seed database (reset + dati esempio)
cd backend && npm run seed

# Prisma Studio (GUI database)
cd backend && npm run prisma:studio

# Build produzione
npm run build
```

