import { BuildingsData, BuildingFeature } from './interfaces'

let convertBuildingsDataToGeoJsonPoints = (
  buildingsData: BuildingsData,
): BuildingFeature[] => {
  try {
    let buildingsFeatures: BuildingFeature[] = [];
    buildingsData.GeoCap.forEach(building => {
      let buildingPropeties = Object.assign({}, building);
      //в админке почему-то все кастуется к lower case
      let buildingPropetiesLowerCased: {
        [key: string]: unknown
      } = {};
      Object.entries(buildingPropeties).forEach(e => {
        buildingPropeties[e[0].toLowerCase()] = e[1]
      })
      buildingsFeatures.push({
        type: 'Feature',
        geometry:
        {
          type: "Point",
          coordinates: [building.longCoordinate, building.latCoordinate],
        },
        properties: buildingPropetiesLowerCased,
        ot: "zdanie"//todo - use from config
      });
    });
    return buildingsFeatures;
  }
  catch (e) {
    e.message = 'convertBuildingsDataToGeoJsonPoints error: ' + e.message
    throw e
  }
};

export default convertBuildingsDataToGeoJsonPoints;