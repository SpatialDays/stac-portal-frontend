import React, { useContext, useRef, useState } from "react";
import { ExplorerContext } from "../../ExplorerContext";

import ToolboxFilters from "../ToolboxFilters/ToolboxFilters";
import ToolboxResults from "../ToolboxResults/ToolboxResults";

import TuneIcon from "@mui/icons-material/Tune";

import "./style.scss";

const Toolbox = () => {
  const { state, setCollectionSearchFilters } = useContext(ExplorerContext);
  const [dragging, setDragging] = useState(false); // Track whether we're currently dragging

  // Refs for the previous mouse position and the current toolbox element
  const prevPosRef = useRef({ x: 0, y: 0 });
  const toolboxRef = useRef();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e) => {
    console.log("Handling search");
    setCollectionSearchFilters({
      ...state.collectionSearchFilters,
      query: e.target.value,
    });
  };

  const onMouseDown = (e) => {
    // When we press the mouse down, start dragging and record the initial mouse position
    setDragging(true);
    prevPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    // When the mouse moves, if we're dragging, calculate the new position and update the element's transform
    if (!dragging) return;
    const newPos = { x: e.clientX, y: e.clientY };
    const dx = newPos.x - prevPosRef.current.x;
    const dy = newPos.y - prevPosRef.current.y;

    // Ensure the Toolbox stays within its parent container
    const toolbox = toolboxRef.current;
    const toolboxRect = toolbox.getBoundingClientRect();
    const parentRect = toolbox.parentElement.getBoundingClientRect();

    let newLeft = toolboxRect.left + dx;

    if (newLeft < 278) newLeft = 278;

    let newTop = toolboxRect.top + dy;

    if (newLeft < parentRect.left) newLeft = parentRect.left;
    if (newTop < parentRect.top) newTop = parentRect.top;
    if (newLeft + toolboxRect.width > parentRect.right)
      newLeft = parentRect.right - toolboxRect.width;
    if (newTop + toolboxRect.height > parentRect.bottom)
      newTop = parentRect.bottom - toolboxRect.height;

    toolbox.style.left = `${newLeft - parentRect.left}px`;
    toolbox.style.top = `${newTop - parentRect.top}px`;

    prevPosRef.current = newPos;
  };

  const onMouseUp = () => {
    // When we release the mouse, stop dragging
    setDragging(false);
  };

  return (
    <div
      id="toolbox-container"
      className="toolbox"
      ref={toolboxRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div className="toolbox-content">
        {!state.isItemsVisible && (
          <>
            <input
              type="text"
              placeholder="Search"
              className="toolbox-search"
              onChange={handleSearch}
              value={state.collectionSearchFilters?.query}
            />
            <div className="toolbox-filter-toggle-container">
              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`toolbox-filter-toggle ${
                  isFilterOpen ? "open" : ""
                }`}
              >
                {isFilterOpen
                  ? "Hide Advanced Filters"
                  : "Show Advanced Filters"}
                <TuneIcon />
              </div>
            </div>
            {isFilterOpen && <ToolboxFilters />}
          </>
        )}
        {!isFilterOpen && (
          <div>
            <ToolboxResults />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbox;
