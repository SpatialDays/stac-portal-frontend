import React from "react";
import "./style.scss";


// Filters
import GeoJSONParser from "./components/GeoJSONParser";

const ToolboxFilters = () => {
  return (
    <div className="toolbox-filters">
      <form>
        <fieldset>
          <legend>Catalog Filter</legend>
          <div className="access-container">
            <div className="form-group checkbox-container">
              <input type="checkbox" id="private" checked />
              <label htmlFor="private">OS Catalog</label>
            </div>
            <div className="form-group checkbox-container">
              <input type="checkbox" id="public" checked />
              <label htmlFor="public">Public Catalogs</label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Area Filter</legend>
          <div className="form-group">
            <GeoJSONParser />
          </div>
        </fieldset>

        <fieldset>
          <legend>Temporal Filter</legend>
          <div className="form-group">
            <label htmlFor="startdate">Start Date:</label>
            <input type="date" id="startdate" />
          </div>
          <div className="form-group">
            <label htmlFor="enddate">End Date:</label>
            <input type="date" id="enddate" />
          </div>
        </fieldset>

        <button className="form-submit">Search</button>
      </form>
    </div>
  );
};

export default ToolboxFilters;
