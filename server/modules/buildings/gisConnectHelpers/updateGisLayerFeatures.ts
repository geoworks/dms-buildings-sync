import fetch from 'node-fetch';
import IsAuthorizedInGis from './isAuthorizedInGis';
import GisAuth from './gisAuth';
import {
  BuildingFeatureFromGis,
  SessionObject,
  LastAuthUpdateObject,
  BuildingFeature,
  FeatureToUpdateInGis,
} from '../interfaces';
// import getGisPlace from './getGisPlace';
import options from '../../../deql-ms-server/tools/options';
const { config } = options;

export let updateGisLayerFeatures = async (
  layerId: string,
  createFeaturesArray: BuildingFeature[],
  updateFeaturesArray: FeatureToUpdateInGis[],
  deleteFeaturesArray: BuildingFeatureFromGis[],
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
) => {
  try {
    let currentDate = +new Date();
    if (currentDate > lastAuthUpdateObject.lastAuthUpdate + 1000 * 60 * 5) {
      let isElevated = await IsAuthorizedInGis(sessionObject);
      if (!isElevated) {
        await GisAuth(sessionObject);
      }
      lastAuthUpdateObject.lastAuthUpdate = currentDate;
    }
    let body = {
      'operationName': null,
      'variables': { 'createFeatures': createFeaturesArray, 'updateFeatures': updateFeaturesArray, 'deleteFeatures': deleteFeaturesArray, 'layerId': layerId },
      'query': 'mutation ($createFeatures: [JSON], $updateFeatures: [JSON], $deleteFeatures: [JSON], $layerId: String!) {\n  updateFeatures(createFeatures: $createFeatures, updateFeatures: $updateFeatures, deleteFeatures: $deleteFeatures, layerId: $layerId)\n}\n',
    };
    let req = await fetch('http' + '://' + config.gis.host + ':' + config.gis.port + '/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionObject.session,
      },
      body: JSON.stringify(body),
    });
    if (req.status !== 200) {
      let message = await req.text();
      throw new Error(message || 'Не удалось установить связь с сервером');
    } else {
      let data = await req.json();
      if (data.errors && data.errors[0]) {
        throw new Error(
          data.errors[0].message || 'Произошла непредвиденная ошибка'
        );
      } else {
        return data;
      }
    }
  }
  catch (e) {
    e.message = 'updateGisLayerFeatures error: ' + e.message
    throw e
  }
};