import { ExplorerContext } from "pages/Explorer/ExplorerContext";

import { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";

import * as L from "leaflet";

import "./style.scss";

const BASEMAPS = {
  OpenStreetMap: {
    provider: "OpenStreetMap.Mapnik",
    image: "basemaps/OSM.png",
  },

  Esri: { provider: "Esri.DeLorme", image: "basemaps/esri.png" },

  "Stamen Toner": {
    provider: "Stamen.TonerBackground",
    image: "basemaps/stamentoner.png",
  },

  CartoDB: { provider: "CartoDB.Positron", image: "basemaps/cartodb.png" },

  "NASA Night Lights": {
    provider: "NASAGIBS.ViirsEarthAtNight2012",
    image: "basemaps/nasanight.png",
  },
};

const BasemapPicker = () => {
  const { state, setBaseMap } = useContext(ExplorerContext);
  const map = useMap();

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    let provider = BASEMAPS[state.baseMap]?.provider;

    if (!provider) {
      setBaseMap("OpenStreetMap");
      provider = BASEMAPS["OpenStreetMap"].provider;
    }

    // Remove all layers from map except basemap
    map.eachLayer((layer) => {
      if (layer.options.className === "basemap") {
        map.removeLayer(layer);
      }
    });

    // Add className option while creating TileLayer
    L.tileLayer.provider(provider, { className: "basemap" }).addTo(map);
  }, [state.baseMap]);


  return (
    <>
      <div
        className="basemap-picker"
        onClick={() => setShowPicker(!showPicker)}
      >
        <img src={BASEMAPS[state.baseMap]?.image} alt={state.baseMap} />
      </div>
      {showPicker && (
        <div className="basemap-popup">
          {Object.keys(BASEMAPS).map((name) => (
            <div
              key={name}
              onClick={() => {
                setBaseMap(name);
                setShowPicker(false);
              }}
            >
              <img src={BASEMAPS[name].image} alt={name} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BasemapPicker;
