#FROM node:8.2.1-alpine
#WORKDIR /app
#ADD package.json /app/package.json
#ADD www /app/www
#RUN npm install -g grunt-cli && npm install
#RUN grunt build

FROM node:8.2.1-alpine
WORKDIR /opt/app
CMD npm install && npm start