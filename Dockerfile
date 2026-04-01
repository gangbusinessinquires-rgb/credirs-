FROM node:20

WORKDIR /app

COPY backend .

RUN npm install

CMD ["node", "server.js"]
