import { useState, useRef, useEffect } from "react";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Map } from "@mui/icons-material";

import ToolboxItemModal from "../ToolboxItemModal/ToolboxItemModal";

const DropdownActions = ({ index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const node = useRef();

  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
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
      <Map />
      <MoreHorizIcon onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="dropdown-actions">
          <p onClick={() => console.log("View STAC")}>View STAC</p>
          <p onClick={() => console.log("Show COG")}>Show COG</p>
          <p
            onClick={() => {
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
          index={index}
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
        />
      )}
    </div>
  );
};

export default DropdownActions;
