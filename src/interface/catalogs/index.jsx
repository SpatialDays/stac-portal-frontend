import axios from "axios";
import path from 'path-browserify';

// Url paths
import { backendUrl, publicCatalogsPath, syncPath } from '../../utils/paths.jsx'

export const retrieveAllPublicCatalogs = async () => {
  const url = new URL(path.join(publicCatalogsPath), backendUrl).toString();
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const syncAllPublicCatalogs = async () => {
  const url = new URL(path.join(publicCatalogsPath, syncPath), backendUrl).toString();
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
  const url = new URL(path.join(publicCatalogsPath), backendUrl).toString();
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
  const url = new URL(path.join(publicCatalogsPath), backendUrl).toString();
  const response = await axios({ method: "DELETE", url: url });
  const data = await response.data;
  return data;
};
