# ARG REACT_APP_PORTAL_BACKEND_URL=
# ARG REACT_APP_PORTAL_STAC_API_BROWSER_URL=
# ARG REACT_APP_BLOB_URL=
FROM node:16 as build-step
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_PORTAL_BACKEND_URL=https://os-eo-platform-rg-staging-stac-portal-backend.azurewebsites.net
ENV REACT_APP_PORTAL_STAC_API_BROWSER_URL=https://os-eo-plaform-stac-api-browser.azurewebsites.net
ENV REACT_APP_BLOB_URL=https://oseoinfrastagingstrgacc.blob.core.windows.net/manual-upload-storage-container
RUN npm run build

# Build step #2: build an nginx container
FROM nginx:1.19.1-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]