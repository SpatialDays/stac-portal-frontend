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
  TextField,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { CloseOutlined, QuestionMarkOutlined } from "@mui/icons-material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

// Utility functions
import { createGeoJSONPolygon, convertGeoJSONToWKT } from "./utils";
import { backendUrl, geoTransformerPath } from "../../utils/paths.jsx";

const ShapefileLoader = ({ setAOI, setPolygonBounds, setGeoJSONPolygon }) => {
  const fileInputShp = useRef();
  const fileInputGeoJson = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [geoJsonInput, setGeoJsonInput] = useState("");

  const handleShapefileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("output_epsg", 4326);

    const url = new URL(
      path.join(geoTransformerPath),
      backendUrl
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

  const handleGeoJsonInput = () => {
    // Convert the geoJsonInput to a GeoJSON polygon
    const geoJson = JSON.parse(geoJsonInput);
    const polygon = createGeoJSONPolygon(geoJson);
    setGeoJSONPolygon(polygon);

    // This is required for the polygon to render correctly...
    const flippedCoordinates = polygon.geometry.coordinates[0].map(
      ([longitude, latitude]) => [latitude, longitude]
    );
    setPolygonBounds(flippedCoordinates);
    const wkt = convertGeoJSONToWKT(polygon);
    setAOI(wkt);
    setDialogOpen(false);
  };

  const handleGeoJsonFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Read the file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const geoJson = JSON.parse(event.target.result);
      const polygon = createGeoJSONPolygon(geoJson);
      setGeoJSONPolygon(polygon);

      // This is required for the polygon to render correctly...

      const flippedCoordinates = polygon.geometry.coordinates[0].map(
        ([longitude, latitude]) => [latitude, longitude]
      );
      setPolygonBounds(flippedCoordinates);
      const wkt = convertGeoJSONToWKT(polygon);
      setAOI(wkt);
      setDialogOpen(false);
    };
    reader.readAsText(file);
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
            {/* Subtitle */}
            <MDTypography variant="overline">THIS IS DEMO DESIGN</MDTypography>
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
            {/* Allow the user to input GEOJson input */}
            <ListItem
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormLabel>Use a GeoJSON to set the AOI</FormLabel>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                placeholder="Insert your GEOJson here"
                value={geoJsonInput}
                onChange={(event) => setGeoJsonInput(event.target.value)}
                style={{ resize: "both", overflow: "auto" }}
              />
              <MDButton
                variant="contained"
                color="primary"
                onClick={handleGeoJsonInput}
              >
                Set AOI
              </MDButton>
              <hr />
              <FormLabel>Upload a GeoJSON file</FormLabel>
              <input
                type="file"
                accept=".geojson"
                ref={fileInputGeoJson}
                style={{ display: "none" }}
                onChange={handleGeoJsonFileUpload}
              />
              <MDButton
                variant="contained"
                color="primary"
                onClick={() => fileInputGeoJson.current.click()}
              >
                Upload GeoJSON File
              </MDButton>
            </ListItem>
          </List>
        </div>
      </Dialog>
    </div>
  );
};

export default ShapefileLoader;
