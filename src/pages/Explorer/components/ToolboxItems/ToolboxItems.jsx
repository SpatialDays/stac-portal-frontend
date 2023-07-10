import { useContext } from "react";
import "./style.scss";

import { ArrowForward, Map, ArrowBack } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { ExplorerContext } from "../../ExplorerContext";

import ToolboxItemsActions from "../ToolboxItemsActions/ToolboxItemsActions";

import { CSSTransition } from "react-transition-group";

const ToolboxItems = () => {
  const { setItemsVisible, state } = useContext(ExplorerContext);

  const placeholderItems = [
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-11A1-061&item=MOD11A1.A2023177.h17v03.061.2023178093314&assets=LST_Day_1km&colormap_name=jet&rescale=255,310&unscale=True&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
      stac_href:
        "https://planetarycomputer.microsoft.com/api/stac/v1/collections/landsat-c2-l2/items/LC09_L2SR_085082_20230521_02_T1",
    },
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-11A1-061&item=MYD11A1.A2023179.h17v03.061.2023181014159&assets=LST_Day_1km&colormap_name=jet&rescale=255,310&unscale=True&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
      stac_href:
        "https://planetarycomputer.microsoft.com/api/stac/v1/collections/sentinel-1-rtc/items/S1A_IW_GRDH_1SSH_20230708T082853_20230708T082918_049329_05EE93_rtc",
    },
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-11A1-061&item=MYD11A1.A2023177.h18v03.061.2023179021739&assets=LST_Day_1km&colormap_name=jet&rescale=255,310&unscale=True&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
      stac_href:
        "http://stac-fastapi-assets-signing-proxy.os-eo-platform-rg-staging.azure.com/collections/os_heightstore_dsm1m/items/129121-00000000-0000-0000-0000-000000148925",
    },
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-17A3HGF-061&item=MYD17A3HGF.A2020001.h18v03.061.2021015043511&assets=Npp_500m&colormap_name=modis-17A3HGF&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
      stac_href:
        "http://stac-fastapi-assets-signing-proxy.os-eo-platform-rg-staging.azure.com/collections/os_rgbi/items/fdcd6488-6e3d-4889-83a5-9ba877e40e59",
    },
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-17A3HGF-061&item=MYD17A3HGF.A2017001.h17v03.061.2021300034512&assets=Npp_500m&colormap_name=modis-17A3HGF&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
      stac_href:
        "https://os-eo-platform-rg-staging-apim.azure-api.net/stac/collections/os_heightstore_dsm1m/items/129121-00000000-0000-0000-0000-000000148925?subscription-key=65146e3ad9f74e3e8df2587a5742a951",
    },
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-09Q1-061&item=MYD09Q1.A2023169.h18v03.061.2023178045328&assets=sur_refl_b02&assets=sur_refl_b01&assets=sur_refl_b01&color_formula=gamma%20RGB%203.0,%20saturation%201.9,%20sigmoidal%20RGB%200%200.55&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
    },
  ];

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
            <div className="toolbox-items-header-title">
              <h3> {state.selectedCollection.name}</h3>
              <small>{state.selectedCollection.accessibility}</small>
            </div>
            <div />
          </div>

          <div className="toolbox-items-filters">
            <div className="toolbox-items-filters-search">
              <input
                type="text"
                placeholder="Search"
                className="toolbox-items-filters-search-input"
              />
            </div>
          </div>

          <div className="toolbox-sort-container">
            <div className="toolbox-sort-item">Page 1 of 13</div>
            <div className="toolbox-sort-item">
              <FilterAltIcon />
            </div>
          </div>

          <div id="toolbox-items">
            {placeholderItems.map((item, index) => {
              item.datetime = new Date(item.datetime).toLocaleString();
              return (
                <div key={index} className="toolbox-item">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="item-thumbnail"
                  />
                  <div className="item-info">
                    <h3>{item.name}</h3>
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
          </div>

          <div className="toolbox-pagination-container">
            <div className="toolbox-pagination">
              <div className="toolbox-pagination-left">
                <span>
                  <ArrowBack />
                </span>
              </div>
              <div className="toolbox-pagination-number">
                <span>1</span>
                <span> of 13</span>
              </div>
              <div className="toolbox-pagination-right">
                <span>
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
