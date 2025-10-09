# ===== STAGE 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== STAGE 2: Run =====
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Копируем только нужное
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Устанавливаем только runtime-зависимости
RUN npm ci --omit=dev

EXPOSE 3000

# 🟢 Важно: команда запуска приложения
CMD ["npm", "start"]
