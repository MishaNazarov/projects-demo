#!/bin/sh

# in Bridge mode
LISTEN_PORT=80

# check launch in mesos with docker network with type host
if [ -z "$PORT_80" ]; then
  if [ -n "$PORT0" ]; then
    LISTEN_PORT=$PORT0
  fi
fi

LISTEN_PORT=$LISTEN_PORT envsubst '$LISTEN_PORT' < /etc/nginx/nginx.conf.template >/etc/nginx/nginx.conf
echo "PORT_80: $PORT_80"
echo "PORT0: $PORT0"
echo "LISTEN_PORT: $LISTEN_PORT"
cat /etc/nginx/nginx.conf
exec /usr/sbin/nginx -g "daemon off;"