// React
import { useState } from "react";

// Modules
import axios from "axios";

// Leaflet
import * as L from "leaflet"; // This must be imported for use by react-leaflet
import { MapContainer, TileLayer, FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

// Components
import MDButton from "components/MDButton";

// @mui components
import { Search } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { Stack, Box } from "@mui/system";

// Styles
import "./map.scss";

const searchCollections = async (bbox, datetime) => {
  const url = `${process.env.REACT_APP_PORTAL_BACKEND_URL}/public_catalogs/collections/search/`;
  const collections = await axios({
    method: "POST",
    url: url,
    data: { bbox: bbox, datetime: datetime },
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
}) => {
  const [rectangleBounds, setRectangleBounds] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const handleCreate = (e) => {
    const bounds = e.layer._bounds;

    const minX = bounds._southWest.lng;
    const minY = bounds._southWest.lat;
    const maxX = bounds._northEast.lng;
    const maxY = bounds._northEast.lat;

    // Bbox is form [-1, 50, 1, 51]
    const bbox = [minX, minY, maxX, maxY];

    setAOI(bbox);
  };

  const handleDraw = (e) => {
    // wait 50 ms
    setTimeout(() => {
      setRectangleBounds(null);
    }, 100);
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
              // set inside padding to 0
              inputProps={{
                style: { padding: "0.67em", fontSize: "0.9rem" },
              }}
              value={AOI}
              variant="outlined"
              onChange={(e) => setAOI(e.target.value)}
              onClick={() => {
                setShowMap(true);
                // Enable draw tool
                const drawTool = document.getElementsByClassName(
                  "leaflet-draw-draw-rectangle"
                );
                if (drawTool.length === 1) {
                  // Click but dont focus
                  drawTool[0].click();

                  // Refoucs on AOI
                  const aoi = document.getElementById("aoi");
                  aoi.focus();
                }
              }}
            />
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
                // Hide map
                setShowMap(false);
                // Empty the collections
                setPublicCollections([]);
                let bbox = AOI;
                let datetime = "";
                if (startDate) {
                  let startDateAsIsoString = startDate.toISOString();
                  // remove everything after the first T and add 00:00:00Z
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
                  datetime
                );

                // flatten these into collections
                if (searchedCollections && searchedCollections.length) {
                  let allCollections = [];
                  // Loop through these and
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
            <MapContainer center={[51.505, -0.09]} zoom={7}>
              <FeatureGroup>
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

              {rectangleBounds && (
                <Polygon
                  positions={rectangleBounds}
                  pathOptions={{ color: "black" }}
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
