import React from "react";
import "./style.scss";

import FileUploadIcon from "@mui/icons-material/FileUpload";

const ToolboxFilters = () => {
  return (
    <div className="toolbox-filters">
      <form>
        <fieldset>
          <legend>Access</legend>
          <div className="access-container">
            <div className="form-group checkbox-container">
              <input type="checkbox" id="private" checked />
              <label htmlFor="private">Private</label>
            </div>
            <div className="form-group checkbox-container">
              <input type="checkbox" id="public" checked />
              <label htmlFor="public">Public</label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Geographical</legend>
          <div className="form-group">
            <label htmlFor="shapefile" className="toolbox-filters-upload">
              <FileUploadIcon
                sx={{
                  fontSize: "1rem",
                }}
              />
              Upload Shapefile (zip)
            </label>
            <input type="file" id="shapefile" accept=".zip" />
          </div>
          <div className="form-group">
            <label htmlFor="cql">CQL:</label>
            <textarea id="cql" />
          </div>
          <div className="form-group">
            <label htmlFor="geojson">GeoJSON:</label>
            <textarea id="geojson" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Temporal</legend>
          <div className="form-group">
            <label htmlFor="startdate">Start Date:</label>
            <input type="date" id="startdate" />
          </div>
          <div className="form-group">
            <label htmlFor="enddate">End Date:</label>
            <input type="date" id="enddate" />
          </div>
        </fieldset>

        <button className="form-submit">Apply filters</button>
      </form>
    </div>
  );
};

export default ToolboxFilters;
