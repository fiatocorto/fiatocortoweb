# Risoluzione Errore Firebase: auth/unauthorized-domain

## Problema
Quando si tenta di fare login da mobile, si riceve l'errore:
```
Firebase: Error (auth/unauthorized-domain)
```

Questo errore si verifica perché il dominio/origine da cui si sta tentando l'autenticazione non è nella lista dei domini autorizzati in Firebase Authentication.

## Soluzione

### 1. Accedi alla Firebase Console
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il progetto: **fiato-corto-ba53e**

### 2. Aggiungi Domini Autorizzati
1. Vai su **Authentication** (nel menu laterale)
2. Clicca su **Settings** (Impostazioni)
3. Scorri fino alla sezione **Authorized domains** (Domini autorizzati)
4. Clicca su **Add domain** (Aggiungi dominio)

### 3. Domini da Aggiungere

#### Per Sviluppo Locale (se testi da mobile sulla stessa rete):
- `localhost`
- Oppure l'IP locale del tuo computer (es: `192.168.1.100`)

#### Per Produzione:
- Il dominio del tuo sito (es: `tuosito.com`)
- Il dominio Vercel se usi Vercel (es: `tuosito.vercel.app`)

#### Per Mobile Browser:
- Se stai aprendo il sito da mobile tramite browser, aggiungi:
  - Il dominio completo del sito
  - Eventuali sottodomini

### 4. Esempio di Domini da Aggiungere

```
localhost
127.0.0.1
192.168.1.100  (sostituisci con il tuo IP locale)
tuosito.vercel.app
www.tuosito.com
tuosito.com
```

### 5. Per App Mobile Native

Se stai sviluppando un'app mobile nativa (React Native, Flutter, ecc.), devi anche:

1. **Configurare OAuth Redirects**:
   - Vai su **Authentication** → **Sign-in method**
   - Per ogni provider (Google, ecc.), configura gli **Authorized redirect URIs**
   - Aggiungi gli URI specifici per la tua app mobile

2. **Configurare SHA-1/SHA-256** (per Android):
   - Vai su **Project Settings** → **Your apps**
   - Aggiungi le fingerprint SHA-1 e SHA-256 del tuo keystore

### 6. Verifica la Configurazione

Dopo aver aggiunto i domini:
1. Attendi qualche minuto per la propagazione
2. Prova di nuovo il login da mobile
3. Se il problema persiste, verifica che:
   - Il dominio sia scritto correttamente (senza `http://` o `https://`)
   - Non ci siano spazi o caratteri speciali
   - Il dominio corrisponda esattamente a quello usato nell'app

### 7. Domini Predefiniti

Firebase include automaticamente questi domini:
- `localhost`
- `*.firebaseapp.com`
- `*.web.app`

Se stai usando uno di questi, non dovresti avere problemi. Se usi un dominio personalizzato o un IP locale, devi aggiungerlo manualmente.

## Note Importanti

⚠️ **Sicurezza**: Aggiungi solo domini di cui ti fidi. Non aggiungere domini sconosciuti o non verificati.

⚠️ **HTTPS**: In produzione, assicurati che il sito usi HTTPS. Firebase richiede HTTPS per i domini personalizzati in produzione.

⚠️ **Cache**: Dopo aver aggiunto un dominio, potrebbe essere necessario:
- Svuotare la cache del browser mobile
- Chiudere e riaprire l'app/browser
- Attendere qualche minuto per la propagazione

## Domini Attualmente Configurati

Per verificare i domini attualmente autorizzati:
1. Firebase Console → Authentication → Settings
2. Sezione "Authorized domains"

## Supporto

Se il problema persiste dopo aver seguito questi passaggi:
1. Verifica che il dominio sia stato aggiunto correttamente
2. Controlla la console del browser mobile per altri errori
3. Verifica che la configurazione Firebase nel codice corrisponda al progetto corretto

