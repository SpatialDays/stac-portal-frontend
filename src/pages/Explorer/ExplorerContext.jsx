import React, { createContext, useReducer } from "react";

const initialState = {
  selectedCollection: null,
  allCollections: [],
  isItemsVisible: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MAP_REF":
      return { ...state, mapRef: action.payload };
    case "SET_SELECTED_COLLECTION":
      return { ...state, selectedCollection: action.payload };
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload };
    case "SET_ALL_COLLECTIONS":
      return { ...state, allCollections: action.payload };
    case "SET_ITEMS_VISIBLE":
      return { ...state, isItemsVisible: action.payload };
    case "SET_COLLECTION_PAGE":
      return { ...state, collectionPage: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}

const ExplorerContext = createContext();

const ExplorerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setMapRef = (mapRef) => {
    dispatch({ type: "SET_MAP_REF", payload: mapRef });
  };

  const setSelectedCollection = (collection) => {
    dispatch({ type: "SET_SELECTED_COLLECTION", payload: collection });
  };

  const setSelectedItem = (item) => {
    dispatch({ type: "SET_SELECTED_ITEM", payload: item });
  };

  const setAllCollections = (collections) => {
    dispatch({ type: "SET_ALL_COLLECTIONS", payload: collections });
  };

  const setItemsVisible = (visibility) => {
    dispatch({ type: "SET_ITEMS_VISIBLE", payload: visibility });
  };

  const setCollectionPage = (page) => {
    dispatch({ type: "SET_COLLECTION_PAGE", payload: page });
  };

  const value = {
    state,
    setMapRef,
    setSelectedCollection,
    setSelectedItem,
    setAllCollections,
    setItemsVisible,
    setCollectionPage,
  };

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
};

export { ExplorerContext, ExplorerProvider };
