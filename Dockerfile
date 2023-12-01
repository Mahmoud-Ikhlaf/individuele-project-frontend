FROM node

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

RUN npm run build
RUN touch .env && \
    echo VITE_DEV_API_URL="http://localhost:8080/api/v1" >> .env && \
    echo VITE_PROD_API_URL="http://142.93.139.197:8080/api/v1" >> .env
    
EXPOSE 5000

CMD ["npm", "run", "preview"]