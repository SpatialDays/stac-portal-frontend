import React, { useContext, useEffect, useState } from "react";
import { ExplorerContext } from "../../ExplorerContext";

import ToolboxFilters from "../ToolboxFilters/ToolboxFilters";
import ToolboxResults from "../ToolboxResults/ToolboxResults";

import TuneIcon from "@mui/icons-material/Tune";

import "./style.scss";

const Toolbox = () => {
  const { state } = useContext(ExplorerContext);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {!state.isItemsVisible && (
        <>
          <input
            type="text"
            placeholder="Search"
            style={{ width: "100%" }}
            className="toolbox-search"
          />
          <div class="toolbox-filter-toggle-container">
            <div
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`toolbox-filter-toggle ${isFilterOpen ? "open" : ""}`}
            >
              Advanced Options
              <TuneIcon
                sx={{
                  color: "black",
                  fontSize: "0.8rem",
                  marginLeft: "0.5rem",
                }}
              />
            </div>
          </div>
          {isFilterOpen && <ToolboxFilters />}
        </>
      )}
      <div>
        <ToolboxResults />
      </div>
    </>
  );
};

export default Toolbox;
