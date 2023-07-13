import React, { createContext, useReducer } from "react";

const initialState = {
  selectedCollection: null,
  allCollections: [],
  isItemsVisible: false,
  activeLayers: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MAP_REF":
      return { ...state, mapRef: action.payload };
    case "SET_ACTIVE_LAYERS":
      return { ...state, activeLayers: action.payload };
    case "SET_DRAW_MODE":
      return { ...state, drawMode: action.payload };
    case "SET_SELECTED_COLLECTION":
      return { ...state, selectedCollection: action.payload };
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload };
    case "SET_ITEMS_FOR_TABLE":
      return { ...state, itemsForTable: action.payload };
    case "SET_ITEMS_VISIBLE":
      return { ...state, isItemsVisible: action.payload };
    case "SET_ALL_COLLECTIONS":
      return { ...state, allCollections: action.payload };
    case "SET_FILTERED_COLLECTIONS":
      return { ...state, filteredCollections: action.payload };
    case "SET_COLLECTION_PAGE":
      return { ...state, collectionPage: action.payload };
    case "SET_ITEMS_PAGE":
      return { ...state, itemsPage: action.payload };
    case "SET_COLLECTION_SEARCH_FILTERS":
      return { ...state, collectionSearchFilters: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}

const ExplorerContext = createContext();

const ExplorerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Maps
  const setMapRef = (mapRef) => {
    dispatch({ type: "SET_MAP_REF", payload: mapRef });
  };

  const setActiveLayers = (layer) => {
    dispatch({
      type: "SET_ACTIVE_LAYERS",
      payload: layer,
    });
  };

  const setDrawMode = (mode) => {
    dispatch({ type: "SET_DRAW_MODE", payload: mode });
  };

  // Collections
  const setSelectedCollection = (collection) => {
    dispatch({ type: "SET_SELECTED_COLLECTION", payload: collection });
  };

  // Items
  const setSelectedItem = (item) => {
    dispatch({ type: "SET_SELECTED_ITEM", payload: item });
  };

  const setAllCollections = (collections) => {
    dispatch({ type: "SET_ALL_COLLECTIONS", payload: collections });
  };

  const setItemsForTable = (items) => {
    dispatch({ type: "SET_ITEMS_FOR_TABLE", payload: items });
  };

  const setItemsVisible = (visibility) => {
    dispatch({ type: "SET_ITEMS_VISIBLE", payload: visibility });
  };

  const setFilteredCollections = (collections) => {
    dispatch({ type: "SET_FILTERED_COLLECTIONS", payload: collections });
  };

  const setCollectionPage = (page) => {
    dispatch({ type: "SET_COLLECTION_PAGE", payload: page });
  };

  const setItemsPage = (page) => {
    dispatch({ type: "SET_ITEMS_PAGE", payload: page });
  };

  const setCollectionSearchFilters = (filters) => {
    dispatch({ type: "SET_COLLECTION_SEARCH_FILTERS", payload: filters });
  };

  const value = {
    state,
    setMapRef,
    setActiveLayers,
    setDrawMode,
    setSelectedCollection,
    setSelectedItem,
    setAllCollections,
    setItemsForTable,
    setItemsVisible,
    setFilteredCollections,
    setCollectionPage,
    setItemsPage,
    setCollectionSearchFilters,
  };

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
};

export { ExplorerContext, ExplorerProvider };
