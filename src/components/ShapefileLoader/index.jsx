import React, { useRef, useState } from "react";
import wktParser from "wkt-parser";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Dialog,
  DialogTitle,
  FormLabel,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { CloseOutlined, QuestionMarkOutlined } from "@mui/icons-material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

const shapefile = require("shapefile");

function getSRSFromWKT(wkt) {
  console.log("WKT is: ", wkt);
  let code = null;

  console.log(wktParser(wkt));

  return code;
}

const ShapefileLoader = () => {
  const fileInputShp = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleShapefileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    shapefile
      .open(file.path)
      .then((source) =>
        source.read().then(function log(result) {
          if (result.done) return;
          console.log(result.value);
          return source.read().then(log);
        })
      )
      .catch((error) => console.error(error.stack));
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <SettingsIcon
        style={{ color: "black", cursor: "pointer" }}
        onClick={() => setDialogOpen(true)}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CloseOutlined
          style={{
            position: "absolute",
            right: "0.5em",
            top: "0.5em",
            cursor: "pointer",
            color: "black",
          }}
          onClick={() => setDialogOpen(false)}
        />
        <div style={{ padding: "1em" }}>
          <DialogTitle id="alert-dialog-title">
            <MDTypography variant="h4">Additional Parameters</MDTypography>
          </DialogTitle>

          <List>
            <ListItem>
              <input
                type="file"
                ref={fileInputShp}
                style={{ display: "none" }}
                onChange={handleShapefileUpload}
              />
              <FormLabel>Use a shapefile to set the AOI</FormLabel>
              <MDBox
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MDButton
                  variant="contained"
                  color="primary"
                  onClick={() => fileInputShp.current.click()}
                >
                  Upload Shapefile
                </MDButton>
                <Tooltip
                  title="Upload a valid shapefile zip with a .shp, .shx, .dbf, and .prj file"
                  placement="right"
                  sx={{ fontSize: "5em" }}
                >
                  <QuestionMarkOutlined
                    style={{
                      color: "black",
                      cursor: "pointer",
                      marginLeft: "0.5em",
                      fontSize: "1em",
                    }}
                  />
                </Tooltip>
              </MDBox>
            </ListItem>
          </List>
        </div>
      </Dialog>
    </div>
  );
};

export default ShapefileLoader;
