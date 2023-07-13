import { ExplorerProvider } from "./ExplorerContext";

// Pages
import Map from "./components/Map/Map";

const Explorer = () => {
  return (
    <div id="explorer">
      <Map />
    </div>
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
