import { ExplorerProvider } from "./ExplorerContext";

// Pages
import Map from "./components/Map/Map";

const Explorer = () => {
  return (
    <>
      <Map />
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
