// React
import { useState, useRef, useEffect, useCallback } from "react";

// Modules
import axios from "axios";
import path from "path-browserify";

// Leaflet
import * as L from "leaflet"; // This must be imported for use by react-leaflet
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

// Components
import MDButton from "components/MDButton";
import ShapefileLoader from "components/ShapefileLoader";

// @mui components
import { Search } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { Stack, Box } from "@mui/system";

// Styles
import "./map.scss";

// Url paths
import {
  backendUrl,
  publicCatalogsPath,
  collectionsPath,
  searchPath,
} from "../../utils/paths.jsx";

const searchCollections = async (bbox, geoJSONPolygon, datetime) => {
  const url = new URL(
    path.join(publicCatalogsPath, collectionsPath, searchPath, "/"),
    backendUrl
  ).toString();
  const collections = await axios({
    method: "POST",
    url: url,
    data: { intersects: geoJSONPolygon, datetime: datetime },
  });
  const data = await collections.data;
  return data;
};

const DrawMap = ({
  AOI,
  setAOI,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setPublicCollections,
  geoJSONPolygon,
  setGeoJSONPolygon,
}) => {
  const [polygonBounds, setPolygonBounds] = useState([]);
  const [showMap, setShowMap] = useState(true);

  const mapRef = useRef();
  const groupRef = useRef();

  const handleDraw = () => {
    setTimeout(() => {
      setPolygonBounds([]);
    }, 100);
  };


  const handleCreate = (e) => {
    const bounds = e.layer._bounds;

    const minX = bounds._southWest.lng;
    const minY = bounds._southWest.lat;
    const maxX = bounds._northEast.lng;
    const maxY = bounds._northEast.lat;
    const bbox = [minX, minY, maxX, maxY];

    setAOI(bbox);
  };

  const handleDelete = () => {
    setAOI("");
  };

  return (
    <>
      <Stack spacing={2}>
        <div>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="1em"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                id="aoi"
                label="AOI"
                autoComplete="off"
                style={{ margin: 6, width: "50%", padding: "0" }}
                placeholder={"Click to draw AOI on the map"}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                padding="0"
                inputProps={{
                  style: { padding: "0.67em", fontSize: "0.9rem" },
                }}
                value={AOI}
                variant="outlined"
                onChange={(e) => setAOI(e.target.value)}
                onClick={() => {
                  setShowMap(true);
                  const drawTool = document.getElementsByClassName(
                    "leaflet-draw-draw-rectangle"
                  );
                  if (drawTool.length === 1) {
                    drawTool[0].click();
                    const aoi = document.getElementById("aoi");
                    aoi.focus();
                  }
                }}
              />
              {/* Small button to upload shapefile */}
              <ShapefileLoader
                setAOI={setAOI}
                setPolygonBounds={setPolygonBounds}
                setGeoJSONPolygon={setGeoJSONPolygon}
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e)}
                renderInput={(params) => <TextField {...params} />}
                className="date-picker"
                padding="0"
                style={{ padding: "0" }}
                inputProps={{
                  style: { padding: "0.67em", fontSize: "0.9rem" },
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e)}
                renderInput={(params) => <TextField {...params} />}
                className="date-picker"
                inputProps={{
                  style: { padding: "0.67em", fontSize: "0.9rem" },
                }}
              />
            </LocalizationProvider>
            <MDButton
              buttonType="create"
              onClick={async () => {
                setShowMap(false);
                setPublicCollections([]);
                let bbox = AOI;
                let datetime = "";
                if (startDate) {
                  let startDateAsIsoString = startDate.toISOString();
                  startDateAsIsoString = startDateAsIsoString
                    .split("T")[0]
                    .concat("T00:00:00Z");
                  datetime = startDateAsIsoString;
                } else {
                  datetime += "..";
                }
                datetime += "/";
                if (endDate) {
                  let endDateAsIsoString = endDate.toISOString();
                  // remove everything after the first T and add 23:59:59Z
                  endDateAsIsoString = endDateAsIsoString
                    .split("T")[0]
                    .concat("T23:59:59Z");
                  datetime += endDateAsIsoString;
                } else {
                  datetime += "..";
                }
                let searchedCollections = await searchCollections(
                  bbox,
                  geoJSONPolygon,
                  datetime
                );

                if (searchedCollections && searchedCollections.length) {
                  let allCollections = [];
                  searchedCollections.forEach((collection) => {
                    if (
                      collection.collections &&
                      collection.collections.length
                    ) {
                      collection.collections.forEach((subCollection) => {
                        subCollection.catalog = collection.catalog;
                        allCollections.push(subCollection);
                      });
                    }
                  });

                  setPublicCollections(allCollections);
                }
              }}
              noIcon
            >
              <Search
                style={{
                  marginRight: "0.5em",
                }}
              ></Search>
              Search
            </MDButton>
          </Box>
        </div>
        {showMap && (
          <div style={{ height: "25em", width: "100%" }}>
            <MapContainer center={[51.505, -0.09]} zoom={7} whenCreated={map => mapRef.current = map}>
              <FeatureGroup ref={groupRef}>
                <EditControl
                  position="topright"
                  onCreated={handleCreate}
                  onDeleted={handleDelete}
                  onDrawStop={handleDraw}
                  draw={{
                    rectangle: true,
                    polyline: false,
                    polygon: false,
                    circle: false,
                    marker: false,
                    circlemarker: false,
                  }}
                  edit={{
                    edit: false,
                  }}
                />
              </FeatureGroup>

              {/* Loop through the polygon bounds and add them to the map */}
              {polygonBounds.length > 0 && (
                <Polygon
                  positions={polygonBounds}
                  pathOptions={{ color: "purple" }}
                />
              )}

              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        )}

        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <MDButton
            buttonType="update"
            style={{ display: showMap ? "block" : "none" }}
            onClick={() => {
              setShowMap(!showMap);
            }}
            noIcon
          >
            {showMap ? "Hide Map" : "Show Map"}
          </MDButton>
        </Box>
      </Stack>
    </>
  );
};

export default DrawMap;
