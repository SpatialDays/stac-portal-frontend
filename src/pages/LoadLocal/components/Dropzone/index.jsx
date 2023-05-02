// Components
import Progress from "./components/Progress";

// @mui components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Types
import { FileProps } from "../../LoadLocal";

// Styles
import "./style.scss";

const Dropzone = ({ files, setFiles }) => {
  const handleChange = (e) => {
    const filesArray = Array.from(e.target.files);
    filesArray.forEach((file) => {
      // Convert to FileProps
      const fileProps: FileProps = {
        originalName: file.name,
        name: "",
        path: file.webkitRelativePath,
        size: file.size,
        type: file.type || null,
        itemID: "",
        progress: 0,
        started: false,
        complete: false,
        error: false,
        errorMessage: "",
        sasToken: "",
        blob: file,
        data: null,
        provider: "",
        GDALInfo: null,
        GDALProcessing: false,
      };

      // Add to files array
      setFiles((files) => [...files, fileProps]);
    });
  };

  return (
    <MDBox>
      {/* Hidden folder input */}
      <input
        type="file"
        id="file-input"
        webkitdirectory="true"
        directory="true"
        style={{ display: "none" }}
        onChange={(e) => handleChange(e)}
      />

      {/* Big box that when clicked, activates file  input*/}
      <MDBox
        style={{
          height: "200px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #ccc",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("file-input").click()}
        className="dropzone"
      >
        <MDTypography variant="overline">
          Click here to upload a folder for processing
        </MDTypography>
      </MDBox>

      {/* Progress */}
      <Progress files={files} />
    </MDBox>
  );
};

export default Dropzone;
