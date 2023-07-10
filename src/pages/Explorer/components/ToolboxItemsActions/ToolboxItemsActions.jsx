import { useState, useRef, useEffect, useContext } from "react";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Map } from "@mui/icons-material";

import ToolboxItemModal from "../ToolboxItemModal/ToolboxItemModal";

import { ExplorerContext } from "pages/Explorer/ExplorerContext";

import stacLayer from "stac-layer";

const ToolboxItemsActions = ({ item }) => {
  const { state, setSelectedItem } = useContext(ExplorerContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const node = useRef();

  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }
    setIsOpen(false);
  };

  const addSTACLayerToMap = async (item) => {
    const stac_href = item.stac_href;
    const map = state.mapRef;

    // Make request to STAC endpoint
    const data = await fetch(stac_href, {
      method: "GET",
    });

    const json = await data.json();

    console.log("Failed here");

    // create layer
    const layer = await stacLayer(json);

    // add layer to map
    layer.addTo(map);

    // fit map to layer
    map.fitBounds(layer.getBounds());
  };

  useEffect(() => {
    if (isOpen) {
      // if dropdown is open, add listener to document
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // if dropdown is closed, remove listener from document
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // on component unmount, remove listener from document
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={node}>
      <Map
        onClick={() => {
          addSTACLayerToMap(item);
        }}
      />
      <MoreHorizIcon onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="dropdown-actions">
          <p onClick={() => console.log("View STAC", item)}>View STAC</p>
          <p onClick={() => console.log("Show COG")}>Show COG</p>
          <p
            onClick={() => {
              setSelectedItem(item);
              setShowItemModal(true);
              setIsOpen(false);
            }}
          >
            Additional Properties
          </p>
        </div>
      )}
      {showItemModal && (
        <ToolboxItemModal
          item={item}
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
        />
      )}
    </div>
  );
};

export default ToolboxItemsActions;
