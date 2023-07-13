import { useEffect, useRef, useContext, useState } from "react";
import * as L from "leaflet";
import {
  MapContainer,
  FeatureGroup,
  ZoomControl,
  useMap,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-providers";

import Toolbox from "../Toolbox/Toolbox";
import { ExplorerContext } from "pages/Explorer/ExplorerContext";
import "./style.scss";

const BASEMAPS = {
  OpenStreetMap: "OpenStreetMap.Mapnik",
  Esri: "Esri.DeLorme",
  "Stamen Toner": "Stamen.TonerBackground",
  CartoDB: "CartoDB.Positron",
  "NASA Night Lights": "NASAGIBS.ViirsEarthAtNight2012",
};

const ChangeBasemap = ({ baseMap }) => {
  const map = useMap(); // Get map instance using useMap

  useEffect(() => {
    const provider = BASEMAPS[baseMap];

    // Remove all layers from map except basemap
    map.eachLayer((layer) => {
      console.log("Layer", layer);
      if (layer.options.className === "basemap") {
        console.log("Removing layer from map", layer);
        map.removeLayer(layer);
      }
    });

    // Add className option while creating TileLayer
    L.tileLayer.provider(provider, { className: "basemap" }).addTo(map);
  }, [map, baseMap]);

  return null;
};

const Map = () => {
  const mapRef = useRef(null);
  const {
    state,
    setMapRef,
    setDrawMode,
    setActiveLayers,
    setCollectionSearchFilters,
  } = useContext(ExplorerContext);
  const [baseMap, setBaseMap] = useState("OpenStreetMap");
  const [polygonLayer, setPolygonLayer] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      setMapRef(mapRef.current);
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (state.drawMode === "rectangle") {
      document.querySelector(".leaflet-draw-draw-rectangle").click();
    }
  }, [state.drawMode]);

  return (
    <div id="explorer-container-wrapper">
      <div id="toolbox-container" className="toolbox">
        <Toolbox />
      </div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={7}
        zoomControl={false}
        ref={mapRef}
      >
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
            onCreated={(e) => {
              if (polygonLayer) {
                mapRef.current.removeLayer(polygonLayer);
              }

              setDrawMode(null);
              let coorodinates = e.layer._latlngs[0].map(({ lat, lng }) => [
                lat,
                lng,
              ]);
              const newLayer = { id: "polygon", coordinates: coorodinates };
              setActiveLayers([newLayer]);
              setPolygonLayer(newLayer);

              // Remove the drawn layer
              e.layer.remove();

              coorodinates.push(coorodinates[0]);

              // And for each coordinate, swap the order of the lat and lng
              coorodinates.forEach((coordinate, index) => {
                coorodinates[index] = [coordinate[1], coordinate[0]];
              });

              // bbox
              const lats = coorodinates.map((coords) => coords[1]);
              const lngs = coorodinates.map((coords) => coords[0]);
              const bbox = [
                Math.min(...lngs),
                Math.min(...lats),
                Math.max(...lngs),
                Math.max(...lats),
              ];

              let geoJSON = {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    id: "0",
                    properties: {},
                    geometry: {
                      type: "Polygon",
                      coordinates: [coorodinates],
                    },
                    bbox: bbox,
                  },
                ],
                bbox: bbox,
              };

              geoJSON = JSON.stringify(geoJSON, null, 2);
              setCollectionSearchFilters({
                ...state.collectionSearchFilters,
                geoJSON,
              });
            }}
          />
          {state.activeLayers?.map((layer, index) => {
            if (layer.id === "polygon") {
              return (
                <Polygon
                  key={layer.id + index}
                  positions={layer.coordinates}
                  pathOptions={{ color: "purple" }}
                />
              );
            }
          })}
        </FeatureGroup>
        <ZoomControl position="bottomright" />
        <ChangeBasemap baseMap={baseMap} />
      </MapContainer>
      <div className="basemap-changer">
        <select onChange={(e) => setBaseMap(e.target.value)} value={baseMap}>
          {Object.keys(BASEMAPS).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Map;
