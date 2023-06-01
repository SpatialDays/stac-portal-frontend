// React
import React, { useRef, useState } from "react";

// Modules
import path from "path-browserify";
import axios from "axios";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";

// @mui components
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

// Utility functions
import { createGeoJSONPolygon, convertGeoJSONToWKT } from "./utils";
import {
  geoTransformerUrl,
  geoTransformerPath,
} from "../../utils/paths.jsx";

const ShapefileLoader = ({ setAOI, setPolygonBounds, setGeoJSONPolygon }) => {
  const fileInputShp = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleShapefileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("output_epsg", 4326);

    // "http://localhost:5002/transform";
    const url = new URL(
      path.join(geoTransformerPath),
      geoTransformerUrl
    ).toString();

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const geometry = JSON.parse(response.data.geometry);
    const polygon = createGeoJSONPolygon(geometry);
    setGeoJSONPolygon(polygon);

    // This is required for the polygon to render correctly... 
    const flippedCoordinates = polygon.geometry.coordinates[0].map(
      ([longitude, latitude]) => [latitude, longitude]
    );
    setPolygonBounds(flippedCoordinates);
    const wkt = convertGeoJSONToWKT(polygon);
    setAOI(wkt);
    setDialogOpen(false);
    return wkt;
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
            <ListItem
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input
                type="file"
                accept=".zip"
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
