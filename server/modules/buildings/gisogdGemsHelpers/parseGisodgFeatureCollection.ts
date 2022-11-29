import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils/hasOwnPropertyFromUnknown';
import { GisogdFeature, GisogdFeatureCollectionWrapper } from '../interfaces';

let parseGisodgFeatureCollection = (
  possibleJson: unknown
): GisogdFeatureCollectionWrapper => {
  try {
    if (
      typeof possibleJson === 'object' &&
      possibleJson !== null &&
      hasOwnPropertyFromUnknown(possibleJson, 'type') &&
      typeof possibleJson.type === 'string' &&
      possibleJson.type === 'FeatureCollection' &&
      hasOwnPropertyFromUnknown(possibleJson, 'features') &&
      Array.isArray(possibleJson.features) &&
      hasOwnPropertyFromUnknown(possibleJson, 'totalFeatures') &&
      typeof possibleJson.totalFeatures === 'number' &&
      hasOwnPropertyFromUnknown(possibleJson, 'numberMatched') &&
      typeof possibleJson.numberMatched === 'number' &&
      hasOwnPropertyFromUnknown(possibleJson, 'numberReturned') &&
      typeof possibleJson.numberReturned === 'number' &&
      hasOwnPropertyFromUnknown(possibleJson, 'timeStamp') &&
      typeof possibleJson.timeStamp === 'string'
    ) {
      let features: GisogdFeature[] = [];
      for (let i = 0; i < possibleJson.features.length; i++) {
        if (
          typeof possibleJson.features[i] === 'object' &&
          possibleJson.features[i] !== null &&
          hasOwnPropertyFromUnknown(possibleJson.features[i], 'type') &&
          typeof possibleJson.features[i].type === 'string' &&
          possibleJson.features[i].type === 'Feature' &&
          hasOwnPropertyFromUnknown(possibleJson.features[i], 'id') &&
          typeof possibleJson.features[i].id === 'string' &&
          hasOwnPropertyFromUnknown(possibleJson.features[i], 'geometry') &&
          typeof possibleJson.features[i].geometry === 'object' &&
          possibleJson.features[i].geometry !== null &&
          hasOwnPropertyFromUnknown(possibleJson.features[i].geometry, 'type') &&
          typeof possibleJson.features[i].geometry.type === 'string' &&
          (
            possibleJson.features[i].geometry.type === "Point" ||
            possibleJson.features[i].geometry.type === "MultiPoint" ||
            possibleJson.features[i].geometry.type === "LineString" ||
            possibleJson.features[i].geometry.type === "MultiLineString" ||
            possibleJson.features[i].geometry.type === "Polygon" ||
            possibleJson.features[i].geometry.type === "MultiPolygon"
          ) &&
          hasOwnPropertyFromUnknown(possibleJson.features[i].geometry, 'coordinates') &&
          hasOwnPropertyFromUnknown(possibleJson.features[i], 'geometry_name') &&
          typeof possibleJson.features[i].geometry_name === 'string' &&
          hasOwnPropertyFromUnknown(possibleJson.features[i], 'properties') &&
          typeof possibleJson.features[i].properties === 'object'
        ) {
          features.push(possibleJson.features[i]);
        }
        else {
          throw new Error('parseGisodgFeatureCollection convertation to GisogdFeature error1');
        }
      }
      if (
        hasOwnPropertyFromUnknown(possibleJson, 'crs') &&
        possibleJson.crs === null
      ) {
        return {
          type: possibleJson.type,
          features: features,
          totalFeatures: possibleJson.totalFeatures,
          numberMatched: possibleJson.numberMatched,
          numberReturned: possibleJson.numberReturned,
          timeStamp: possibleJson.timeStamp,
          crs: null
        };
      }
      else if (
        hasOwnPropertyFromUnknown(possibleJson, 'crs') &&
        typeof possibleJson.crs === 'object' &&
        possibleJson.crs !== null &&
        hasOwnPropertyFromUnknown(possibleJson.crs, 'type') &&
        typeof possibleJson.crs.type === 'string' &&
        hasOwnPropertyFromUnknown(possibleJson.crs, 'properties') &&
        typeof possibleJson.crs.properties === 'object' &&
        possibleJson.crs.properties !== null &&
        hasOwnPropertyFromUnknown(possibleJson.crs.properties, 'name') &&
        typeof possibleJson.crs.properties.name == "string"
      ) {
        return {
          type: possibleJson.type,
          features: features,
          totalFeatures: possibleJson.totalFeatures,
          numberMatched: possibleJson.numberMatched,
          numberReturned: possibleJson.numberReturned,
          timeStamp: possibleJson.timeStamp,
          crs: {
            type: possibleJson.crs.type,
            properties: {
              name: possibleJson.crs.properties.name
            }
          }
        };
      }
      else {
        throw new Error('possibleJson convertation to GisogdFeature error2');
      }
    }
    else {
      throw new Error('possibleJson convertation to GisogdFeature error3');
    }
  }
  catch (e) {
    e.message = 'parseGisodgFeatureCollection error: ' + e.message
    throw e
  }
};
export default parseGisodgFeatureCollection;
