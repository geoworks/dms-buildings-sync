import { updateGisLayerFeatures } from './gisConnectHelpers/updateGisLayerFeatures';
import getFeaturesFromGis from './gisConnectHelpers/getFeaturesFromGis';
import {
  SessionObject,
  LastAuthUpdateObject,
} from './interfaces';
import options from '../../deql-ms-server/tools/options';
const { config } = options;
import getBuildingsJson from './getBuildingsJson';
import convertUnknownToBuildingsData from './convertUnknownToBuildingsData';
import convertBuildingsDataToGeoJsonPoints from './convertBuildingsDataToGeoJsonPoints';

let updateFeaturesLogicWrapper = async (
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
) => {
  try {
    let unknownDataFromBuildings = await getBuildingsJson();
    console.log('unknownDataFromBuildings', unknownDataFromBuildings)
    console.log('stage getBuildingsJson done')
    let buildingsData = convertUnknownToBuildingsData(unknownDataFromBuildings);
    console.log('buildingsData', buildingsData);
    console.log('stage convertUnknownToBuildingsData done')
    let buildingsGeoJSonPoints = convertBuildingsDataToGeoJsonPoints(buildingsData);
    console.log('buildingsGeoJSonPoints', buildingsGeoJSonPoints);
    console.log('stage convertBuildingsDataToGeoJsonPoints done')
    if (!buildingsGeoJSonPoints.length) {
      console.log('no buildingsGeoJSonPoints, iteration end');
    }
    let featuresFromGis = await getFeaturesFromGis(config.gis.layerId, lastAuthUpdateObject, sessionObject,
      [
        '_id',
      ],
    );
    console.log('featuresFromGis', featuresFromGis);
    console.log('stage getFeaturesFromGis done')
    if (featuresFromGis.length) {
      await updateGisLayerFeatures(
        config.gis.layerId,
        [],
        [],
        featuresFromGis,
        lastAuthUpdateObject,
        sessionObject
      );
      console.log('stage updateGisLayerFeatures(delete) done')
    }
    else {
      console.log('stage updateGisLayerFeatures(delete) with ignored')
    }
    await updateGisLayerFeatures(
      config.gis.layerId,
      buildingsGeoJSonPoints,
      [],
      [],
      lastAuthUpdateObject,
      sessionObject
    );
    console.log('stage updateGisLayerFeatures(create) done')
    console.log('sync iteration successfully done')
  }
  catch (e) {
    e.message = 'updateFeaturesLogicWrapper error: ' + e.message
    throw e
  }
};

export default updateFeaturesLogicWrapper;