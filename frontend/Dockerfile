FROM node:alpine

WORKDIR /app
COPY . .

RUN npm ci
RUN npm audit fix
CMD ["npm", "run", "build"]