import { polygon, multiPolygon } from "@turf/turf";
import { convert } from "terraformer-wkt-parser";

export const createGeoJSONPolygon = (geoJSONGeometry) => {
  const polygonCoordinates = geoJSONGeometry.features.map(
    (feature) => feature.geometry.coordinates
  );

  // Create a Polygon or MultiPolygon based on the number of features
  if (polygonCoordinates.length === 1) {
    return polygon(polygonCoordinates[0]);
  } else {
    return multiPolygon(polygonCoordinates);
  }
};

export const convertGeoJSONToWKT = (geoJSONGeometry) => {
  const wktGeometry = convert(geoJSONGeometry.geometry);
  return wktGeometry;
};
