FROM node:8.2.1-alpine
WORKDIR /app
ADD package.json /app/package.json
ADD public /app/public
ADD src /app/src
ADD webpack.config.js /app/webpack.config.js
ADD webpack.prod.config.js /app/webpack.prod.config.js
RUN npm install
RUN npm run build-prod