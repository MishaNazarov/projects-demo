FROM nginx:alpine
RUN apk update && \
	mkdir /www /etc/letsencrypt

RUN apk add --no-cache --virtual /.build-deps nodejs yarn

COPY . /www/
COPY package.json /www/
COPY .env /www/

RUN cd /www \
    && yarn install \
    && yarn build

RUN rm -Rf /www/src /www/yarn.lock /www/package.json /www/node_modules

COPY ./nginx.conf.template /etc/nginx/nginx.conf.template
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
RUN chown -R nginx:nginx /www

RUN apk del /.build-deps

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
