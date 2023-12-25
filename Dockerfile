
FROM node:18-alpine
WORKDIR /socket-server
COPY . .
RUN npm install
CMD ["node", "server.ts"]
EXPOSE 3001