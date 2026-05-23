# Build Stage 
FROM node:20 AS builder 

WORKDIR /app

COPY package*.json ./

RUN nm install 

COPY . . 

RUN  npm run build 

# Nginx stage 

FROM nginx:alpine 

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/shar/nginx/html 

EXPOSE 80
