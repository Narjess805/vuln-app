# --- Étape 1 : Build ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# --- Étape 2 : Runtime ---
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# ✅ Création d'un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copie des fichiers avec les bons droits
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/package.json ./
COPY --from=build --chown=appuser:appgroup /app/app.js ./

# ✅ On passe sur l'utilisateur non-root
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "app.js"]
