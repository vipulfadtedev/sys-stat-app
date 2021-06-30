# Stage 1
FROM node:14.17.1-alpine3.12 as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

# Stage 2
FROM nginx:1.20.1-alpine
COPY --from=build-step /app/build /usr/share/nginx/html