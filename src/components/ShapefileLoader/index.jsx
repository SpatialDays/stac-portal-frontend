import React, { useRef } from "react";
import proj4 from "proj4";
import epsg from "epsg";
// var wktParser = require("wkt-parser");
import wktParser from "wkt-parser";
const shapefile = require("shapefile");

function getSRSFromWKT(wkt) {
  console.log("WKT is: ", wkt);
  let code = null;

  console.log(wktParser(wkt));

  return code;
}

const ShapefileLoader = () => {
  const fileInputShp = useRef();
  const fileInputPrj = useRef();

  const handleShapefileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    shapefile
      .open(file.path)
      .then((source) =>
        source.read().then(function log(result) {
          if (result.done) return;
          console.log(result.value);
          return source.read().then(log);
        })
      )
      .catch((error) => console.error(error.stack));
  };

  const handlePrjfileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const wkt = e.target.result;
      console.log("WKT is: ", wkt);
      const srsCode = getSRSFromWKT(wkt);
      console.log(`EPSG code is: ${srsCode}`);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputShp}
        style={{ display: "none" }}
        onChange={handleShapefileUpload}
      />
      <button onClick={() => fileInputShp.current.click()}>
        Upload Shapefile
      </button>

      <input
        type="file"
        ref={fileInputPrj}
        style={{ display: "none" }}
        onChange={handlePrjfileUpload}
      />
      <button onClick={() => fileInputPrj.current.click()}>
        Upload PRJ file
      </button>
    </div>
  );
};

export default ShapefileLoader;
