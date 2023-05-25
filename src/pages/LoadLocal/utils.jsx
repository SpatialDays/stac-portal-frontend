// Modules
import axios from "axios";
import path from "path-browserify";

// Types
import { FileProps } from "./LoadLocal";

// Functions
import { manifestToProvider, providerToManifest } from "./consts";

import { findProvider } from "./providers/providers";

// Url paths
import {
  backendUrl,
  filePath,
  sasTokenPath,
  stacGeneratorPath,
} from "../../utils/paths.jsx";

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

  [itemID, associatedFiles] = await findProvider(file.provider).getPathsAndId(
    file,
    files
  );

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
  const url = new URL(
    path.join(filePath, sasTokenPath, file.name, "/"),
    backendUrl
  ).toString();
  const sasToken = await axios.get(url);
  const endpoint = sasToken.data.endpoint;
  const endpointWithoutSasToken = sasToken.data.endpoint_without_sas_token;
  file.endpointWithoutSasToken = endpointWithoutSasToken;

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
  const payload = {
    files: item.files.map((file) => {
      return file.endpointWithoutSasToken;
    }),
  };

  const stac_generator_url = new URL(
    path.join(stacGeneratorPath, "/"),
    backendUrl
  ).toString();
  const response = await axios.post(stac_generator_url, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.data;
  return json;
};
