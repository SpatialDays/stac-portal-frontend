# STAC Portal Frontend
Front end react app for https://github.com/SatelliteApplicationsCatapult/stac-portal-backend

# Deployment

## Build Jobs
Two build jobs set up, for building both prod and dev docker image
from Dockerfile_dev and Dockerfile_prod.

```bash
docker build -f ./Dockerfile_dev -t pdm-test:dev .
```

## Environment variables

| Var name| Used for |
| --- | --- |
|REACT_APP_PORTAL_BACKEND_URL| Setting the url of the backend for the build process.|
|REACT_APP_PORTAL_STAC_API_BROWSER_URL| Setting the url of the stac api browser viewer for the build process. Used for redirecting the user to stac assets once they are uploaded. |
|REACT_APP_BLOB_URL| Setting the url of the Azure Blob Storage URL
# Authorization
The frontend is meant to be runned on Azure App Service protected by easy auth which provides /.auth/me and /.auth/refresh endpoints for
obtaining and refreshing the access tokens. These tokens are obtained 
and attached to the header of every axios request using the auth module.

For ease of use, if /.auth/* endpoints are not present, it is assumed the app is running in the localhost mode and no token/header bussiness is performed.
