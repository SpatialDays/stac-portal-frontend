// Components
import { retrieveAllPublicCatalogs } from "../catalogs";

// Modules
import format from "date-fns/format";
import axios from "axios";
import path from 'path-browserify';

// Url paths
import { backendUrl, stacPath, publicCatalogsPath, privateCatalogPath, collectionsPath, itemsPath, getPath, runSearchParametersPath } from '../../utils/paths.jsx'

export const retrieveAllCollections = async () => {
  const url = new URL(path.join(stacPath, '/'), backendUrl).toString();
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const retrieveAllPublicCollections = async () => {
  const catalogs = await retrieveAllPublicCatalogs();
  const url = new URL(path.join(publicCatalogsPath, collectionsPath, '/'), backendUrl).toString();
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
  const url = new URL(path.join(privateCatalogPath, collectionsPath, '/'), backendUrl).toString();
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const deletePublicCollection = async (
  publicCatalogId,
  publicCollectionId
) => {
  const url = new URL(path.join(publicCatalogsPath, publicCatalogId, collectionsPath, publicCollectionId, '/'), backendUrl).toString();
  const response = await axios({ method: "DELETE", url: url });
  const data = await response.data;
  return data;
};

export const deletePrivateCollection = async (privateCollectionId) => {
  const url = new URL(path.join(privateCatalogPath, collectionsPath, privateCollectionId, '/'), backendUrl).toString();
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
  const url = new URL(path.join(publicCatalogsPath, parentCatalogId, itemsPath, getPath, '/'), backendUrl).toString();
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
  const url = new URL(path.join(publicCatalogsPath, '/'), backendUrl).toString();
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
  const url = new URL(path.join(publicCatalogsPath, runSearchParametersPath, storedSearchParamId.toString(), '/'), backendUrl).toString();
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  return data;
};

export const createNewCollection = async (collection) => {
  const url = new URL(path.join(privateCatalogPath, collectionsPath, '/'), backendUrl).toString();

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
  const url = new URL(path.join(privateCatalogPath, collectionsPath, collection.id, itemsPath, '/'), backendUrl).toString();

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
  const url = new URL(path.join(privateCatalogPath, collectionsPath, '/'), backendUrl).toString();
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

export const checkResponseStatus = async (collectionId, items, url, counter=0) => {
  // get the item id from the first item to check if it exists on the backend
  const itemId = Object.keys(items)[0];
  const itemUrl = new URL(path.join(stacPath, collectionId, itemsPath, itemId, '/'), backendUrl).toString();

  // tries to fetch the item by id, with a 1 second pause, 10 times before timingout 
  try {
    const response = await fetch(itemUrl);
    if (response.status === 200) {
      window.open(url, "_blank");
    } else if (counter < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      counter += 1;
      await checkResponseStatus(collectionId, items, url, counter);
    } else {
      throw new Error('Timeout error');
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
