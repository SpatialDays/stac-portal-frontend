import {retrieveAllPublicCatalogs} from "../catalogs";
import axios from "axios";
import path from 'path-browserify';

// Url paths
import { backendUrl, statusReportingPath, loadingPublicStacRecordsPath } from '../../utils/paths.jsx'

export const retrieveAllLoadStatuses = async () => {
  const catalogs = await retrieveAllPublicCatalogs();
  const url = new URL(path.join(statusReportingPath, loadingPublicStacRecordsPath, '/'), backendUrl).toString();
  const response = await axios({ method: "GET", url: url });
  const data = await response.data;
  let dataToReturn = [];
  data.forEach((record) => {
    let x = record;
    let newlyStoredCollections = [];
    record.newly_stored_collections.split(",").forEach((collection) => {
      let splitCollection = collection.split("/");
      newlyStoredCollections.push(splitCollection[splitCollection.length - 1]);
    });
    x.newly_stored_collections = newlyStoredCollections;
    let updatedCollections = [];
    record.updated_collections.split(",").forEach((collection) => {
      let splitCollection = collection.split("/");
      updatedCollections.push(splitCollection[splitCollection.length - 1]);
    });
    x.updated_collections = updatedCollections;

    let catalog = catalogs.find((catalog) => {
      return catalog.url === x.source_stac_api_url;
    });
    x.catalog = catalog;
    dataToReturn.push(x);
  });
  // return data to return sorted with highest id first
  return dataToReturn.sort((a, b) => b.id - a.id);
};
