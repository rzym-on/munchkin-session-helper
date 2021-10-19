FROM node:14
COPY ./ /app
WORKDIR /app
RUN npm install && npm run build
WORKDIR /app/lib
EXPOSE 2567
CMD [ "node", "index.js" ]