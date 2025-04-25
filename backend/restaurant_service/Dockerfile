FROM node:18-alpine AS deps

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production


FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/index.js"]

#docker build -t restaurant-service:latest .
#docker run -d --name restaurant-service  --env-file .env -p 4000:4000 restaurant-service:latest