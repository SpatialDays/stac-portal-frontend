import { useEffect } from "react";

const shapefile = require("shapefile");

const ShapefileLoader = () => {


  useEffect(() => {
    shapefile
      .open("/RGN_DEC_1921_EW_BGC.shp")
      .then((source) =>
        source.read().then(function log(result) {
          if (result.done) return;
          console.log(result.value);
          return source.read().then(log);
        })
      )
      .catch((error) => console.error(error.stack));
  }, []);


  return (
    <>
      Hello Moto
    </>
  )
}

export default ShapefileLoader;