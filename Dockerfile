FROM node:8.2.1-alpine

RUN apk add --no-cache git

WORKDIR /app
CMD grunt server

ADD package.json /app/package.json
RUN npm install -g grunt-cli && npm install

ADD Gruntfile.js /app/Gruntfile.js

ADD config.json /app/config.json
ADD controllers /app/controllers
ADD lib /app/lib
ADD www /app/www
ADD collectionProcessor.js /app/collectionProcessor.js
ADD server.js /app/server.js