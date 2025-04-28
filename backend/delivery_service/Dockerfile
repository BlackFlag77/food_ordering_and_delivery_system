# Ensures consistent Node version across environments
FROM node:18-alpine AS deps

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

# Install application dependencies (only prod deps)
RUN npm ci --only=production
# RUN npm install --production  # all dependencies

FROM node:18-alpine
WORKDIR /usr/src/app

# Bundle app source (rest of the application code)
COPY . .

ENV PORT=5503
# Expose the port the service listens on
EXPOSE 5503

# Default command (command to run the application)
CMD [ "npm", "start" ]