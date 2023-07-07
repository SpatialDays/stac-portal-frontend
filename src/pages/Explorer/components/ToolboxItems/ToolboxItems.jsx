import React from "react";
import "./style.scss";

import { ArrowBack } from "@mui/icons-material";

const ToolboxItems = () => {
  const placeholderItems = [
    {
      name: "MYD11A1.A2023179.h18v03.061.2023181014543",
      thumbnail:
        "https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=modis-11A1-061&item=MOD11A1.A2023177.h17v03.061.2023178093314&assets=LST_Day_1km&colormap_name=jet&rescale=255,310&unscale=True&max_size=100&request_entity=explorer",
      datetime: "2023-07-07T08:30",
    },
    //...add other items similarly
  ];

  return (
    <>
      {/* Back button */}
      <div id="toolbox-back-button" className="toolbox-back-button">
        <ArrowBack />
      </div>
      <div id="toolbox-items">
        {placeholderItems.map((item, index) => (
          <div key={index} className="toolbox-item">
            <img
              src={item.thumbnail}
              alt={item.name}
              className="item-thumbnail"
            />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p class="item-info-date">{item.datetime}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToolboxItems;
