// Components
import { retrieveAllPublicCatalogs } from "../catalogs";

// Modules
import format from "date-fns/format";
import axios from "axios";

export const retrieveAllCollections = async () => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/stac/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const retrieveAllPublicCollections = async () => {
  const catalogs = await retrieveAllPublicCatalogs();
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/collections/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    let catalog = catalogs.find((catalog) => {
      return parseInt(catalog.id) === data[i].parent_catalog;
    });
    let x = data[i];
    x.catalog = catalog;
    newData.push(x);
  }
  return newData;
};

export const retrieveAllPrivateCollections = async () => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/private_catalog/collections/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const deletePublicCollection = async (
  publicCatalogId,
  publicCollectionId
) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/${publicCatalogId}/collections/${publicCollectionId}/`;
  const response = await axios({ method: "DELETE", url: url });
  const data = await response.data;
  return data;
};

export const deletePrivateCollection = async (privateCollectionId) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/private_catalog/collections/${privateCollectionId}/`;
  const response = await axios({ method: "DELETE", url: url });
  const data = await response.data;
  return data;
};

export const callSelectiveIngester = async (
  parentCatalogId,
  collectionId,
  aoi,
  startDate,
  endDate
) => {
  let startDateString = "..";
  if (startDate) {
    const startDateDateTime = new Date(startDate);
    startDateString = format(startDateDateTime, "yyyy-MM-dd");
    startDateString = startDateString + "T00:00:00Z";
    // TODO: upgrade date picker to datetime picker and use it here
  }
  let endDateString = "..";
  if (endDate) {
    const endDateDateTime = new Date(endDate);
    endDateString = format(endDateDateTime, "yyyy-MM-dd");
    endDateString = endDateString + "T00:00:00Z";
    // TODO: upgrade date picker to datetime picker and use it here
  }

  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/${parentCatalogId}/items/get/`;
  const req_body = {
    update: true,
    bbox: aoi,
    datetime: `${startDateString}/${endDateString}`,
    collections: [collectionId],
  };
  // make axios post request to get the items
  axios.post(url, req_body).then((res) => {
    return res.data;
  });
};

export const getAllStoredSearchParameters = async () => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  let storedSearchParameters = [];
  data.forEach((catalog) => {
    catalog.stored_search_parameters.forEach((parameter) => {
      parameter.parentCatalogName = catalog.name;
      let bbox = parameter.bbox;
      let newBbox = [
        bbox[0].toFixed(3),
        bbox[1].toFixed(3),
        bbox[2].toFixed(3),
        bbox[3].toFixed(3),
      ];
      parameter.bbox = newBbox;
      storedSearchParameters.push(parameter);
    });
  });
  return storedSearchParameters;
};

export const runStoredSearchParamUpdate = async (storedSearchParamId) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/run_search_parameters/${storedSearchParamId}/`;
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const createNewCollection = async (collection) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/private_catalog/collections/`;

  const collection_json = {
    type: "Collection",
    stac_version: "1.0.0",
    id: collection.id,
    description: collection.description,
    title: collection.id,
    license: "proprietary",
    extent: {
      spatial: {
        bbox: [[-180, -90, 180, 90]],
      },
      temporal: {
        interval: [[null, null]],
      },
    },
  };
  const response = await axios({
    method: "POST",
    url: url,
    data: collection_json,
  });
  const data = await response.data;
  return data;
};

export const addItemsToCollection = async (collection, items) => {
  // POST /private_catalog/collections/{collection_id}/items/
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/private_catalog/collections/${collection.id}/items/`;

  // Loop through items object
  Object.keys(items).forEach(async (key) => {
    // Get the item

    const item = items[key];
    try {
      await axios({
        method: "POST",
        url: url,
        data: item,
      });
    } catch (error) {
      console.log("Doing put instead of post");
      await axios({
        method: "PUT",
        url: url + item.id + "/",
        data: item,
      });
      console.log("Updated item with PUT");
    }
  });
  return true;
};

export const isCollectionPrivate = (collectionId, collections) => {
  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i];
    if (collection.id === collectionId) {
      return true;
    }
  }
  return false;
};

export const addPrivateCollection = async (
  collectionId,
  collectionTitle,
  license,
  keywords,
  description,
  stacVersion
) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/private_catalog/collections/`;
  const body = {
    type: "Collection",
    id: collectionId,
    title: collectionTitle,
    license: license,
    keywords: keywords,
    description: description,
    stac_version: stacVersion,
    extent: {
      spatial: {
        bbox: [[-180, -90, 180, 90]],
      },
      temporal: {
        interval: [[null, null]],
      },
    },
  };

  const response = await axios({
    method: "POST",
    url: url,
    data: body,
  });
  const data = await response.data;
  return data;
};
