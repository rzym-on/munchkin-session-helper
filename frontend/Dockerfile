FROM node:19 as npm-build
WORKDIR /app
COPY ./ /app
RUN npm install && npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=npm-build /app/dist/spa /app
COPY nginx.conf /etc/nginx/nginx.conf