# ======================
# 🏗️ STAGE 1 — Build
# ======================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

COPY . .
RUN npm run build

# ======================
# 🚀 STAGE 2 — Run
# ======================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копируем только нужные файлы
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Устанавливаем только runtime-зависимости
RUN npm ci --omit=dev

EXPOSE 3000

# Важно: запускаем продакшн-сервер Next.js
CMD ["npm", "start"]
