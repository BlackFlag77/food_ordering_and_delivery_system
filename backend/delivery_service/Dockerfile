# Use official Node.js LTS image
FROM node:18-alpine AS deps
# ensures consistent Node version :contentReference[oaicite:12]{index=12}

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production
# install only prod deps :contentReference[oaicite:13]{index=13}
# RUN npm ci --only=production

# FROM node:18-alpine
# WORKDIR /usr/src/app
# Bundle app source
COPY . .

# ENV PORT=5001
# Expose port
EXPOSE 5503

# Default command
CMD [ "npm", "start" ]
# matches your package.json start script :contentReference[oaicite:14]{index=14}
# CMD ["node","src/index.js"]