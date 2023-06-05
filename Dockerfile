ARG APP_PORTAL_BACKEND_URL
ARG APP_PORTAL_STAC_API_BROWSER_URL
FROM node:16 as build-step
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# TODO: use ARG and pass this in from the github action
ENV REACT_APP_PORTAL_BACKEND_URL=$APP_PORTAL_BACKEND_URL
ENV REACT_APP_PORTAL_STAC_API_BROWSER_URL=$APP_PORTAL_STAC_API_BROWSER_URL
RUN npm run build

# Build step #2: build an nginx container
FROM nginx:1.19.1-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]