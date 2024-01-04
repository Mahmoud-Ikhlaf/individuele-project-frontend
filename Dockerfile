FROM node

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

RUN npm run build
RUN touch .env && \
    echo VITE_PROD_RUNNER_WS_URL="http://api-runner.mahoot.tech/ws" >> .env && \
    echo VITE_PROD_RUNNER_API_URL="http://api-runner.mahoot.tech" >> .env && \
    echo VITE_PROD_API_URL="http://api.mahoot.tech/api/v1" >> .env
    
EXPOSE 5000

CMD ["npm", "run", "preview"]