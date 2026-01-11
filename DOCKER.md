# Docker

Il supporto via Docker Compose è stato rimosso dal progetto. Usa l'ambiente
Node standard per avviare i servizi in locale oppure i workflow di deployment
documentati in `README.md`.

## Sviluppo locale (senza Docker)

1. Crea i file `.env` richiesti seguendo `ENV_SETUP.md`.
2. Avvia il backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Avvia il frontend in un altro terminale:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Database

Il backend usa Prisma. Per allineare lo schema:
```bash
cd backend
npx prisma migrate dev
```

## Note

- Genera un `JWT_SECRET` robusto (`node -e "crypto.randomBytes(32).toString('hex')"`)
  e impostalo nel tuo `.env`.
- Se distribuisci su un hosting gestito (es. Vercel/Render), configura le
  variabili d'ambiente e il database dal pannello del provider.

