import { useRef, useContext } from "react";
import ToolboxItemsActions from "../ToolboxItemsActions/ToolboxItemsActions";
import { ExplorerContext } from "pages/Explorer/ExplorerContext";
import stacLayer from "stac-layer";

import "./style.scss";

const ToolboxItem = ({ item }) => {
  const { state } = useContext(ExplorerContext);

  const addSTACLayerToMap = async (item) => {
    console.log('Adding STACLayer to map')
    const map = state.mapRef;

    // remove all layers from map except basemap
    map.eachLayer((layer) => {
      if (layer.options.className !== "basemap") {
        map.removeLayer(layer);
      }
    });

    let layer;
    layer = await stacLayer(item, {
      displayOverview: false, // This is to force tiff
      resolution: 256,
    });

    if (Object.keys(layer._layers).length === 1) {
      layer = await stacLayer(item, {
        debugLevel: 3,
      });
    }

    layer.addTo(map);
    map.fitBounds(layer.getBounds());
  };

  item.datetime = new Date(item.properties.datetime).toLocaleString();

  item.thumbnail =
    item.assets?.rendered_preview?.href ||
    item.assets?.thumbnail?.href ||
    item.assets?.preview?.href;

  return (
    <div className="toolbox-item" onClick={() => addSTACLayerToMap(item)}>
      {!!item.thumbnail && (
        <img src={item.thumbnail} alt={item.id} className="item-thumbnail" />
      )}
      <div className="item-info">
        <h3>{item.id}</h3>
        <div className="item-info-meta">
          <p className="item-info-date">{item.datetime}</p>
          <p className="item-info-actions">
            <ToolboxItemsActions
              item={item}
              addSTACLayerToMap={addSTACLayerToMap}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolboxItem;
