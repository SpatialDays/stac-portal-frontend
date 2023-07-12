import { useContext, useEffect, useState } from "react";
import "./style.scss";

import { ArrowForward, ArrowBack } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { ExplorerContext } from "../../ExplorerContext";

import ToolboxItemsActions from "../ToolboxItemsActions/ToolboxItemsActions";

import { CSSTransition } from "react-transition-group";

const ToolboxItems = () => {
  const { setItemsVisible, setItemsForTable, setItemsPage, state } =
    useContext(ExplorerContext);

  const [error, setError] = useState(null);

  const pageLimit = 5;

  const fetchData = async (linkRel, pageAdjust = 0) => {
    const itemsHref =
      state.itemsForTable.links.find((link) => link.rel === linkRel).href +
      "&limit=" +
      pageLimit;
    const response = await fetch(itemsHref);
    const json = await response.json();
    setItemsForTable(json);
    setItemsPage(state.itemsPage + pageAdjust);
  };

  useEffect(() => {
    setItemsPage(1);
    const getItems = async () => {
      setError(null);
      setItemsForTable([]);
      const itemsHref =
        state.selectedCollection.links.find((link) => link.rel === "items")
          .href +
        "?limit=" +
        pageLimit;

      const response = await fetch(itemsHref);
      const json = await response.json();

      if (json.features.length === 0) {
        setError("No items to display");
      }

      setItemsForTable(json);
    };

    getItems();
  }, [state.selectedCollection]);

  const handleNextPage = () => fetchData("next", 1);


  const handlePreviousPage = () => fetchData("previous", -1);


  const handleSearch = async (e) => {
    const search_url =
      "https://planetarycomputer.microsoft.com/api/stac/v1/search";
    const search_parameters = {
      collections: [state.selectedCollection.id], // assuming this is the currently selected collection
      "filter-lang": "cql2-json",
      filter: {
        op: "%like%",
        args: [
          {
            property: "id",
          },
          `%${e.target.value}%`, // wildcard search on the value entered
        ],
      },
      limit: pageLimit,
    };

    const response = await fetch(search_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(search_parameters),
    });

    const json = await response.json();

    setItemsForTable(json);
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
              onClick={() => setItemsVisible(false)}
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

          {!error && (
            <>
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

              <div className="toolbox-sort-container">
                <div className="toolbox-sort-item">Items ( 5 )</div>
                <div className="toolbox-sort-item">
                  <FilterAltIcon />
                </div>
              </div>
            </>
          )}

          <div id="toolbox-items">
            {state.itemsForTable?.features?.map((item, index) => {
              item.datetime = new Date(
                item.properties.datetime
              ).toLocaleString();

              item.thumbnail =
                item.assets?.rendered_preview?.href ||
                item.assets?.thumbnail?.href ||
                item.assets?.preview?.href;

              return (
                <div key={index + "__item_thumb__"} className="toolbox-item">
                  {!!item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.id}
                      className="item-thumbnail"
                    />
                  )}
                  <div className="item-info">
                    <h3>{item.id}</h3>
                    <div className="item-info-meta">
                      <p className="item-info-date">{item.datetime}</p>
                      <p className="item-info-actions">
                        <ToolboxItemsActions item={item} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {error && <div className="toolbox-items-error">{error}</div>}
          </div>

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
