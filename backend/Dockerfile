FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 9000
CMD ["npm", "start"]
