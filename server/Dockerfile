FROM node:14
COPY ./ /app
WORKDIR /app
RUN npm install && npm run build
WORKDIR /app/lib
CMD [ "node", "index.js" ]