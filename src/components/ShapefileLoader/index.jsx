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
import axios from "axios";
import { polygon, multiPolygon } from "@turf/turf";
import { convert } from "terraformer-wkt-parser";

const createWKTFromGeometry = (geometry) => {
  const polygons = geometry.features.map(
    (feature) => feature.geometry.coordinates
  );

  let result;
  // If there's only one feature, create a Polygon
  if (polygons.length === 1) {
    result = polygon(polygons[0]);
  } else {
    // If there are multiple features, create a MultiPolygon
    result = multiPolygon(polygons);
  }

  // Convert GeoJSON to WKT
  const wkt = convert(result.geometry);
  return wkt;
};

const ShapefileLoader = ({ setAOI }) => {
  const fileInputShp = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleShapefileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("output_epsg", 3857);

    const url = "http://localhost:5000/transform";
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const geometry = JSON.parse(response.data.geometry);
    const wkt = createWKTFromGeometry(geometry);
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
