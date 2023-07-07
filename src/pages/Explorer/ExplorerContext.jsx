import React, { createContext, useReducer } from 'react';

const initialState = {
  selectedCollection: null,
  allCollections: [],
  isItemsVisible: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SELECTED_COLLECTION':
      return { ...state, selectedCollection: action.payload };
    case 'SET_ALL_COLLECTIONS':
      return { ...state, allCollections: action.payload };
    case 'SET_ITEMS_VISIBLE':
      return { ...state, isItemsVisible: action.payload };
    default:
      throw new Error('Invalid action type');
  }
}

const ExplorerContext = createContext();

const ExplorerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSelectedCollection = (collection) => {
    dispatch({ type: 'SET_SELECTED_COLLECTION', payload: collection });
  };

  const setAllCollections = (collections) => {
    dispatch({ type: 'SET_ALL_COLLECTIONS', payload: collections });
  };

  const setItemsVisible = (visibility) => {
    dispatch({ type: 'SET_ITEMS_VISIBLE', payload: visibility });
  };

  const value = { state, setSelectedCollection, setAllCollections, setItemsVisible };

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
};

export { ExplorerContext, ExplorerProvider };
