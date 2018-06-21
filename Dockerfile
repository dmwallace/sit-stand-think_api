FROM node:10-alpine as base

# Define working directory and copy source
RUN apk update
RUN apk add --no-cache tini
WORKDIR /home/node/app
ENTRYPOINT ["/sbin/tini", "--"]
COPY package.json .

FROM base AS dependencies
RUN apk update
RUN apk add --no-cache make gcc g++ python git tini
#COPY . .
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm install
#RUN npm run build

FROM base AS release
# copy production node_modules
COPY --from=dependencies /home/node/app/prod_node_modules ./node_modules
#COPY --from=dependencies /home/node/app/build ./build

# expose port and define CMD
EXPOSE 4000
#CMD node build/index.js