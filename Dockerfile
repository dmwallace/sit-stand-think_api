FROM node:10-alpine as base

# Define working directory and copy source
RUN apk update
RUN apk add --no-cache tini
WORKDIR /home/node/app
ENTRYPOINT ["/sbin/tini", "--"]

FROM base AS dependencies
RUN apk update
RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
RUN apk add --no-cache vips make gcc g++ python git tini
COPY package.json .
RUN cat /home/node/app/package.json
#RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production

EXPOSE 4000
#CMD node build/index.js