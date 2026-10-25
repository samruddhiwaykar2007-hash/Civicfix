# Production Dockerfile for Google Cloud Run & Google Cloud Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies (including devDependencies required for build)
RUN npm install

# Copy application sources
COPY . .

# Build production bundle with Vite
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package manifests and install production runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev && npm install tsx@^4.19.2

# Copy built frontend assets and server files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Cloud Run defaults to port 8080
EXPOSE 8080

# Start server using tsx
CMD ["node", "./node_modules/tsx/dist/cli.mjs", "server.ts"]
