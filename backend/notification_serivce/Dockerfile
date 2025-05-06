# 1) Use a lightweight Node base
FROM node:18-alpine

# 2) Create app directory
WORKDIR /usr/src/app

# 3) Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# 4) Bundle source
COPY src ./src

# 5) Expose the port your service listens on
EXPOSE 7000

# 6) Start the service
CMD ["node", "src/index.js"]
