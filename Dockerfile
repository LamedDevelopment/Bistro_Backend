FROM node:22-slim as Backend_Kalos

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --legacy-peer-deps

COPY . .

FROM node:22-slim

WORKDIR /usr/src/app

COPY --from=Backend_Kalos /usr/src/app/node_modules ./node_mudules
COPY --from=Backend_Kalos /usr/src/app/package*.json ./

EXPOSE 3000
ENTRYPOINT [ "npm", "run" ]
CMD ["dev", "prod"]
