import FileUploadIcon from "@mui/icons-material/FileUpload";

import { backendUrl, geoTransformerPath } from "utils/paths.jsx";
import path from "path-browserify";
import { createGeoJSONPolygon } from "./utils.jsx";
import axios from "axios";
import { useContext } from "react";

import { ExplorerContext } from "pages/Explorer/ExplorerContext";

const ShapefileUpload = () => {
  const { state, setActiveLayers } = useContext(ExplorerContext);

  const handleShapefileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("output_epsg", 4326);

    const url = new URL(path.join(geoTransformerPath), backendUrl).toString();

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const geometry = JSON.parse(response.data.geometry);
    const polygon = createGeoJSONPolygon(geometry);
    const flippedCoordinates = polygon.geometry.coordinates[0].map(
      ([longitude, latitude]) => [latitude, longitude]
    );

    const mapRef = state.mapRef;
    mapRef.fitBounds(flippedCoordinates);

    setActiveLayers([
      ...state.activeLayers,
      { id: "polygon", coordinates: flippedCoordinates },
    ]);
  };

  return (
    <>
      <label>Shapefile:</label>
      <label htmlFor="shapefile" className="toolbox-filters-upload">
        <FileUploadIcon
          sx={{
            fontSize: "1rem",
          }}
        />
        Upload Shapefile (zip)
      </label>
      <input
        type="file"
        id="shapefile"
        accept=".zip"
        onChange={handleShapefileUpload}
      />
    </>
  );
};

export default ShapefileUpload;
