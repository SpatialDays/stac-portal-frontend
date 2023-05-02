// React
import { useState } from "react";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import axios from "axios";

// @mui components
import Grid from "@mui/material/Grid";
import { CircularProgress, TextField } from "@mui/material";
import {
  ContentPaste,
  SaveAlt,
  Clear,
  TaskAlt,
  Error,
} from "@mui/icons-material";
import { Box } from "@mui/system";

// Layout components
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

// Styles
import "./Validator.scss";

const Validator = () => {
  const [validJSON, setValidJSON] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertBox, setAlertBox] = useState({
    display: false,
    message: "",
    severity: "success",
  });

  const generateErrorMessage = (error) => {
    //return `Error validating against schema version ${error.version}. ${error.error_type}: ${error.error_message}`;
    let errorMessage = error.message;
    let errorType = error.error_type;
    return `${errorMessage}. Pystac Reported Error: ${errorType}`;
  };

  const handleSubmit = () => {
    setAlertBox({ display: false, message: "", severity: "error" });
    setIsLoading(true);
    let textField = document.getElementById("text-field");

    axios(`${process.env.REACT_APP_PORTAL_BACKEND_URL}/validate/json/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: textField.value,
    }).then((res) => {
      setIsLoading(false);
      let data = res.data;
      if (data.message === "Valid STAC") {
        setValidJSON(true);
        setAlertBox({
          display: true,
          message: "Valid STAC",
          severity: "success",
          icon: "check_circle",
        });
      } else {
        setValidJSON(false);
        setAlertBox({
          display: true,
          message: generateErrorMessage(data),
          severity: "error",
          icon: "error",
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Grid item xs={12} pt={2}>
        <MDTypography variant="overline" gutterBottom>
          Use the space below to paste your STAC JSON and validate it against
          the STAC standard.
        </MDTypography>
        {alertBox.display ? (
          <div className={`alert alert-${alertBox.severity}`}>
            <Error />
            <MDTypography variant="overline" color="white">
              <strong>{alertBox.message}</strong>
            </MDTypography>
          </div>
        ) : null}
      </Grid>
      <Box pt={4} display="flex" justifyContent="space-between">
        <Box display="flex" width="100%">
          <MDButton
            buttonType="update"
            style={{ marginRight: "10px" }}
            onClick={() => {
              // Remove any existing alert
              setAlertBox({ display: false, message: "", severity: "error" });
              navigator.clipboard.readText().then((text) => {
                const textField = document.getElementById("text-field");

                try {
                  let ugly = JSON.parse(text);
                  let pretty = JSON.stringify(ugly, undefined, 4);
                  textField.value = pretty;
                } catch {
                  textField.value = "";
                  setAlertBox({
                    display: true,
                    message:
                      "Invalid JSON, please put this through a JSON formatter before validating STAC",
                    severity: "error",
                    icon: "error",
                  });
                }
              });
            }}
            noIcon
          >
            {" "}
            <ContentPaste
              sx={{
                mr: 1,
              }}
            />
            Paste from clipboard
          </MDButton>

          <MDButton
            buttonType="update"
            style={{ marginRight: "10px" }}
            disabled={isLoading}
            sx={{ mr: 4 }}
            onClick={() => {
              // export as json
              const textField = document.getElementById("text-field");
              const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(textField.value);
              const downloadAnchorNode = document.createElement("a");
              downloadAnchorNode.setAttribute("href", dataStr);
              downloadAnchorNode.setAttribute("download", "stac.json");
              document.body.appendChild(downloadAnchorNode); // required for firefox
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            noIcon
          >
            {" "}
            <SaveAlt
              sx={{
                mr: 1,
              }}
            />
            Export as JSON
          </MDButton>

          <MDButton
            buttonType="delete"
            style={{ marginRight: "10px" }}
            sx={{ mr: 4 }}
            onClick={() => {
              const textField = document.getElementById("text-field");
              textField.value = "";
            }}
            noIcon
          >
            {" "}
            <Clear
              sx={{
                mr: 1,
              }}
            />
            Clear
          </MDButton>
        </Box>
        <Box display="flex" width="100%" justifyContent="flex-end">
          <MDButton buttonType="create" onClick={handleSubmit} noIcon>
            <TaskAlt
              sx={{
                mr: 1,
              }}
            />
            Validate STAC
          </MDButton>
        </Box>
      </Box>
      <MDBox>
        <Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <TextField
              id="text-field"
              placeholder="Paste STAC JSON here"
              multiline
              rows={30}
              margin="normal"
              fullWidth
              onInput={() => {
                if (alertBox.display) {
                  setAlertBox({
                    display: false,
                    message: "",
                    severity: "error",
                  });

                  setValidJSON(null);
                }
              }}
              // on paste
              onPaste={(e) => {
                let textField = document.getElementById("text-field");
                // Set alert box to false
                setAlertBox({ display: false, message: "", severity: "error" });

                try {
                  e.preventDefault();

                  const text = e.clipboardData.getData("text/plain");
                  // Clear the text field

                  let ugly = JSON.parse(text);
                  let pretty = JSON.stringify(ugly, undefined, 4);
                  textField.value = pretty;
                } catch (err) {
                  textField.value = "";
                  setAlertBox({
                    display: true,
                    message:
                      "Invalid JSON, please put this through a JSON formatter before validating STAC",
                    severity: "error",
                    icon: "error",
                  });
                }
              }}
              // className if validJson is true then green if it is false then red if it is null then white and another class that hides if isLoading is true
              className={`text-field ${
                validJSON === true
                  ? "valid"
                  : validJSON === false
                  ? "invalid"
                  : validJSON === null
                  ? "null"
                  : ""
              } ${isLoading ? "hide" : ""}`}
            />
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress />
              </div>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Validator;
