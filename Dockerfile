FROM node:14.16.1

COPY . /app

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]