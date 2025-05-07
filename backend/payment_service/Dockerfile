# Use Node.js 18 official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files first and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose the port your app uses (6000)
EXPOSE 6000

# Command to start app
CMD ["node", "src/index.js"]
