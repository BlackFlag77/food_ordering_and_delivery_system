# Stage 1: install dependencies
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Copy package manifests
COPY package.json package-lock.json ./

# Install only production deps
RUN npm ci --only=production

# Stage 2: build final image
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Copy production node_modules and app source
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Default to production
ENV NODE_ENV=production

# If you use a .env, we’ll pass it in at runtime; expose your port
EXPOSE 5000

# Launch your service
CMD ["node", "src/index.js"]
