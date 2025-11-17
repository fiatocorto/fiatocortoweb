# 🚀 Migrazione a Firebase Storage - Documentazione Completa

## 📋 Riepilogo delle Modifiche

Questo documento descrive tutte le modifiche apportate per migrare il sistema di storage da file system locale a Firebase Storage, rendendo l'applicazione completamente compatibile con Vercel (serverless).

---

## ✅ Modifiche Implementate

### 1. **Configurazione Firebase Admin Centralizzata**

**File creato:** `backend/src/utils/firebaseAdmin.ts`

- ✅ Configurazione centralizzata di Firebase Admin
- ✅ Supporto per variabili d'ambiente (Vercel/produzione)
- ✅ Supporto per file di credenziali (sviluppo locale)
- ✅ Funzioni helper per upload/delete su Firebase Storage
- ✅ Gestione automatica degli URL pubblici

**Funzioni principali:**
- `initializeFirebaseAdmin()` - Inizializza Firebase Admin
- `getFirebaseAdmin()` - Ottiene istanza Firebase Admin
- `getStorageBucket()` - Ottiene bucket Storage
- `uploadFileToStorage()` - Carica file buffer su Firebase Storage
- `deleteFileFromStorage()` - Elimina file da Firebase Storage per URL
- `deleteFileByPath()` - Elimina file da Firebase Storage per path

---

### 2. **Aggiornamento Upload Routes**

**File modificato:** `backend/src/routes/upload.ts`

**Modifiche:**
- ❌ **RIMOSSO:** `multer.diskStorage()` (salvataggio su disco)
- ✅ **AGGIUNTO:** `multer.memoryStorage()` (buffer in memoria)
- ❌ **RIMOSSO:** Tutti gli import `fs` e `path`
- ❌ **RIMOSSO:** Logica di creazione cartelle
- ✅ **AGGIUNTO:** Integrazione con Firebase Storage
- ✅ **AGGIUNTO:** Endpoint DELETE per eliminare file

**Endpoints disponibili:**
- `POST /api/upload/single` - Upload singola immagine
- `POST /api/upload/multiple` - Upload multiple immagini (max 10)
- `POST /api/upload/gpx` - Upload file GPX
- `DELETE /api/upload/delete` - Elimina file da Firebase Storage

**Formato risposta:**
```json
{
  "url": "https://storage.googleapis.com/bucket-name/tour-images/timestamp-random-filename.jpg"
}
```

---

### 3. **Aggiornamento Routes Auth e Admin**

**File modificati:**
- `backend/src/routes/auth.ts`
- `backend/src/routes/admin.ts`

**Modifiche:**
- ✅ Sostituito `admin.apps.length` con `getFirebaseAdmin()`
- ✅ Sostituito `admin.auth()` con `firebaseAdmin.auth()`
- ✅ Rimossa duplicazione della configurazione Firebase Admin

---

### 4. **Database (Prisma)**

**Schema:** Nessuna modifica necessaria

Il database già supporta URL completi nei campi:
- `coverImage` (String)
- `images` (String? - JSON array)
- `gallery` (String?)
- `gpxTrack` (String?)

**Formato URL salvato:**
- **Prima:** `/resources/TourImages/filename.jpg` (path relativo)
- **Dopo:** `https://storage.googleapis.com/bucket-name/tour-images/timestamp-random-filename.jpg` (URL completo Firebase)

---

### 5. **Frontend**

**Nessuna modifica necessaria!** ✅

Il frontend già gestisce correttamente:
- URL relativi (per immagini statiche in `/public/resources/`)
- URL assoluti (per immagini da Firebase Storage)

**Componenti che usano immagini:**
- `CardTour.tsx` - Usa `tour.coverImage` direttamente
- `TourDetailPage.tsx` - Usa `tour.coverImage`, `tour.images`, `tour.gallery`
- `AdminTours.tsx` - Usa `tour.coverImage` per preview
- `AdminCreateTour.tsx` - Gestisce upload e mostra preview
- `AdminEditTour.tsx` - Gestisce upload e mostra preview

**Note:**
- Le immagini statiche in `frontend/public/resources/` (logo, icone, etc.) rimangono invariate
- Solo le immagini caricate tramite upload vengono salvate su Firebase Storage

---

## 🔧 Configurazione Ambiente

### Variabili d'Ambiente Richieste

#### Per Vercel/Produzione (Raccomandato):
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
FIREBASE_STORAGE_BUCKET=fiato-corto-ba53e.firebasestorage.app
```

#### Per Sviluppo Locale:
Il sistema cercherà automaticamente il file:
- `backend/fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json`

Oppure puoi usare:
```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
FIREBASE_STORAGE_BUCKET=fiato-corto-ba53e.firebasestorage.app
```

---

## 📁 Struttura File su Firebase Storage

```
bucket-name/
├── tour-images/
│   ├── 1234567890-123456789-image1.jpg
│   ├── 1234567891-987654321-image2.jpg
│   └── ...
└── gpx-tracks/
    ├── 1234567890-123456789-track1.gpx
    └── ...
