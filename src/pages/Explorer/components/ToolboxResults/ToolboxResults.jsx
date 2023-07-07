import React, { useContext, useEffect, useState } from "react";
import { ExplorerContext } from "../../ExplorerContext";

import "./style.scss";

const ToolboxResults = () => {
  const { state, setSelectedCollection, setAllCollections } =
    useContext(ExplorerContext);

  useEffect(() => {
    setAllCollections([
      {
        name: "os_hgb",
        dateRange: "01.01.2020 - 31.12.2020",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/hgb.png",
      },
      {
        name: "os_raster",
        dateRange: "01.01.2021 - 31.12.2021",
        accessibility: "private",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/aster.png",
      },
      {
        name: "os_rgbi",
        dateRange: "01.01.2022 - 31.12.2022",
        accessibility: "public",
        thumbnail:
          "https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/hgb.png",
      },
    ]);
  }, []);

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection.name);
  };

  return (
    <div className="toolbox-results">
      {state.selectedCollection && (
        <p>Selected Collection: {state.selectedCollection}</p>
      )}
      {state.allCollections.length &&
        state.allCollections.map((collection) => (
          <div
            className={`collection-item ${state.selectedCollection === collection.name ? "selected" : ""}`}
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
  );
};

export default ToolboxResults;
