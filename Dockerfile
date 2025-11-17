# Multi-stage Dockerfile for Next.js Application
# This builds the application in a builder stage and creates a minimal runtime image

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
# Increase Node.js heap size for build (4GB)
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Provide dummy database URL for build (won't actually connect)
ENV POSTGRES_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# Skip static page generation during build (pages will be generated on-demand at runtime)
ENV SKIP_ENV_VALIDATION=true

# Build the application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat wget

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Clear NODE_OPTIONS from build stage
ENV NODE_OPTIONS=""

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
