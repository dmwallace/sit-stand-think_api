FROM node:10-alpine
WORKDIR /usr/app

RUN apk update

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python git

COPY package.json .
RUN npm install --quiet

COPY . .