```

**Naming convention:**
- Formato: `{timestamp}-{random}-{originalname}`
- Esempio: `1703123456789-426926124-photo.JPEG`

---

## 🚀 Compatibilità Vercel

### ✅ Compatibile con Serverless

**Modifiche per Vercel:**
1. ✅ Nessun uso di `fs.writeFile` o `fs.mkdirSync`
2. ✅ Nessun path relativo che dipende dal filesystem
3. ✅ Tutti i file in memoria (buffer)
4. ✅ Configurazione tramite variabili d'ambiente
5. ✅ API routes compatibili con serverless functions

**File `vercel.json`:**
- ✅ Già configurato correttamente
- ✅ Rewrite per `/api/*` → `/api` (serverless function)

**File `api/index.ts`:**
- ✅ Esporta correttamente l'app Express
- ✅ Compatibile con Vercel serverless

---

## 🔄 Migrazione Dati Esistenti

### Se hai dati esistenti con path locali:

**Opzione 1: Migrazione Manuale**
1. Carica manualmente le immagini su Firebase Storage
2. Aggiorna il database con i nuovi URL Firebase

**Opzione 2: Script di Migrazione** (da creare se necessario)
```typescript
// Script per migrare immagini esistenti
// 1. Leggi tutti i tour dal database
// 2. Per ogni immagine con path locale:
//    - Carica il file da /public/resources/...
//    - Upload su Firebase Storage
//    - Aggiorna il database con il nuovo URL
```

**Nota:** Le immagini statiche in `/public/resources/` (logo, icone) possono rimanere locali.

---

## 🧪 Testing

### Test Upload Immagine:
```bash
curl -X POST http://localhost:3001/api/upload/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Test Upload GPX:
```bash
curl -X POST http://localhost:3001/api/upload/gpx \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "gpx=@/path/to/track.gpx"
```

### Test Delete:
```bash
curl -X DELETE http://localhost:3001/api/upload/delete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://storage.googleapis.com/..."}'
```

---

## ⚠️ Note Importanti

### 1. **Permessi Firebase Storage**
Assicurati che le regole di sicurezza Firebase Storage permettano:
- **Lettura pubblica** per i file (per visualizzazione nel frontend)
- **Scrittura** solo per utenti autenticati (gestito dal backend)

**Regole consigliate:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Pubblico
      allow write: if false; // Solo tramite backend (Firebase Admin)
    }
  }
}
```

### 2. **Costi Firebase Storage**
- Firebase Storage ha un tier gratuito generoso
- Monitora l'uso tramite Firebase Console
- Considera compressione immagini se necessario

### 3. **Performance**
- Gli URL Firebase Storage sono CDN-backed (veloci)
- Cache headers configurati per 1 anno
- Nessun impatto negativo sulle performance

### 4. **Backup**
- Firebase Storage è già ridondante
- Considera backup periodici se necessario

---

## 📝 Checklist Deploy

- [ ] Configurare `FIREBASE_SERVICE_ACCOUNT` su Vercel
- [ ] Configurare `FIREBASE_STORAGE_BUCKET` su Vercel (opzionale, default OK)
- [ ] Verificare regole Firebase Storage (lettura pubblica)
- [ ] Testare upload immagine
- [ ] Testare upload GPX
- [ ] Testare eliminazione file
- [ ] Verificare che le immagini vengano visualizzate correttamente nel frontend
- [ ] Verificare che i tour esistenti funzionino ancora

---

## 🐛 Troubleshooting

### Errore: "Firebase Admin not initialized"
- Verifica che `FIREBASE_SERVICE_ACCOUNT` sia configurato correttamente
- Verifica il formato JSON (deve essere una stringa JSON valida)

### Errore: "Permission denied" su Firebase Storage
- Verifica le regole di sicurezza Firebase Storage
- Verifica che il service account abbia i permessi corretti

### Immagini non visualizzate nel frontend
- Verifica che gli URL siano completi (iniziano con `https://`)
- Verifica che le regole Firebase Storage permettano lettura pubblica
- Controlla la console del browser per errori CORS

### Upload fallisce su Vercel
- Verifica che `FIREBASE_SERVICE_ACCOUNT` sia configurato
- Verifica i limiti di dimensione file (10MB)
- Controlla i log Vercel per dettagli

---

## 📚 Riferimenti

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions)
- [Multer Memory Storage](https://github.com/expressjs/multer#memorystorage)

---

## ✨ Vantaggi della Migrazione

1. ✅ **Serverless-ready** - Compatibile con Vercel e altri provider serverless
2. ✅ **Scalabile** - Firebase Storage scala automaticamente
3. ✅ **CDN-backed** - Immagini servite velocemente in tutto il mondo
4. ✅ **Nessun filesystem** - Nessun problema con permessi o spazio disco
5. ✅ **Backup automatico** - Firebase gestisce ridondanza e backup
6. ✅ **URL pubblici** - Facile condivisione e integrazione

---

**Data migrazione:** 2024
**Versione:** 1.0

