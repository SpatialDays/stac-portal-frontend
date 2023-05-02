// React
import { useEffect, useState } from "react";

// Components
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// @mui components
import { CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Interface
import {
  createNewCollection,
  retrieveAllPrivateCollections,
} from "interface/collections";

// Styles
import "./style.scss";

const CollectionSelect = ({ setSelectedCollection }) => {
  const [collections, setCollections] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    id: "",
    description: "",
  });
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const getCollections = async () => {
      const allCollections = await retrieveAllPrivateCollections();
      const collectionsFormatted = allCollections.map((collection, index) => {
        return {
          label: collection.id,
          id: collection.id,
        };
      });
      setCollections(collectionsFormatted);
    };
    getCollections();
  }, []);

  const createCollection = async () => {
    await createNewCollection(newCollection);

    // Get new collections
    const allCollections = await retrieveAllPrivateCollections();
    const collectionsFormatted = allCollections.map((collection, index) => {
      return {
        label: collection.id,
        id: collection.id,
      };
    });
    setCollections(collectionsFormatted);
    setOpenModal(false);
    setShowLoading(false);

    // Set selected collection
    setSelectedCollection(newCollection);
  };

  return (
    <>
      {/* Either select an existing selection or create a new one */}

      {/* First box is to choose existing collection using a dropdown which is searchable */}
      <MDBox
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap",
        }}
        id="collection-select"
      >
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "16px",
            width: "50%",
            minWidth: "400px",
          }}
        >
          <MDTypography variant="h6">
            Choose an existing collection
          </MDTypography>
          <MDTypography variant="overline" mb={2}>
            Choose a collection from your organisation's existing Catalog.
          </MDTypography>
          <MDBox
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              minWidth: "450px",
            }}
          >
            <Autocomplete
              options={collections || []}
              // If options is empty, then don't show no collections found
              noOptionsText={collections ? "" : "No collections found"}
              sx={{ width: 300, height: "3rem" }}
              size="small"
              // Small font
              text
              renderInput={(params) => (
                <TextField {...params} label="Choose Collection" />
              )}
              onChange={(event, value) => {
                setSelectedCollection(value);
              }}
            />
          </MDBox>
        </MDBox>

        {/* Arrow */}
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "5%",
          }}
        >
          <MDTypography
            variant="h6"
            sx={{
              color: "#119F9A",
            }}
          >
            OR
          </MDTypography>
        </MDBox>

        {/* Second box is to create a new collection */}
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "16px",
            width: "40%",
          }}
        >
          <MDTypography variant="h6">Create a new collection</MDTypography>
          <MDTypography variant="overline" mb={2}>
            Create a new collection to add to your organisation's existing
            Catalog.
          </MDTypography>
          <MDBox
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              minWidth: "450px",
            }}
          >
            <MDButton
              buttonType="create"
              onClick={() => {
                setOpenModal(true);
              }}
              sx={{
                width: "30%",
                minWidth: "200px",
              }}
            >
              Create
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Modal to create a new collection */}
      {openModal && (
        <MDBox
          className="modal"
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <MDBox
            className="modal-content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {!showLoading ? (
              <>
                <MDBox
                  style={{
                    marginBottom: "16px",
                  }}
                >
                  <MDTypography variant="h4">
                    Create a new collection
                  </MDTypography>
                  <MDTypography variant="overline">
                    Create a new collection to add to your organisation's
                    existing Catalog.
                  </MDTypography>
                </MDBox>
                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "30%",
                    minWidth: "450px",
                  }}
                >
                  {/* Form with collection name */}
                  {/* Input */}
                  <MDInput
                    label="Collection Name"
                    placeholder="Enter collection name"
                    onChange={(event) => {
                      setNewCollection({
                        ...newCollection,
                        id: event.target.value,
                      });
                    }}
                    autoComplete="off"
                    autoFocus={true}
                    sx={{ mb: 2 }}
                  />

                  {/* Description */}
                  <MDInput
                    label="Description"
                    placeholder="Enter description"
                    onChange={(event) => {
                      setNewCollection({
                        ...newCollection,
                        description: event.target.value,
                      });
                    }}
                    autoComplete="off"
                    sx={{ mb: 2 }}
                  />

                  {/* Button */}
                  <MDButton
                    buttonType="create"
                    className="btn-full-width"
                    onClick={() => {
                      if (
                        newCollection.id === "" ||
                        newCollection.description === ""
                      ) {
                        alert("Please fill in all fields");
                        return;
                      }
                      setShowLoading(true);
                      createCollection();
                    }}
                  >
                    Create
                  </MDButton>
                </MDBox>
              </>
            ) : (
              <MDBox
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress
                    // BLue
                    sx={{
                      color: "#54A19A",
                    }}
                  />
                  <MDTypography variant="h5" mt={2}>
                    Creating Collection...
                  </MDTypography>
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      )}
    </>
  );
};

export default CollectionSelect;
