# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Installa le dipendenze
RUN npm ci

# Genera Prisma Client
RUN npx prisma generate

# Copia il codice sorgente
COPY src ./src

# Compila TypeScript
RUN npm run build

# Crea la directory per gli uploads
RUN mkdir -p /app/public/uploads

# Esponi la porta
EXPOSE 3000

# Comando di avvio
CMD ["npm", "start"]

