FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Data directory for persistent storage
RUN mkdir -p /app/data

EXPOSE 5173

CMD ["npm", "run", "dev"]
