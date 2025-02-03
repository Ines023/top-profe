FROM node:20.12.2

RUN mkdir /app

WORKDIR /app

COPY . .

ENV NODE_ENV=development

RUN npm config set registry https://registry.npmjs.org/
RUN yarn config set registry https://registry.npmjs.org/
RUN yarn config set network-timeout 600000
RUN yarn config list

RUN yarn install

EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ]