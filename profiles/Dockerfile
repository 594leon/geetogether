FROM node:alpine

WORKDIR /app

COPY package.json .

#-only=prod: prod是指production 意思為只安裝package.json的dependencies裡的套件，忽略devDependencies裡的套件
RUN npm install -only=prod

COPY . .

CMD ["npm", "start"]