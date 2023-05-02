// React
import { useEffect, useState } from "react";

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
  processTiff,
  groupFilesByID,
  generateSTAC,
} from "./utils";
import { addItemsToCollection } from "interface/collections";

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
          isMetadata(file.originalName) &&
          !file.started &&
          !file.complete
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

          // If file not a TIFF, mark as complete
          if (file.type === "image/tiff") {
            const response = await processTiff(file);
            file.complete = true;
            file.GDALInfo = response;
          } else {
            file.complete = true;
          }

          setFiles([...files]);
          return response;
        });

      // Resolve all promises with a progress bar
      await Promise.all(uploadPromises);

      // Now to generate the STAC with the items we have
      const items = groupFilesByID(files);

      // TODO: if items.any((item) => item.files.any((file) => file.GDALInfo.error) display an error

      Object.keys(items).forEach(async (itemID) => {
        const item = items[itemID];
        // If item not already STAC processed (itemID not in stac state)
        if (item.complete === true && !stac[item.itemID]) {
          //if (checkItemCount(item)) {
          const stacJSON = await generateSTAC(item);

          // Add itemID and stacJSON to stac state
          setStac((prev) => {
            return {
              ...prev,
              [item.itemID]: stacJSON,
            };
          });
          //}
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

    // Wait for 2 seconds and then redirect to collection
    setTimeout(() => {
      window.open(
        `${process.env.REACT_APP_PORTAL_STAC_API_BROWSER_URL}/collections/${selectedCollection.id}`,
        "_blank"
      );
    }, 2000);
  };

  return (
    <DashboardLayout>
      <MDBox>
        <Grid container spacing={6}>
          {/* Step 1 - Upload */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <MDTypography variant="h5">
                Step 1 - Select Folder(s)
              </MDTypography>
              <MDTypography variant="overline" mb={2}>
                Drag and drop the folder containing the imagery files from your
                source provider e.g. Planet, Maxar etc.
              </MDTypography>

              <MDBox
                style={{
                  display: "flex",
                  height: "100%",
                  marginTop: "2em",
                }}
              >
                {/* Directory folder upload */}
                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
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
                    style={{
                      boxSizing: "border-box",
                      width: "100%",
                      padding: "1rem",
                      height: "250px",
                      maxWidth: "1000px",
                    }}
                  >
                    <MDBox
                      style={{
                        // Scroll bar
                        overflowY: "scroll",
                        height: "100%",
                        width: "100%",
                        border: "1px dotted #ccc",
                        paddingTop: "0.5em",
                      }}
                    >
                      {errorFiles.map((file) => {
                        return (
                          <MDBox
                            key={Math.random().toString(36).substring(7)}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              paddingLeft: "2em",
                              paddingRight: "2em",
                              boxSizing: "border-box",
                              height: "1.5em",
                            }}
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
            style={{
              marginTop: "3rem",
            }}
          >
            <MDBox>
              <Card
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
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
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    minWidth: "450px",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <MDTypography variant="h5">
                    Step 5 - View STAC Records
                  </MDTypography>
                  <MDButton
                    onClick={publish}
                    buttonType="create"
                    disabled={!selectedCollection}
                    // If not selected collection make gray
                    style={{
                      backgroundColor: selectedCollection ? "#54A19A" : "#ccc",
                      cursor: selectedCollection ? "pointer" : "none",
                    }}
                  >
                    Publish All
                  </MDButton>
                </MDBox>

                <MDTypography
                  variant="overline"
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  View the newly created STAC records for each item.
                </MDTypography>
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
  GDALInfo: Object,
  GDALProcessing: boolean,

  // Data attributes
  itemID: string,
  sasToken: string,
  blob?: Blob,
  data?: any,
  provider?: string,
};

export default LoadLocal;
