import { createGeoJSONPolygon } from "./utils.jsx";

import { useContext } from "react";

import { ExplorerContext } from "pages/Explorer/ExplorerContext";
import ShapefileUpload from "../components/ShapefileUpload";

const GeoJSONParser = () => {
  const { state, setActiveLayers, setDrawMode, setCollectionSearchFilters } =
    useContext(ExplorerContext);

  const handleGeoJsonInput = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const geoJson = JSON.parse(state.collectionSearchFilters.geoJSON);
    const polygon = createGeoJSONPolygon(geoJson);

    const flippedCoordinates = polygon.geometry.coordinates[0].map(
      ([longitude, latitude]) => [latitude, longitude]
    );

    const mapRef = state.mapRef;
    mapRef.fitBounds(flippedCoordinates);

    setActiveLayers([{ id: "polygon", coordinates: flippedCoordinates }]);
  };

  // For the geojson file upload, just fill the textarea with the contents of the file
  const handleGeoJsonFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        setCollectionSearchFilters({
          ...state.collectionSearchFilters,
          geoJSON: contents,
        });
        handleGeoJsonInput(e);
      };
      reader.readAsText(file);
    }
  };

  const handleDraw = () => {
    setDrawMode("rectangle");
  };

  return (
    <>
      <div className="form-group">
        <div className="toolbox-filters-geojson-container">
          {/* Shapefile upload */}
          <ShapefileUpload />
          {/* GeoJSON upload */}
          <label htmlFor="geoJSON" className="toolbox-filters-geojson-tool">
            Upload GeoJSON
          </label>
          <input
            type="file"
            id="geoJSON"
            accept=".geojson, .json"
            onChange={handleGeoJsonFileUpload}
          />

          {/* Draw tools */}
          <div className="form-group">
            <label
              htmlFor="draw-tools"
              className="toolbox-filters-geojson-tool"
              onClick={handleDraw}
            >
              Draw <br />
              AOI
            </label>
          </div>
        </div>
        <textarea
          id="geojson"
          className="toolbox-filters-geojson-input"
          onChange={(e) => {
            setCollectionSearchFilters({
              ...state.collectionSearchFilters,
              geoJSON: e.target.value,
            });
          }}
          placeholder="Use the above tools to define a GeoJSON AOI"
          value={state.collectionSearchFilters?.geoJSON}
        />
      </div>
      <div className="toolbox-filters-geojson-view">
        <button onClick={handleGeoJsonInput}>Show on map</button>
      </div>
    </>
  );
};

export default GeoJSONParser;
