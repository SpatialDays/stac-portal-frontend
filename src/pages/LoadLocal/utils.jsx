// Modules
import axios from "axios";

// Types
import { FileProps } from "./LoadLocal";

// Functions
import { manifestToProvider, providerToManifest } from "./consts";

import {findProvider} from "./providers/providers"

export const readManifest = async (file: FileProps) => {
  // Async function to read the manifest file
  file.provider = manifestToProvider(file.originalName);

  // Set the file as started
  file.started = true;

  // Read the file, this can be an XML or JSON file
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = (e) => {
      file.content = e.target.result;

      // If XML, parse the XML
      if (file.originalName.endsWith(".xml")) {
        const parser = new DOMParser();
        file.data = parser.parseFromString(file.content, "text/xml");
      }

      // If JSON, parse the JSON
      if (file.originalName.endsWith(".json")) {
        file.data = JSON.parse(file.content);
      }

      resolve();
    };
    reader.onerror = (e) => {
      reject(e);
    };
  });
  reader.readAsText(file.blob);
  return promise;
};

export const processManifest = async (file: FileProps, files: []) => {
  let associatedFiles, itemID;

  [itemID, associatedFiles] = await findProvider(file.provider).getPathsAndId(file, files);

  associatedFiles.forEach((associatedFile) => {
    associatedFile.itemID = itemID;
    associatedFile.started = true;
    associatedFile.name = itemID + "_" + associatedFile.originalName;
    associatedFile.provider = file.provider;
  });

  // Same for the metadata file
  file.name = itemID + "_" + file.originalName;
  file.itemID = itemID;
};

export const uploadFile = async (file: FileProps) => {
  const sasToken = await axios.get(
    `${process.env.REACT_APP_PORTAL_BACKEND_URL}/file/sas_token/${file.name}/`
  );

  const endpoint = sasToken.data.endpoint;
  
  // Upload the file
  const uploaderInstance = axios.create();
  const response = await uploaderInstance.put(endpoint, file.blob, {
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-blob-content-disposition": "attachment",
      "content-type": "any",
    },
  });

  return response;
};

export const processTiff = async (file: FileProps) => {
  let url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/gdal_info/`;
  const fileName = process.env.REACT_APP_BLOB_URL + file.name;

  const response = await axios.post(
    url,
    {
      file_url: fileName,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.data;
  return data;
};

export const groupFilesByID = (files) => {
  return files.reduce((acc, file) => {
    if (file.itemID) {
      // Create object
      const obj = {
        itemID: file.itemID,
        count: 1,
        files: [file],
        complete: true,
        provider: file.provider,
      };

      // Check if itemID already exists in accumulator
      const index = acc.findIndex((item) => item.itemID === file.itemID);
      // If it does, increment count and error is not true
      if (index !== -1 && !acc[index].error) {
        acc[index].count += 1;
        acc[index].files.push(file);
        // If any file.completed is false, set completed to false
        if (!file.complete) {
          acc[index].complete = false;
        }
      }

      // If it doesn't, add it to the accumulator
      else {
        acc.push(obj);
      }
      return acc;
    } else {
      return acc;
    }
  }, []);
};


export const generateSTAC = async (item) => {
  // Gather all files that gdalInfo is not null
  const filesWithGdalInfo = item.files.filter((file) => file.GDALInfo !== null);

  // Read the geoms from the Tiffs (can be multiple)
  const projGeoms = filesWithGdalInfo.map(
    (file) => file.GDALInfo.cornerCoordinates
  );
  const wgs84Geoms = filesWithGdalInfo.map((file) => file.GDALInfo.wgs84Extent);

  // URL
  const url = filesWithGdalInfo.find(
    (file) => file.GDALInfo.description !== null
  ).GDALInfo.description;

  // WKT
  const with_wkt = filesWithGdalInfo.find(
    (file) => file.GDALInfo.coordinateSystem && file.GDALInfo.coordinateSystem.wkt !== null
  )
  let wkt = "";
  if (with_wkt) {
    wkt = with_wkt.GDALInfo.coordinateSystem.wkt;
  }

  // Assets
  const assets = filesWithGdalInfo.map((file) => {
    const asset = {
      href: file.GDALInfo.description,
      transform: file.GDALInfo.geoTransform,
      shape: file.GDALInfo.size,
      type: file.GDALInfo.driverLongName,
      filename: file.name,
      bands: file.GDALInfo.bands.map((band) => {
        return {
          name: band.colorInterpretation,
          description: band.description,
          type: band.type,
          band: band.band,
          block: band.block,
        };
      }),
    };
    return asset;
  });

  // All other assets except the Tiffs
  const otherAssets = item.files.filter((file) => file.GDALInfo === null);

  /**
   * We can read some files from frontend, without having to make a request to the backend
   * Dependent on provider
   */
  // Time Acquired
  let timeAcquired;
  let additional;

  [timeAcquired, additional] = await findProvider(item.provider).getAdditionalInfo(item);

  const payload = {
    assets: assets,
    groupedVariables: {
      proj_geom: projGeoms,
      wgs84_geom: wgs84Geoms,
    },
    staticVariables: {
      id: item.itemID,
      url: url,
      wkt: wkt,
      time_acquired: timeAcquired,
      provider: item.provider,
    },

    otherAssets: otherAssets,
    additional: additional,
  };

  let backend_url = process.env.REACT_APP_PORTAL_BACKEND_URL;
  let body = {
    metadata: payload,
  };
  const response = await axios.post(
    backend_url + "/stac_generator/",

    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.data;

  return json;
};
