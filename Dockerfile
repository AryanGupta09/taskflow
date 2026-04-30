# ── Stage 1: Build Frontend ────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Setup Backend + serve frontend ────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend from stage 1 into backend's expected path
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

# Expose port
EXPOSE 5000

# Start
CMD ["node", "server.js"]
