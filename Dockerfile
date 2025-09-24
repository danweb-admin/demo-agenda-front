# Use Node 16 para compilar
FROM node:16.20.2 as build

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@8
RUN npm ci
COPY . .
RUN npm run build --prod

# Servir app com nginx
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
