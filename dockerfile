FROM node:hydrogen-alpine3.20
WORKDIR /app
COPY package*.json ./
COPY . .
# COPY .env .env
RUN npm i -g pnpm
RUN pnpm i
EXPOSE 8080
RUN pnpm build
ENTRYPOINT [ "npm", "start" ]
