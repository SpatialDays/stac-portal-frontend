import { useContext, useEffect, useState } from "react";
import "./style.scss";

import { ArrowForward, ArrowBack } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Loader from "components/Loader";

import { ExplorerContext } from "../../ExplorerContext";

import ToolboxItem from "../ToolboxItem/ToolboxItem";

import { CSSTransition } from "react-transition-group";

const ToolboxItems = () => {
  const { setItemsVisible, setItemsForTable, setItemsPage, setCollectionPage, state } =
    useContext(ExplorerContext);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const pageLimit = 5;

  const handleSearch = async (e, searchParameters) => {
    setError(null);
    setItemsForTable([]);
    setIsLoading(true);

    const searchUrl =
      "https://planetarycomputer.microsoft.com/api/stac/v1/search";
    if (!searchParameters) {
      searchParameters = {
        collections: [state.selectedCollection.id],
        "filter-lang": "cql2-json",
        limit: pageLimit,
      };
    }

    if (e && e.target.value.length > 0) {
      setItemsPage(1);
      searchParameters.filter = {
        op: "%like%",
        args: [
          {
            property: "id",
          },
          `%${e.target.value}%`,
        ],
      };
    }

    try {
      const fetchPromise = fetch(searchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParameters),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 3500)
      );

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      const json = await response.json();
      setItemsForTable(json);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError("No items found");
      setItemsForTable([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getItems = async () => {
      setItemsPage(1);
      setError(null);
      setItemsForTable([]);
      handleSearch(null, null);
    };
    getItems();
  }, [state.selectedCollection]);

  const handleNextPage = () => {
    setItemsPage(state.itemsPage + 1);
    const nextToken = state.itemsForTable.links.find(
      (link) => link.rel === "next"
    ).body;
    handleSearch(null, nextToken);
  };

  const handlePreviousPage = () => {
    setItemsPage(state.itemsPage - 1);
    const previousToken = state.itemsForTable.links.find(
      (link) => link.rel === "previous"
    ).body;
    handleSearch(null, previousToken);
  };

  return (
    <div>
      <CSSTransition
        in={state.isItemsVisible}
        timeout={300}
        classNames="fade-exit"
        unmountOnExit
      >
        <div>
          <div className="toolbox-items-header">
            <div
              id="toolbox-back-button"
              className="toolbox-back-button"
              onClick={() => {
                // setCollectionPage(1);
                setItemsVisible(false)}}
            >
              <ArrowBack />
            </div>

            <div />
          </div>

          <div className="toolbox-items-header-content">
            <img
              src={
                state.selectedCollection.assets.thumbnail
                  ? state.selectedCollection.assets.thumbnail.href
                  : state.selectedCollection.assets.preview.href
              }
              alt="thumbnail"
              className="toolbox-items-header-collection-thumbnail"
            />
            <div className="toolbox-items-header-title">
              <h3>
                {state.selectedCollection.title || state.selectedCollection.id}
              </h3>
              <small>{state.selectedCollection.accessibility}</small>
            </div>
          </div>
          <div className="toolbox-items-filters">
            <div className="toolbox-items-filters-search">
              <input
                type="text"
                placeholder="Search"
                className="toolbox-items-filters-search-input"
                onChange={(e) => handleSearch(e)}
              />
            </div>
          </div>

          {!isLoading && (
            <div className="toolbox-sort-container">
              <div className="toolbox-sort-item">Items ( 5 )</div>
              <div className="toolbox-sort-item">
                <FilterAltIcon />
              </div>
            </div>
          )}

          {isLoading ? (
            <div class="toolbox-items-loader-container">
              <Loader />
            </div>
          ) : (
            <div id="toolbox-items">
              {state.itemsForTable?.features?.map((item, index) => (
                <ToolboxItem item={item} key={index} />
              ))}

              {error && <div className="toolbox-items-error">{error}</div>}
            </div>
          )}

          <div className="toolbox-pagination-container">
            <div className="toolbox-pagination">
              <div className="toolbox-pagination-left">
                <span
                  onClick={() => {
                    if (state.itemsPage > 1) {
                      handlePreviousPage();
                    }
                  }}
                >
                  <ArrowBack />
                </span>
              </div>
              <div className="toolbox-pagination-number">
                <span>{state.itemsPage}</span>
              </div>
              <div className="toolbox-pagination-right">
                <span onClick={() => handleNextPage()}>
                  <ArrowForward />
                </span>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default ToolboxItems;
