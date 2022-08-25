# base image
FROM mhart/alpine-node:14
# create & set working directory
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python2
RUN npm install --quiet node-gyp -g
RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package*.json ./
# install dependencies
RUN yarn install --verbose
RUN yarn add @vitejs/plugin-react-refresh
# RUN export NODE_OPTIONS=--openssl-legacy-provider
# start app
# RUN npm rebuild node-sass --force
# RUN npm run build --verbose
EXPOSE 3000
EXPOSE 24678
# Life is ugly, vuejs is ugliest and vitejs is even more
CMD ["yarn", "dev", "--host", "0.0.0.0"]
