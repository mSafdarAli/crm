FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN npm i && npm run build:ssr

# Stage 2 Run with PM2

FROM node:16-alpine


RUN npm i -g pm2

WORKDIR /app

RUN mkdir dist

COPY --from=builder /app/dist /app/dist

CMD ["pm2-runtime", "dist/front-end-kevi/server/main.js"]