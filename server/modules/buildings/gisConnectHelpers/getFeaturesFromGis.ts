import bsonRequest from '../../../deql-ms-server/tools/utils/bsonRequest';
import bson from 'bson';
import IsAuthorizedInGis from './isAuthorizedInGis';
import GisAuth from './gisAuth';
import { SessionObject, LastAuthUpdateObject, BuildingFeatureFromGis } from '../interfaces';
import options from './../../../deql-ms-server/tools/options';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
const { config } = options;

export let getFeaturesFromGis = async (
  layerId: string,
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
  select: string[],
): Promise<BuildingFeatureFromGis[]> => {
  try {
    let currentDate = +new Date();
    if (currentDate > lastAuthUpdateObject.lastAuthUpdate + 1000 * 60 * 5) {
      let authHandle = await IsAuthorizedInGis(sessionObject);
      if (authHandle.session !== null) {
        sessionObject.session = authHandle.session;
      }
      if (!authHandle.isElevated) {
        await GisAuth(sessionObject);
      }
      lastAuthUpdateObject.lastAuthUpdate = currentDate;
    }
    let featuresFromGis: BuildingFeatureFromGis[] = await new Promise((res, rej) => {
      let features: BuildingFeatureFromGis[] = [];
      let headers = {
        'content-type': 'application/bson',
        cookie: sessionObject.session,
      };
      let request = new bsonRequest(
        {
          host: config.gis.host,
          port: config.gis.port,
          url: '/api/gis/features/find',
          headers,
        },
        {
          raw: true,
          layerId,
          select: select
        },
      );
      request.on('data', data => {
        let unknownData: unknown = bson.deserialize(data);
        console.log('unknownData', unknownData);
        if (
          typeof unknownData === 'object' &&
          unknownData !== null &&
          hasOwnPropertyFromUnknown(unknownData, '_id') &&
          typeof unknownData._id === 'object' &&
          unknownData._id !== null
        ) {
          features.push({
            _id: unknownData._id,
          });
        }
        else {
          rej(new Error('parsing data failed' + JSON.stringify(unknownData)));
        }
      });
      request.on('error', rej);
      request.on('end', () => {
        res(features);
      });
    });
    return featuresFromGis;
  }
  catch (e) {
    e.message = 'getFeaturesFromGis error: ' + e.message
    throw e
  }
};
export default getFeaturesFromGis;
