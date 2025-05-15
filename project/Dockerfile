# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies only
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV production

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set proper permissions for .next directory
RUN mkdir -p .next && chown -R node:node ./.next

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]