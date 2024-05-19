FROM node:alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY custom-environment.config.js ./
ARG API_URL
ENV API_URL=${API_URL}
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
COPY . .
RUN node custom-environment.config.js
ARG ENV=prod
RUN npm run build -- --configuration=${ENV}

FROM nginx:stable
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/task-board-front-end/browser /usr/share/nginx/html
EXPOSE 80