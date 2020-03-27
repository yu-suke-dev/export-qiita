FROM node:alpine3.11
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY tsconfig.json index.ts entrypoint.sh ./
CMD ["sh", "entrypoint.sh"]
