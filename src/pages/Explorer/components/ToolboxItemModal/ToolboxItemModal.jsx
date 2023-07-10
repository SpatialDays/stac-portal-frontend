import { useEffect, useState } from "react";
import ReactModal from "react-modal";

import CloseIcon from "@mui/icons-material/Close";

import "./style.scss";

ReactModal.setAppElement("#root"); // replace '#root' with the id of your application root element

const ToolboxItemModal = ({ index, showItemModal, setShowItemModal }) => {
  const [activeTab, setActiveTab] = useState("Asset Information");

  const tabs = [
    {
      title: "Asset Information",
      content: (
        <>
          <p>
            <strong>ID:</strong> Sample-ID-123456
          </p>
          <p>
            <strong>Collection:</strong> Sample-Collection-ABC
          </p>
          <p>
            <strong>Type:</strong> Feature
          </p>
        </>
      ),
    },
    {
      title: "Geometric Information",
      content: (
        <>
          <p>
            <strong>Bounding Box:</strong> [10, 20, 30, 40]
          </p>
          <p>
            <strong>Geometry:</strong> Polygon ((30 10, 40 40, 20 40, 10 20, 30
            10))
          </p>
        </>
      ),
    },
    {
      title: "Temporal Information",
      content: (
        <>
          <p>
            <strong>Datetime:</strong> 2023-07-07T08:30:00Z
          </p>
        </>
      ),
    },
    {
      title: "Properties",
      content: (
        <>
          <p>
            <strong>Cloud Cover:</strong> 5%
          </p>
          <p>
            <strong>Satellite:</strong> Sample-Satellite-XYZ
          </p>
        </>
      ),
    },

  ];

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
      className="toolbox-item-modal"
      overlayClassName="modal-overlay"
    >
      <h5>MYD11A1.A2023179.h18v03.061.2023181014543</h5>

      <button
        className="modal-close-btn"
        onClick={() => setShowItemModal(false)}
      >
        <CloseIcon />
      </button>
      <div className="toolbox-item-modal-content">
        <nav className="toolbox-item-modal-nav">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`toolbox-item-modal-nav-item ${
                tab.title === activeTab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.title)}
            >
              {tab.title}
            </button>
          ))}
        </nav>

        <div className="toolbox-item-modal-content">
          {tabs.find((tab) => tab.title === activeTab).content}
        </div>
      </div>
    </ReactModal>
  );
};

export default ToolboxItemModal;
