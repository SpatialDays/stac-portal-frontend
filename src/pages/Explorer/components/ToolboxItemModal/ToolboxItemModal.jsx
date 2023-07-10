import { useEffect } from "react";
import ReactModal from "react-modal";

import "./style.scss";

ReactModal.setAppElement("#root"); // replace '#root' with the id of your application root element

const ToolboxItemModal = ({ index, showItemModal, setShowItemModal }) => {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setShowItemModal(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setShowItemModal]);

  return (
    <ReactModal
      isOpen={showItemModal}
      onRequestClose={() => setShowItemModal(false)}
      contentLabel={`Item Details ${index}`}
      className="Modal"
      overlayClassName="Overlay"
    >
      <button
        onClick={() => {
          console.log("close");
          setShowItemModal(false);
        }}
      >
        Close
      </button>
      <h2>Item Details {index}</h2>
      <p>This is some placeholder info about the item...</p>
    </ReactModal>
  );
};

export default ToolboxItemModal;
