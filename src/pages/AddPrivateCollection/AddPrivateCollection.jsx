// React
import React, { useEffect, useState } from "react";

// Layout
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

// @mui components
import Card from "@mui/material/Card";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Interface
import { addPrivateCollection } from "interface/collections";

const AddPrivateCollection = () => {
  const [collectionId, setCollectionId] = useState("");
  const [collectionTitle, setCollectionName] = useState("");
  const [license, setLicense] = useState("proprietary");
  const [keywords, setKeywords] = useState([]);
  const [description, setDescription] = useState("");
  const [stacVersion, setStacVersion] = useState("1.0.0");

  useEffect(() => {}, []);
  const handleSubmit = async () => {
    try {
      await addPrivateCollection(
        collectionId,
        collectionTitle,
        license,
        keywords,
        description,
        stacVersion
      );
      window.alert("Collection added successfully");
    } catch (error) {
      window.alert(error.response.data.message);
    }
  };
  return (
    <DashboardLayout>
      <MDBox>
        <MDBox sx={{ pt: 3 }}>
          <Card className="card-title">
            <MDTypography variant="h4" >
              Add Private Collection
            </MDTypography>
          </Card>
          <br></br>
          <MDBox
            display="flex"
            flexDirection="column"
            width="30%"
            minWidth="450px"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              minWidth: "450px",
            }}
          >
            <Card
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div>
                <MDInput
                  label="Collection Title"
                  placeholder="Enter collection title"
                  onChange={(event) => {
                    setCollectionName(event.target.value);
                    // split the string by spaces and add - to the end of each word
                    // then join the array back into a string
                    let id = event.target.value
                      .split(" ")
                      .map((word) => word + "-")
                      .join("")
                      .slice(0, -1);
                    setCollectionId(id);
                  }}
                  autocomplete="off"
                  required={true}
                  sx={{ mb: 2 }}
                />

                <MDInput
                  label="Collection ID"
                  placeholder="Enter collection ID"
                  onChange={(event) => {
                    setCollectionId(event.target.value);
                  }}
                  value={collectionId}
                  autocomplete="off"
                  required={true}
                  sx={{ mb: 2 }}
                />

                <MDInput
                  label="Description"
                  placeholder="Enter description"
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  autocomplete="off"
                  sx={{ mb: 2 }}
                />

                <MDInput
                  label="Enter keywords separated by commas"
                  placeholder="Enter keywords separated by commas"
                  onChange={(event) => {
                    let keywords = event.target.value.split(",");
                    setKeywords(keywords);
                  }}
                  autocomplete="off"
                  sx={{ mb: 2 }}
                />

                <MDInput
                  value={license}
                  label="License"
                  placeholder="Enter license"
                  onChange={(event) => {
                    setLicense(event.target.value);
                  }}
                  autocomplete="off"
                  sx={{ mb: 2 }}
                />

                <MDInput
                  value={stacVersion}
                  label="STAC Version"
                  placeholder="Enter STAC version"
                  onChange={(event) => {
                    setStacVersion(event.target.value);
                  }}
                  autocomplete="off"
                  sx={{ mb: 2 }}
                />

                <MDButton
                  buttonType="create"
                  className="btn-full-width"
                  onClick={() => {
                    if (collectionId === "" || collectionTitle === "") {
                      window.alert("Please fill in required fields");
                      return;
                    }

                    handleSubmit();
                  }}
                >
                  Create
                </MDButton>
              </div>
            </Card>
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default AddPrivateCollection;
