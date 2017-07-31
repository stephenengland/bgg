#FROM node:8.2.1-alpine
#WORKDIR /app
#ADD package.json /app/package.json
#ADD www /app/www
#RUN npm install -g grunt-cli && npm install
#RUN grunt build

FROM nginx:1.13.3-alpine
#COPY --from=0 /app/dist/ /usr/share/nginx/html/
ADD www/ /usr/share/nginx/html/
ADD nginx.conf /etc/nginx/nginx.conf