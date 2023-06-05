FROM node:16 as build-step
ARG PORTAL_BACKEND_URL
ARG PORTAL_STAC_API_BROWSER_URL
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# TODO: use ARG and pass this in from the github action
ENV REACT_APP_PORTAL_BACKEND_URL=$PORTAL_BACKEND_URL
ENV REACT_APP_PORTAL_STAC_API_BROWSER_URL=$PORTAL_STAC_API_BROWSER_URL
# echo out the env vars to make sure they are set
RUN echo $REACT_APP_PORTAL_BACKEND_URL
RUN echo $REACT_APP_PORTAL_STAC_API_BROWSER_URL
RUN npm run build

# Build step #2: build an nginx container
FROM nginx:1.19.1-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]