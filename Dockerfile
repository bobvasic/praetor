# syntax=docker/dockerfile:1.7
# -----------------------------------------------------------------------------
# Praetor — production Dockerfile (Next.js 14, standalone output).
# Used by DigitalOcean App Platform when Source → Dockerfile is selected.
# Bypasses the Heroku Node buildpack entirely so vendored file: deps work.
# -----------------------------------------------------------------------------

# ---------- Stage 1: install dependencies ------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy manifests + vendored packages BEFORE install so file: deps resolve.
COPY package.json package-lock.json ./
COPY vendor ./vendor

# Use `npm install` (not `npm ci`) to be tolerant of any lockfile drift
# from npm version differences. Production install excludes dev deps.
RUN npm install --no-audit --no-fund --loglevel=error

# ---------- Stage 2: build ---------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ---------- Stage 3: runtime -------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as non-root for security.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy the standalone server bundle, static assets, and public dir.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Next.js standalone server entry point.
CMD ["node", "server.js"]
