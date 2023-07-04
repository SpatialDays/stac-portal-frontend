# STAC Portal Frontend

Front end react app for [https://github.com/SpatialDays/stac-portal-backend](https://github.com/SpatialDays/stac-portal-backend)

## Deployment

### Build Jobs

Two build jobs are set up for building both prod and staging docker images.

| Var name| Used for |
| --- | --- |
|REACT_APP_PORTAL_BACKEND_URL| Setting the url of the backend for the build process.|
|REACT_APP_PORTAL_STAC_API_BROWSER_URL| Setting the url of the stac api browser viewer for the build process. Used for redirecting the user to stac assets once they are uploaded. |
|REACT_APP_BLOB_URL| Setting the url of the Azure Blob Storage URL |
|REACT_APP_PORTAL_GEOPROJECTOR_URL| Setting the url of the Geo Projector microservice
# Authorization
The frontend is meant to be run on Azure App Service protected by easy auth, which provides `/.auth/me` and `/.auth/refresh` endpoints for obtaining and refreshing access tokens. These tokens are obtained and attached to the headers of every Axios request using the auth module.

For ease of use, if `/.auth/*` endpoints are not present, it is assumed that the app is running in the localhost mode, and no token/header business is performed.

