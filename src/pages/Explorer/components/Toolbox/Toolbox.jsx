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
          <input type="text" placeholder="Search" className="toolbox-search" />
          <div class="toolbox-filter-toggle-container">
            <div
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`toolbox-filter-toggle ${isFilterOpen ? "open" : ""}`}
            >
              Advanced Options
              <TuneIcon />
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
