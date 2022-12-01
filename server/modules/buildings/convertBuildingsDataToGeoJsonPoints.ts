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
          coordinates: [building.latCoordinate, building.longCoordinate],
        },
        properties: buildingPropeties,
        ot: "здание"//todo - use from config
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