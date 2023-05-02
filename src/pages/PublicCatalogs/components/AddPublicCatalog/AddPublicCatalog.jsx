// React
import React, { useEffect, useState } from "react";

// Components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Interface
import { addPublicCatalog } from "interface/catalogs";

const AddPublicCatalog = () => {
  const [catalogName, setCatalogName] = useState("");
  const [catalogURL, setCatalogURL] = useState("");
  const [catalogDescription, setCatalogDescription] = useState("");
  const [catalogVersion, setCatalogVersion] = useState("1.0.0");
  useEffect(() => {}, []);

  const handleSubmit = async () => {
    try {
      await addPublicCatalog(
        catalogName,
        catalogURL,
        catalogDescription,
        catalogVersion
      );
      window.alert("Catalog added successfully!");

      // Redirect to /my-catalog
      window.location.href = "/public-catalogs";
    } catch (error) {
      console.log("Error is: ", error);
      window.alert(error.response.data.message);
    }
  };
  return (
    <MDBox>
      <div className="form-container">
        <MDInput
          label="Catalog Name"
          placeholder="Enter catalog name"
          onChange={(event) => {
            setCatalogName(event.target.value);
          }}
          autoComplete="off"
          autoFocus={true}
          style={{
            width: "100%",
            maxWidth: "20rem",
            marginBottom: "1em",
          }}
        />

        {/* Description */}
        <MDInput
          label="Catalog URL"
          placeholder="Enter catalog URL"
          onChange={(event) => {
            setCatalogURL(event.target.value);
          }}
          autoComplete="off"
          style={{
            width: "100%",
            maxWidth: "20rem",
            marginBottom: "1em",
          }}
        />
        <MDInput
          label="Catalog Description"
          placeholder="Enter catalog description"
          onChange={(event) => {
            setCatalogDescription(event.target.value);
          }}
          autoComplete="off"
          style={{
            width: "100%",
            maxWidth: "20rem",
            marginBottom: "1em",
            whiteSpace: "pre-wrap",
          }}
        />
        <MDInput
          label="Catalog Version"
          placeholder="Enter catalog version"
          defaultValue="1.0.0"
          onChange={(event) => {
            setCatalogVersion(event.target.value);
          }}
          autoComplete="off"
          style={{
            width: "100%",
            maxWidth: "20rem",
            marginBottom: "1em",
          }}
        />

        {/* Button */}
        <MDButton
          buttonType="create"
          style={{ width: "100%" }}
          onClick={() => {
            // Set show loading
            // If input is empty
            if (
              catalogName === "" ||
              catalogURL === "" ||
              catalogVersion === ""
            ) {
              window.alert("Please fill in required fields");
              return;
            }
            // validate catalog URL
            try {
              new URL(catalogURL);
            } catch (error) {
              window.alert("Please enter a valid URL");
              return;
            }
            handleSubmit();
          }}
        >
          Create
        </MDButton>
      </div>
    </MDBox>
  );
};

export default AddPublicCatalog;
