import React, { useContext, useEffect } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { ExplorerContext } from "../../ExplorerContext";

import ToolboxItems from "../ToolboxItems/ToolboxItems";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./style.scss";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";

const ToolboxResults = () => {
  const {
    state,
    setSelectedCollection,
    setAllCollections,
    setFilteredCollections,
    setItemsVisible,
    setCollectionPage,
  } = useContext(ExplorerContext);

  const pageLimit = 8;

  useEffect(() => {
    const getAllPublicCollections = async () => {
      const collectionsURL = "http://127.0.0.1:8009/json/test.json";
      const response = await fetch(collectionsURL);
      const data = await response.json();
      setAllCollections(data);
      setFilteredCollections(data);
    };

    getAllPublicCollections();
  }, []);

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setItemsVisible(true);
  };

  const collectionParser = (collection) => {
    const dateRange = collection.extent.temporal.interval[0];
    if (!dateRange) {
      collection.dateRange = "";
    } else if (dateRange.length === 1) {
      if (typeof dateRange[0] === "string") {
        const date = dateRange[0].split("T")[0];
        collection.dateRange = date;
      } else {
        console.error(
          `Unexpected data type in dateRange: ${typeof dateRange[0]}`
        );
      }
    } else if (dateRange.length === 2) {
      if (
        typeof dateRange[0] === "string" &&
        typeof dateRange[1] === "string"
      ) {
        const startDate = dateRange[0].split("T")[0];
        const endDate = dateRange[1].split("T")[0];
        collection.dateRange = `${startDate} to ${endDate}`;
      } else if (typeof dateRange[0] === "string" && dateRange[1] === null) {
        const date = dateRange[0].split("T")[0];
        collection.dateRange = date;
      } else {
        console.error(
          `Unexpected data type in dateRange: ${typeof dateRange[0]}, ${typeof dateRange[1]}`
        );
      }
    }

    // Find thumbnail, which would be in assets under the key thumbnail or preview
    const thumbnail = collection.assets.thumbnail
      ? collection.assets.thumbnail.href
      : collection.assets.preview.href;

    collection.thumbnail = thumbnail;

    return collection;
  };

  useEffect(() => {
    setCollectionPage(1);
    const query = state.collectionSearchFilters?.query;
    if (!query) {
      setFilteredCollections(state.allCollections);
      return;
    }
    const filteredCollections = state.allCollections.filter((collection) => {
      if (collection.title.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      if (collection.description.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      if (collection.keywords.includes(query)) {
        return true;
      }
      if (collection.id.includes(query)) {
        return true;
      }
      return false;
    });

    setFilteredCollections(filteredCollections);
  }, [state.collectionSearchFilters]);

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
            <div className="toolbox-sort-container">
              <div className="toolbox-sort-item">
                Collections ({state.filteredCollections?.length || 0})
              </div>

              <div className="toolbox-pagination-container">
                <div className="toolbox-pagination">
                  <div className="toolbox-pagination-left">
                    <span
                      onClick={() => {
                        if (state.collectionPage > 1) {
                          setCollectionPage(state.collectionPage - 1);
                        }
                      }}
                    >
                      <ArrowBack />
                    </span>
                  </div>
                  <div className="toolbox-pagination-number">
                    <span>{state.collectionPage}</span>
                    <span>
                      {" "}
                      of{" "}
                      {state.filteredCollections
                        ? Math.ceil(
                            state.filteredCollections?.length / pageLimit
                          )
                        : 0}
                    </span>
                  </div>
                  <div className="toolbox-pagination-right">
                    <span
                      onClick={() => {
                        if (
                          state.collectionPage <
                          Math.ceil(
                            state.filteredCollections.length / pageLimit
                          )
                        ) {
                          setCollectionPage(state.collectionPage + 1);
                        }
                      }}
                    >
                      <ArrowForward />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Move to function */}
            {state.filteredCollections?.length &&
              state.filteredCollections
                .slice(
                  (state.collectionPage - 1) * pageLimit,
                  state.collectionPage * pageLimit
                )
                .map((collection) => {
                  collection = collectionParser(collection);

                  return (
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
                        <h3>{collection.title || collection.id}</h3>
                        <div className="collection-info-detail">
                          <span>{collection.license}</span>
                          <span>{collection.dateRange}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default ToolboxResults;
