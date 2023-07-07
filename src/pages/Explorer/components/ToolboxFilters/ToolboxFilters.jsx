import React from 'react';
import './style.scss';

const ToolboxFilters = () => {
  return (
    <div className="toolbox-filters">
      <form>
        <div className="form-group">
          <label htmlFor="public-private">Public/Private:</label>
          <select id="public-private">
            <option value="">Select</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cql">CQL:</label>
          <textarea id="cql" />
        </div>
        <div className="form-group">
          <label htmlFor="geojson">GeoJSON:</label>
          <textarea id="geojson" />
        </div>
        <div className="form-group">
          <label htmlFor="shapefile">Shapefile:</label>
          <input type="file" id="shapefile" accept=".zip" />
        </div>
        <div className="form-group">
          <label htmlFor="startdate">Start Date:</label>
          <input type="date" id="startdate" />
        </div>
        <div className="form-group">
          <label htmlFor="enddate">End Date:</label>
          <input type="date" id="enddate" />
        </div>
        <button>Apply filters</button>
      </form>
    </div>
  );
};


export default ToolboxFilters;
