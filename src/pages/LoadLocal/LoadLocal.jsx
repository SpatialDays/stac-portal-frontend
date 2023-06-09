// React
import { useEffect, useState } from "react";

// Modules
import path from "path-browserify";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dropzone from "./components/Dropzone";
import CollectionSelect from "./components/CollectionSelect";
import STACTable from "./components/STACTable";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Tooltip } from "@mui/material";

// Layout components
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

// Styles
import "./style.scss";

// Constants
import { isMetadata } from "./consts";

// Utils
import {
  readManifest,
  processManifest,
  uploadFile,
  groupFilesByID,
  generateSTAC,
} from "./utils";
import {
  addItemsToCollection,
  checkResponseStatus,
} from "interface/collections";

// Url paths
import { stacApiBrowserUrl, collectionsPath } from "../../utils/paths.jsx";

const LoadLocal = () => {
  const [files, setFiles] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState();
  const [errorFiles, setErrorFiles] = useState([]);
  const [showErrorFiles, setShowErrorFiles] = useState(false);
  const [stac, setStac] = useState({});

  useEffect(() => {
    const handleFileUpload = async (e) => {
      // Check for unprocessed metadata files
      const metafiles = files.filter(
        (file) =>
          isMetadata(file.originalName) && !file.started && !file.complete
      );

      if (!metafiles.length) {
        return;
      }

      // Read each metadata file
      const promises = metafiles.map((file) => {
        return readManifest(file);
      });
      // Resolve all promises
      await Promise.all(promises);

      // Process each metadata file and group associated files by item ID
      const processed = metafiles.map((file) => {
        return processManifest(file, files);
      });
      // Resolve all promises
      await Promise.all(processed);

      // Start the file upload and processing
      // Filter the files,, the other files should be marked as error
      let errors = [];
      files
        .filter((file) => file.itemID)
        // Remove any duplicate files if they have the same name
        .filter((file, index, self) => {
          if (index !== self.findIndex((f) => f.name === file.name)) {
            file.error = true;
            file.errorMessage = "Duplicate file name";
            file.started = false;

            // Remove from files state
            files.splice(files.indexOf(file), 1);

            // Add to errors
            errors.push(file);
          }

          return index === self.findIndex((f) => f.name === file.name);
        });

      // All files without an item ID are marked as error
      files
        .filter((file) => !file.itemID)
        .forEach((file) => {
          file.error = true;
          file.errorMessage = "No record in metadata file";
          file.started = false;

          // Remove from files state
          files.splice(files.indexOf(file), 1);
          //setErrorFiles([...errorFiles, file]);
          errors.push(file);
        });

      // Append to error files
      setErrorFiles([...errorFiles, ...errors]);

      // Update the files
      setFiles([...files]);

      const uploadPromises = files
        // Filter by not complete
        .filter((file) => !file.complete)
        .map(async (file) => {
          const response = await uploadFile(file);
          // Set complete to true
          file.complete = true;

          setFiles([...files]);
          return response;
        });

      // Resolve all promises with a progress bar
      await Promise.all(uploadPromises);

      // Now to generate the STAC with the items we have
      const items = groupFilesByID(files);

      Object.keys(items).forEach(async (itemID) => {
        const item = items[itemID];
        // If item not already STAC processed (itemID not in stac state)
        if (item.complete === true && !stac[item.itemID]) {
          const stacJSON = await generateSTAC(item);

          // Add itemID and stacJSON to stac state
          setStac((prev) => {
            return {
              ...prev,
              [item.itemID]: stacJSON,
            };
          });
        }
      });
    };

    handleFileUpload();
  }, [files]);

  const publish = async () => {
    // if stac empty object, alert
    if (Object.keys(stac).length === 0) {
      alert("No items to publish");
      return;
    }
    await addItemsToCollection(selectedCollection, stac);

    // url to the updated collection
    const url = new URL(
      path.join(collectionsPath, selectedCollection.id, "/"),
      stacApiBrowserUrl
    ).toString();

    // checks the status of the items being published to the collection and redirects once the items are published
    await checkResponseStatus(selectedCollection.id, stac, url);
  };

  return (
    <DashboardLayout>
      <MDBox>
        <Grid container spacing={6}>
          {/* Step 1 - Upload */}
          <Grid item xs={12}>
            <Card
              className="local-load-card"
            >
              <MDTypography variant="h5">
                Step 1 - Select Folder(s)
              </MDTypography>
              <MDTypography variant="overline" mb={2}>
                Click the dropzone to upload the imagery files from your source
                provider e.g. Planet, Maxar etc.
              </MDTypography>

              <MDBox
                className="local-load-card-box__select-folder"
              >
                {/* Directory folder upload */}
                <MDBox
                  className="local-load-card-box__select-folder-upload"
                >
                  {/* Dropzone */}
                  <Dropzone files={files} setFiles={setFiles} />
                </MDBox>
              </MDBox>
              {/* Button for show errors */}
              {errorFiles.length > 0 && (
                <MDButton
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setShowErrorFiles(!showErrorFiles);
                  }}
                >
                  {showErrorFiles ? "Hide" : "Show"} Error Files (
                  {errorFiles.length})
                </MDButton>
              )}
              {/* Error files */}
              {showErrorFiles && (
                <MDBox>
                  <MDBox
                    className="error-files-box"
                  >
                    <MDBox
                      className="error-files-box__scroll"
                    >
                      {errorFiles.map((file) => {
                        return (
                          <MDBox
                            className="error-files-box-content"
                            key={Math.random().toString(36).substring(7)}
                          >
                            <MDTypography variant="overline">
                              {file.originalName}
                            </MDTypography>
                            <MDTypography variant="overline">
                              {file.errorMessage}
                            </MDTypography>
                          </MDBox>
                        );
                      })}
                    </MDBox>
                  </MDBox>
                </MDBox>
              )}
            </Card>
          </Grid>

          {/* Step 4 - Choose Collection */}
          <Grid
            item
            xs={12}
          >
            <MDBox>
              <Card
                className="local-load-card"
              >
                <MDTypography variant="h5">
                  Step 4 - Choose Collection
                </MDTypography>
                <MDTypography
                  variant="overline"
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  Choose a collection to add your new STAC items to.
                </MDTypography>
                <MDBox>
                  <CollectionSelect
                    selectedCollection={selectedCollection}
                    setSelectedCollection={setSelectedCollection}
                  />
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          {/* Step 5 - Create STAC Metadata */}
          <Grid item xs={12}>
            <MDBox>
              <Card
                className="local-load-card"
              >
                <MDBox
                  className="local-load-card-box__create-metadata"
                >
                  <MDTypography variant="h5">
                    Step 5 - View STAC Records
                  </MDTypography>
                  <Tooltip title="Publish all items to the selected collection">
                    <MDButton
                      onClick={publish}
                      buttonType="create"
                      disabled={!selectedCollection}
                      style={{
                        backgroundColor: selectedCollection
                          ? "var(--osweb-color-secondary)"
                          : "#ccc",
                        cursor: selectedCollection ? "pointer" : "none",
                      }}
                    >
                      Publish All
                    </MDButton>
                  </Tooltip>
                </MDBox>

                <MDTypography
                  variant="overline"
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  View the newly created STAC records for each item.
                </MDTypography>
                <MDButton
                  className="publish-all-mobile-button"
                  onClick={publish}
                  buttonType="create"
                  disabled={!selectedCollection}
                  style={{
                    backgroundColor: selectedCollection
                    ? "var(--osweb-color-secondary)"
                    : "#ccc",
                    cursor: selectedCollection ? "pointer" : "none",
                  }}
                    >
                  Publish All
                </MDButton>
                <STACTable files={files} stac={stac} />
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

// Type for file props
export type FileProps = {
  // Basic file properties
  originalName: string,
  name: string,
  path: string,
  size: number,
  type: string,

  // Frontend attributes
  started: boolean,
  progress: number,
  complete: boolean,
  error: boolean,
  errorMessage: string,

  // Data attributes
  itemID: string,
  sasToken: string,
  endpoint: string,
  endpointWithoutSasToken: string,
  blob?: Blob,
  data?: any,
  provider?: string,
};

export default LoadLocal;
