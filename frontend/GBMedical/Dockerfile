# 1. Fázis: Build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx ng build --configuration production

# 2. Fázis: Futási környezet (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist/gbmedical/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
