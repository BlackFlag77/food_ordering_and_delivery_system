# Use official Node.js LTS image
FROM node:18-alpine AS deps
# ensures consistent Node version

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

# Install application dependencies
# RUN npm install --production
# install only prod deps
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /usr/src/app
# Bundle app source (rest of the application code)
COPY . .

ENV PORT=5503
# Expose the port the service listens on
EXPOSE 5503

# Default command (command to run the application)
CMD [ "npm", "start" ]
# matches package.json start script
# CMD ["node","src/index.js"]