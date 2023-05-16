
const backendUrl = process.env.REACT_APP_PORTAL_BACKEND_URL
const stacApiBrowserUrl = process.env.REACT_APP_PORTAL_STAC_API_BROWSER_URL
const stacPath = "/stac/"
const publicCatalogsPath = "/public_catalogs/"
const privateCatalogPath = "/private_catalog/"
const collectionsPath = "/collections/"
const itemsPath = "/items/"
const getPath = "/get/"
const runSearchParametersPath = "/run_search_parameters/"
const searchPath = "/search/"
const syncPath = "/sync/"
const statusReportingPath = "/status_reporting/"
const loadingPublicStacRecordsPath = "/loading_public_stac_records/"
const validatePath = "/validate/"
const jsonPath = "/json/"
const filePath = "/file/"
const sasTokenPath = "/sas_token/"
const gdalinfoPath = "/gdal_info/"
const stacGeneratorPath = "/stac_generator/"

export {
    backendUrl,
    stacApiBrowserUrl,
    stacPath,
    publicCatalogsPath,
    privateCatalogPath,
    collectionsPath,
    itemsPath,
    getPath,
    runSearchParametersPath,
    searchPath,
    syncPath,
    statusReportingPath,
    loadingPublicStacRecordsPath,
    validatePath,
    jsonPath,
    filePath,
    sasTokenPath,
    gdalinfoPath,
    stacGeneratorPath
};
