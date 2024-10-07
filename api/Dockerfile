FROM node:latest AS builder

WORKDIR /app

COPY ./api/package*.json ./
COPY ./api/winged-signal-XXXXXXXXXXX.json ./
COPY ./api/prisma ./prisma/

RUN npm ci
RUN npm install @prisma/client
RUN npm install -g npm@latest

COPY ./api .

RUN npm run build

FROM node:latest

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/winged-signal-XXXXXXXXXXX.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/common/helpers ./src/common/helpers
COPY --from=builder /app/src/common/data ./src/common/data

EXPOSE 3001

CMD ["npm", "run", "start:migrate:prod"]
