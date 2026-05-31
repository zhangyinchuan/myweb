FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package.json ./

# Install with npmmirror registry for speed in China
RUN npm install --registry https://registry.npmmirror.com --loglevel=warn

# Copy source
COPY . .

# Build Strapi admin
RUN NODE_ENV=production npm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy built app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.cache ./.cache
COPY . .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["node_modules/.bin/strapi", "start"]
