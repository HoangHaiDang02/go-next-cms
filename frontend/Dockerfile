# =================== BASE ===================
FROM node:20-alpine AS base
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install deps
RUN npm install


# =================== DEVELOPMENT ===================
FROM base AS development
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

EXPOSE 3000

# Hot reload
CMD ["npm", "run", "dev"]


# =================== PRODUCTION BUILDER ===================
FROM base AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_BASE_URL
ARG API_BASE_INTERNAL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV API_BASE_INTERNAL=${API_BASE_INTERNAL}

COPY . .

# Build app
RUN npm run build


# =================== PRODUCTION RUNTIME ===================
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]