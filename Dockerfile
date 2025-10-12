# ======================
# 🏗️ Build Stage
# ======================
FROM node:20-alpine AS builder
WORKDIR /app

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ======================
# 🚀 Run Stage
# ======================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
