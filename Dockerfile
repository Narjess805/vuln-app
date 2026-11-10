FROM node:14  # ⚠️ Image très ancienne et vulnérable
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ⚠️ On tourne en root, pas de USER node
EXPOSE 3000
CMD ["node", "app.js"]
