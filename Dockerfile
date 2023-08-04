FROM node:18-alpine

WORKDIR /app

RUN yarn global add @nestjs/cli

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]