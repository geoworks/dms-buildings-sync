import { BuildingsData, BuildingFeature } from './interfaces'

let convertBuildingsDataToGeoJsonPoints = (
  buildingsData: BuildingsData,
): BuildingFeature[] => {
  try {
    let buildingsFeatures: BuildingFeature[] = [];
    buildingsData.GeoCap.forEach(building => {
      let buildingPropeties = Object.assign({}, building);
      buildingsFeatures.push({
        type: 'Feature',
        geometry:
        {
          type: "Point",
          coordinates: [building.longCoordinate, building.latCoordinate],
        },
        properties: buildingPropeties,
        ot: "Point"//todo - use from config
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