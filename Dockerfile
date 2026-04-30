# ── Stage 1: Build Frontend ────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app/backend

# Install backend deps
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy frontend build INTO backend folder so path.join(__dirname, '../frontend/dist') works
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Expose port
EXPOSE 5000

CMD ["node", "server.js"]
