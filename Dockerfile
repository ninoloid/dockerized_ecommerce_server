FROM node:12
WORKDIR /app
COPY package*.json ./
COPY . .
EXPOSE 3000
ENTRYPOINT ["/bin/bash", "bin/bash/./entrypoint.sh"]