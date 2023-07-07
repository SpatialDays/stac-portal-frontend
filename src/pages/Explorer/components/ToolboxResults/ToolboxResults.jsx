import React, { useContext, useEffect } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { ExplorerContext } from "../../ExplorerContext";

import ToolboxItems from "../ToolboxItems/ToolboxItems";

import "./style.scss";

const ToolboxResults = () => {
  const { state, setSelectedCollection, setAllCollections, setItemsVisible } =
    useContext(ExplorerContext);

  useEffect(() => {
    setAllCollections([
      {
        name: "Sentinel-2",
        dateRange: "01.01.2020 - 31.12.2020",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/sentinel-2.png",
      },
      {
        name: "HGB",
        dateRange: "01.01.2021 - 31.12.2021",
        accessibility: "private",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/hgb.png",
      },
      {
        name: "Landsat",
        dateRange: "01.01.2022 - 31.12.2022",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/landsat.png",
      },
      {
        name: "Terraclimate",
        dateRange: "01.01.2023 - 31.12.2023",
        accessibility: "private",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/terraclimate.png",
      },
      {
        name: "Aster",
        dateRange: "01.01.2024 - 31.12.2024",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/aster.png",
      },
      {
        name: "HREA",
        dateRange: "01.01.2025 - 31.12.2025",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/hrea.png",
      },
      {
        name: "NAIP",
        dateRange: "01.01.2026 - 31.12.2026",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/naip.png",
      },
      {
        name: "NASADEM",
        dateRange: "01.01.2027 - 31.12.2027",
        accessibility: "private",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/nasadem.png",
      },
    ]);
  }, []);

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection.name);
    setItemsVisible(true);
  };

  return (
    <SwitchTransition>
      <CSSTransition
        key={state.isItemsVisible ? "ToolboxItems" : "ToolboxResults"}
        timeout={500}
        classNames="fade"
      >
        {state.isItemsVisible ? (
          <ToolboxItems />
        ) : (
          <div className="toolbox-results">
            {state.selectedCollection && (
              <p>Selected Collection: {state.selectedCollection}</p>
            )}
            {state.allCollections.length &&
              state.allCollections.map((collection) => (
                <div
                  className={`collection-item ${
                    state.selectedCollection === collection.name
                      ? "selected"
                      : ""
                  }`}
                  key={collection.name}
                  onClick={() => handleCollectionClick(collection)}
                >
                  <img
                    src={collection.thumbnail}
                    alt="thumbnail"
                    className="collection-thumbnail"
                  />
                  <div className="collection-info">
                    <h3>{collection.name}</h3>
                    <div className="collection-info-detail">
                      <span>{collection.accessibility}</span>
                      <span>{collection.dateRange}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default ToolboxResults;
