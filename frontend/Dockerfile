FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances en premier (cache Docker)
COPY package.json package-lock.json* ./

RUN npm install

# Copie du reste du projet
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
