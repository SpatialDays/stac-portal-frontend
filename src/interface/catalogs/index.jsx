import axios from "axios";

export const retrieveAllPublicCatalogs = async () => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const syncAllPublicCatalogs = async () => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/sync/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const addPublicCatalog = async (
  catalogName,
  catalogURL,
  catalogDescription,
  catalogVersion
) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/`;
  const body = {
    name: catalogName,
    url: catalogURL,
    description: catalogDescription,
    stac_version: catalogVersion,
  };

  const response = await axios({
    method: "POST",
    url: url,
    data: body,
  });
  const data = await response.data;
  return data;
};

export const deleteAllPublicCatalogs = async () => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/`;
  const response = await axios({ method: "DELETE", url: url });
  const data = await response.data;
  return data;
};
