FROM node:14
WORKDIR /app/
COPY package*.json ./
RUN npm ci --only=production
COPY ./lib/ /app/
EXPOSE 2567
CMD [ "node", "index.js" ]