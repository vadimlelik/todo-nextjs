FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

COPY . .
RUN npm run build
