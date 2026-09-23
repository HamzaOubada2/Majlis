# ==========================================
# STAGE 1: Development & Build
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ==========================================
# STAGE 2: Production Run
# ==========================================
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]