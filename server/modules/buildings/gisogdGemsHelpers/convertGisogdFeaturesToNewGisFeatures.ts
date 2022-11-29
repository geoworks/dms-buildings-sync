import {
  FeatureFromGisogdToCreateInGis,
  GisogdFeature,
} from '../interfaces';

let convertGisogdFeaturesToNewGisFeatures = (
  gisogdFeatures: GisogdFeature[],
) => {
  try {
    let createFeaturesArray: FeatureFromGisogdToCreateInGis[] = [];
    gisogdFeatures.forEach(e => {
      if (
        e.geometry.type === 'Point'
      ) {
        createFeaturesArray.push({
          properties: {
            gisogdgemssyncfeatureid: e.id,
            gisogdgemssyncfeaturegeometryname: e.geometry_name,
            ...e.properties
          },
          geometry: {
            type: 'Point',
            coordinates: e.geometry.coordinates
          },
          type: 'Feature',
          ot: 'Point'
        });
      }
      else if (
        e.geometry.type === 'MultiPoint'
      ) {
        //не уверен что дупликация properties в этом случае уместна
        e.geometry.coordinates.forEach(coordinate => {
          createFeaturesArray.push({
            properties: {
              gisogdgemssyncfeatureid: e.id,
              gisogdgemssyncfeaturegeometryname: e.geometry_name,
              ...e.properties
            },
            geometry: {
              type: 'Point',
              coordinates: coordinate
            },
            type: 'Feature',
            ot: 'Point'
          });
        });
      }
      else if (
        e.geometry.type === 'LineString'
      ) {
        createFeaturesArray.push({
          properties: {
            gisogdgemssyncfeatureid: e.id,
            gisogdgemssyncfeaturegeometryname: e.geometry_name,
            ...e.properties
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [e.geometry.coordinates]
          },
          type: 'Feature',
          ot: 'MultiLineString'
        });
      }
      else if (
        e.geometry.type === 'MultiLineString'
      ) {
        createFeaturesArray.push({
          properties: {
            gisogdgemssyncfeatureid: e.id,
            gisogdgemssyncfeaturegeometryname: e.geometry_name,
            ...e.properties
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: e.geometry.coordinates
          },
          type: 'Feature',
          ot: 'MultiLineString'
        });
      }
      else if (
        e.geometry.type === 'Polygon'
      ) {
        createFeaturesArray.push({
          properties: {
            gisogdgemssyncfeatureid: e.id,
            gisogdgemssyncfeaturegeometryname: e.geometry_name,
            ...e.properties
          },
          geometry: {
            type: 'MultiPolygon',
            coordinates: [e.geometry.coordinates]
          },
          type: 'Feature',
          ot: 'MultiPolygon'
        });
      }
      else if (
        e.geometry.type === 'MultiPolygon'
      ) {
        createFeaturesArray.push({
          properties: {
            gisogdgemssyncfeatureid: e.id,
            gisogdgemssyncfeaturegeometryname: e.geometry_name,
            ...e.properties
          },
          geometry: {
            type: 'MultiPolygon',
            coordinates: e.geometry.coordinates
          },
          type: 'Feature',
          ot: 'MultiPolygon'
        });
      }
      else {
        throw new Error('unknown GeoJson geometry.type from gisogd_features')
      }
    });
    return createFeaturesArray
  }
  catch (e) {
    e.message = 'convertGisogdFeaturesToGisFeatures error: ' + e.message
    throw e
  }
};

export default convertGisogdFeaturesToNewGisFeatures;