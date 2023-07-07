import * as L from "leaflet"; // This must be imported for use by react-leaflet
import { MapContainer, TileLayer, FeatureGroup, Polygon , ZoomControl} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import Toolbox from "../Toolbox/Toolbox";

import "./style.scss";

const Map = () => {
  return (
    <div id="explorer-container-wrapper">
      <div id="toolbox-container" class="toolbox">
        <Toolbox />
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={7} zoomControl={false}>
        <FeatureGroup>
          <EditControl
            position="topright"
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
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default Map;
