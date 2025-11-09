# Troubleshooting - Schermata Bianca

Se vedi una schermata bianca, segui questi passaggi:

## 1. Verifica che il backend sia avviato

Il frontend funziona anche senza backend, ma alcune funzionalità richiedono l'API.

```bash
cd backend
npm run dev
```

Dovresti vedere: `🚀 Server running on http://localhost:3001`

## 2. Verifica che il frontend sia avviato

```bash
cd frontend
npm run dev
```

Dovresti vedere: `Local: http://localhost:5173`

## 3. Controlla la Console del Browser

Apri gli strumenti sviluppatore (F12) e controlla:
- **Console**: Cerca errori in rosso
- **Network**: Verifica che i file CSS/JS vengano caricati
- **Elements**: Verifica che il div#root esista

## 4. Verifica che le dipendenze siano installate

```bash
cd frontend
npm install
```

## 5. Pulisci la cache e reinstalla

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 6. Verifica che TailwindCSS sia configurato

Controlla che `tailwind.config.js` esista e sia corretto.

## 7. Errori comuni

### "Cannot find module"
- Reinstalla le dipendenze: `npm install`

### "Port already in use"
- Cambia porta in `vite.config.ts` o termina il processo sulla porta 5173

### "CORS error"
- Verifica che il backend sia avviato e che `FRONTEND_URL` in `.env` sia corretto

### "White screen" senza errori
- Apri la console (F12) e controlla se ci sono errori JavaScript
- Verifica che il file `index.html` abbia `<div id="root"></div>`
- Controlla che `main.tsx` importi correttamente `App.tsx`

## 8. Test minimo

Crea un file di test per verificare che React funzioni:

```tsx
// frontend/src/App.tsx (temporaneo)
export default function App() {
  return <div style={{ padding: '20px' }}>Test - React funziona!</div>;
}
```

Se vedi "Test - React funziona!", il problema è nei componenti. Se vedi ancora bianco, il problema è nella configurazione base.

## 9. Verifica build

```bash
cd frontend
npm run build
```

Se la build fallisce, ci sono errori nel codice da correggere.

## 10. Reset completo

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
npm run prisma:migrate

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json .vite
npm install
npm run dev
```

