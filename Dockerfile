# ======================
# 🏗️ STAGE 1 — Build
# ======================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Аргументы сборки (если нужны)
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

COPY . .
RUN npm run build

# ======================
# 🚀 STAGE 2 — Runtime
# ======================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копируем только нужные файлы
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
