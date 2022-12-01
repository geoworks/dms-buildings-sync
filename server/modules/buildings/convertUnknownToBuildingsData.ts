import { hasOwnPropertyFromUnknown } from '../../deql-ms-server/tools/utils';
import { BuildingsData, BuildingsDataElement } from './interfaces'

let convertUnknownToBuildingsData = (
  unknownDataFromBuildings: unknown,
): BuildingsData => {
  try {
    let buildingsData: BuildingsData = {
      GeoCap: []
    };
    if (
      typeof unknownDataFromBuildings === 'object' &&
      unknownDataFromBuildings !== null &&
      hasOwnPropertyFromUnknown(unknownDataFromBuildings, 'GeoCap') &&
      Array.isArray(unknownDataFromBuildings.GeoCap)
    ) {
      unknownDataFromBuildings.GeoCap.forEach((e: unknown) => {
        if (
          typeof e === 'object' &&
          e !== null &&
          hasOwnPropertyFromUnknown(e, 'latCoordinate') &&
          typeof e.latCoordinate === 'string' &&
          hasOwnPropertyFromUnknown(e, 'longCoordinate') &&
          typeof e.longCoordinate === 'string'
        ) {
          let lat = e.latCoordinate;
          let lng = e.longCoordinate;
          let handle: BuildingsDataElement = {
            latCoordinate: lat,
            longCoordinate: lng,
          };
          let assignedHandle = Object.assign(handle, e);
          buildingsData.GeoCap.push(assignedHandle);
        }
      });
    }
    return buildingsData;
  }
  catch (e) {
    e.message = 'convertUnknownToBuildingsData error: ' + e.message
    throw e
  }
};

export default convertUnknownToBuildingsData;