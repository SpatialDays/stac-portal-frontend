import { useState, useRef, useEffect, useContext } from "react";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Map as MapIcon } from "@mui/icons-material";

import ToolboxItemModal from "../ToolboxItemModal/ToolboxItemModal";

import { ExplorerContext } from "pages/Explorer/ExplorerContext";


const ToolboxItemsActions = ({ item, addSTACLayerToMap }) => {
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
      <MapIcon
        onClick={() => {
          addSTACLayerToMap(item);
        }}
      />
      <MoreHorizIcon onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="dropdown-actions">
          <p onClick={() => window.open(item.stac_href, "_blank")}>View STAC</p>
          <p onClick={() => console.log("WMTS")}>Get WMTS</p>
          <p>View in STAC Browser</p>
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
