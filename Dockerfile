FROM node:20.12.2

RUN mkdir /app

WORKDIR /app

COPY . .

RUN yarn install

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ]