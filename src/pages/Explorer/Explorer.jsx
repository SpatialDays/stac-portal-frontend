import React, { useContext, useEffect } from 'react';
import { ExplorerContext, ExplorerProvider } from './ExplorerContext';

const Explorer = () => {
  const { state, setSelectedCollection, setAllCollections } = useContext(ExplorerContext);

  // Just for example's sake, we're setting all collections on component mount
  useEffect(() => {
    setAllCollections(['Collection 1', 'Collection 2', 'Collection 3']);
  }, []);

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <>
      <h1>Explorer</h1>
      <div>
        {state.selectedCollection && (
          <h2>Selected Collection: {state.selectedCollection}</h2>
        )}
        {state.allCollections.length && state.allCollections.map((collection) => (
          <button onClick={() => handleCollectionClick(collection)} key={collection}>
            Select {collection}
          </button>
        ))}
      </div>
    </>
  );
};

const ExplorerWithProvider = () => {
  return (
    <ExplorerProvider>
      <Explorer />
    </ExplorerProvider>
  );
};

export default ExplorerWithProvider;
