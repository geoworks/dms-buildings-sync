import { updateGisLayerFeatures } from './gisConnectHelpers/updateGisLayerFeatures';
import getFeaturesFromGis from './gisConnectHelpers/getFeaturesFromGis';
import {
  SessionObject,
  LastAuthUpdateObject,
  Layer,
  WfsLayersIdsWithPossibleFeatures,
  FeatureFromGisogdToCreateInGis,
  GisogdFeature,
  GisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate,
  GisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate,
  GeometryTypeHandle
} from './interfaces';
import options from '../../deql-ms-server/tools/options';
const { config } = options;
// import getAllProjectsFromGis from './gisConnectHelpers/getAllProjectsFromGis';
// import createLayersWrapper from './createLayersWrapper';
import getAllLayersFromGis from './gisConnectHelpers/getAllLayersFromGis';
import getBuildingsJson from './getBuildingsJson';
import convertUnknownToBuildingsData from './convertUnknownToBuildingsData';

let updateFeaturesLogicWrapper = async (
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
) => {
  try {
    try {
      let unknownDataFromBuildings = await getBuildingsJson();
      console.log('unknownDataFromBuildings', unknownDataFromBuildings)
      let buildingsData = convertUnknownToBuildingsData(unknownDataFromBuildings);
      console.log('buildingsData', buildingsData);
      // config.buildings.mainLink
      // let featuresFromGis = await getFeaturesFromGis(config.gis.layerId, lastAuthUpdateObject, sessionObject,
      //   [
      //     '_id',
      //   ],
      // );
      // console.log('featuresFromGis', featuresFromGis);
    }
    catch (e) {
      console.error("here1, ", e)
    }
    // let allLayersFromGisBeforeCheckOnNewWfsLayers = await getAllLayersFromGis(
    //   lastAuthUpdateObject,
    //   sessionObject
    // );
    // if (allLayersFromGisBeforeCheckOnNewWfsLayers.length == 0) {
    //   throw new Error('allLayersFromGisBeforeCheckOnNewWfsLayers.length == 0');
    // }
    // console.log('stage getAllLayersFromGis done.')
    // let projectsIds = await getAllProjectsFromGis(
    //   lastAuthUpdateObject,
    //   sessionObject,
    // );
    // console.log('stage getAllProjectsFromGis done.')
    // let projectData: {
    //   id: string;
    //   name: string;
    // } | null = null;
    // for (let w = 0; w < projectsIds.length; w++) {
    //   if (projectsIds[w].id === config.gis.projectId) {
    //     projectData = projectsIds[w];
    //   }
    // }
    // if (projectData === null) {
    //   throw new Error('project id from config was not found in project ids');
    // }
    // let wfsl: WFSLink = new WFSLink(
    //   'https://' + config.gisogdGems.host + '/api/gis/ows/3/' + config.gisogdGems.projectAlias + '/wfs?',
    //   {
    //     authorization: bearerToken
    //   }
    // );
    // console.log('stage new WFSLink done.')
    // let wfsLayers = await wfsl.getLayers();//больше 1000//
    // console.log('stage wfsl.getLayers() done. wfsLayers.length ', wfsLayers.length)
    // let wfsLayersMapped = wfsLayers.map(e => e.Name);
    // let existingWfsLayersFromConfig: string[] = [];
    // let doesNotExistsInWfsLayers: string[] = [];
    // wfsLayersFromConfig.forEach(e => {
    //   if (wfsLayersMapped.includes(e)) {
    //     existingWfsLayersFromConfig.push(e);
    //   }
    //   else {
    //     doesNotExistsInWfsLayers.push(e);
    //   }
    // });
    // if (doesNotExistsInWfsLayers.length) {
    //   throw new Error('wfs layer(s) id(s) ' + doesNotExistsInWfsLayers + ' does not exists in the  wfsl.getLayers() result')
    // }
    // console.log('stage check existingWfsLayersFromConfig done.')
    // let wfsLayersIdsWithPossibleFeatures: WfsLayersIdsWithPossibleFeatures = {};
    // for (let i = 0; i < existingWfsLayersFromConfig.length; i++) {
    //   try {
    //     let possibleWfslayerFeatureCollection: unknown = await wfsl.getFeatures(
    //       existingWfsLayersFromConfig[i]
    //     );
    //     wfsLayersIdsWithPossibleFeatures[existingWfsLayersFromConfig[i]] = possibleWfslayerFeatureCollection;
    //   }
    //   catch (e) {
    //     e.message = 'await wfsl.getFeatures failed for wfsLayerId ' + e[0] + 'error:' + e.message;
    //     throw e;
    //   }
    // }
    // console.log('stage wfsl.getFeatures done. Object.keys(wfsLayersIdsWithPossibleFeatures).length ', Object.keys(wfsLayersIdsWithPossibleFeatures).length)
    // let wfsLayersIdsWithPossibleFeaturesEntries = Object.entries(wfsLayersIdsWithPossibleFeatures);
    // let existingLayers: Layer[] = [];
    // allLayersFromGisBeforeCheckOnNewWfsLayers.forEach(e => {
    //   let layerHandle: Layer | null = null;
    //   for (let i = 0; i < wfsLayersIdsWithPossibleFeaturesEntries.length; i++) {
    //     if (e.props.description === wfsLayersIdsWithPossibleFeaturesEntries[i][0]) {
    //       layerHandle = e;
    //       break;
    //     }
    //   }
    //   if (layerHandle) {
    //     existingLayers.push(layerHandle)
    //   }
    // });
    // console.log('stage existingLayers done. existingLayers.length ', existingLayers.length)
    // let nonExistingInGisWfsLayersIdsWithPossibleFeatures: {
    //   wfsLayerId: string,
    //   possibleWfslayerFeatureCollection: unknown
    // }[] = [];
    // let existingInGisWfsLayersIdsWithGisLayerIdAndPossibleWfslayerFeatureCollection: {
    //   gisLayerId: string,
    //   wfsLayerId: string,
    //   possibleWfslayerFeatureCollection: unknown,
    //   gisLayerGeometryTypeHandleArray: GeometryTypeHandle[],
    // }[] = [];
    // for (let i = 0; i < wfsLayersIdsWithPossibleFeaturesEntries.length; i++) {
    //   let obj: {
    //     gisLayerId: string,
    //     wfsLayerId: string,
    //     possibleWfslayerFeatureCollection: unknown,
    //     gisLayerGeometryTypeHandleArray: GeometryTypeHandle[],
    //   } | null = null;
    //   for (let b = 0; b < existingLayers.length; b++) {
    //     if (existingLayers[b].props.description === wfsLayersIdsWithPossibleFeaturesEntries[i][0]) {
    //       obj = {
    //         gisLayerId: existingLayers[b]._id,
    //         wfsLayerId: wfsLayersIdsWithPossibleFeaturesEntries[i][0],
    //         possibleWfslayerFeatureCollection: wfsLayersIdsWithPossibleFeaturesEntries[i][1],
    //         gisLayerGeometryTypeHandleArray: existingLayers[b].props.geometryTypes
    //       }
    //     }
    //   }
    //   if (obj) {
    //     existingInGisWfsLayersIdsWithGisLayerIdAndPossibleWfslayerFeatureCollection.push({
    //       gisLayerId: obj.gisLayerId,
    //       wfsLayerId: obj.wfsLayerId,
    //       possibleWfslayerFeatureCollection: obj.possibleWfslayerFeatureCollection,
    //       gisLayerGeometryTypeHandleArray: obj.gisLayerGeometryTypeHandleArray,
    //     })
    //   }
    //   else {
    //     nonExistingInGisWfsLayersIdsWithPossibleFeatures.push({
    //       wfsLayerId: wfsLayersIdsWithPossibleFeaturesEntries[i][0],
    //       possibleWfslayerFeatureCollection: wfsLayersIdsWithPossibleFeaturesEntries[i][1],
    //     })
    //   }
    // }
    // let createdLayersIdsArray: {
    //   createdGisLayerId: string;
    //   featuresFromGisogdToCreateinGis: FeatureFromGisogdToCreateInGis[];
    // }[] = [];
    // if (nonExistingInGisWfsLayersIdsWithPossibleFeatures.length) {
    //   let createdLayersIdsArrayHandle = await createLayersWrapper(
    //     projectData.name,
    //     nonExistingInGisWfsLayersIdsWithPossibleFeatures,
    //     lastAuthUpdateObject,
    //     sessionObject,
    //   );
    //   console.log('stage createLayersWrapper done. createdLayersIdsArrayHandle.length ', createdLayersIdsArrayHandle.length);
    //   //нужно ли?
    //   let gisLayersAfterCreation = await getAllLayersFromGis(
    //     lastAuthUpdateObject,
    //     sessionObject
    //   );
    //   let gisLayersIdsAfterCreation = gisLayersAfterCreation.map(e => e._id);
    //   let createdLayersIdsArrayMapped = createdLayersIdsArray.map(e => e.createdGisLayerId);
    //   let failedToCreateLayers: string[] = [];
    //   createdLayersIdsArrayMapped.forEach(e => {
    //     if (!gisLayersIdsAfterCreation.includes(e)) {
    //       failedToCreateLayers.push(e);
    //     }
    //   })
    //   if (failedToCreateLayers.length) {
    //     throw new Error('failedToCreateLayers ' + failedToCreateLayers);
    //   }
    //   createdLayersIdsArray = createdLayersIdsArrayHandle;
    //   console.log('stage check created layers done. createdLayersIdsArray.length', createdLayersIdsArray.length);
    // }
    // else {
    //   console.log('stage createLayersWrapper has been ignored');
    // }
    // let updatedLayersArray: {
    //   gisLayerId: string;
    //   wfsLayerId: string;
    //   gisogdFeatures: GisogdFeature[];
    // }[] = [];
    // if (existingInGisWfsLayersIdsWithGisLayerIdAndPossibleWfslayerFeatureCollection.length) {
    //   updatedLayersArray = await updateLayersWrapper(
    //     existingInGisWfsLayersIdsWithGisLayerIdAndPossibleWfslayerFeatureCollection,
    //     lastAuthUpdateObject,
    //     sessionObject,
    //   );
    //   console.log('stage updateLayersWrapper done. updatedLayersArray.length', updatedLayersArray.length);
    // }
    // else {
    //   console.log('stage updateLayersWrapper has been ignored');
    // }
    // let gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate: GisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate[] = [];
    // if (updatedLayersArray.length) {
    //   for (let u = 0; u < updatedLayersArray.length; u++) {
    //     try {
    //       let featuresFromGis = await getFeaturesFromGis(updatedLayersArray[u].gisLayerId, lastAuthUpdateObject, sessionObject,
    //         [
    //           'geometry',
    //           'type',
    //           '_id',
    //           'properties.gisogdgemssyncfeatureid',
    //         ],
    //       );
    //       gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate.push({
    //         gisLayerId: updatedLayersArray[u].gisLayerId,
    //         wfsLayerId: updatedLayersArray[u].wfsLayerId,
    //         gisogdFeatures: updatedLayersArray[u].gisogdFeatures,
    //         featuresToDeleteInGis: featuresFromGis,
    //       });
    //     }
    //     catch (e) {
    //       e.message = 'await getFeaturesFromGis failed for gisLayerId ' + updatedLayersArray[u].gisLayerId + ' error: ' + e.message;
    //       throw e;
    //     }
    //   }
    // }
    // console.log('stage getFeaturesFromGis for layers to update done. gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate.length ', gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate.length);
    // let gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate: GisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[] = [];
    // if (gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate.length) {
    //   for (let v = 0; v < gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate.length; v++) {
    //     let featuresToCreateInGis = convertGisogdFeaturesToNewGisFeatures(gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate[v].gisogdFeatures);
    //     gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.push({
    //       gisLayerId: gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate[v].gisLayerId,
    //       wfsLayerId: gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate[v].wfsLayerId,
    //       featuresToCreateInGis: featuresToCreateInGis,
    //       featuresToDeleteInGis: gisLayerIdWithWfsLayerIdWithGisogdFeaturesWithFeaturesFromGisToUpdate[v].featuresToDeleteInGis,
    //     });
    //   }
    // }
    // console.log('stage convertGisogdFeaturesToNewGisFeatures done. gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.length ', gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.length);
    // let listOfUpdatedLayersIdsInCaseOfFeaturesCreation: string[] = [];
    // if (createdLayersIdsArray.length) {
    //   for (let p = 0; p < createdLayersIdsArray.length; p++) {
    //     try {
    //       if (createdLayersIdsArray[p].featuresFromGisogdToCreateinGis.length) {
    //         await updateGisLayerFeatures(createdLayersIdsArray[p].createdGisLayerId, createdLayersIdsArray[p].featuresFromGisogdToCreateinGis, [], [], lastAuthUpdateObject, sessionObject);
    //         listOfUpdatedLayersIdsInCaseOfFeaturesCreation.push(createdLayersIdsArray[p].createdGisLayerId);
    //       }
    //       else {
    //         console.log('no objects for create createdLayersIdsArray[p].createdGisLayerId ', createdLayersIdsArray[p].createdGisLayerId)
    //       }
    //     }
    //     catch (e) {
    //       e.message = 'await updateGisLayerFeatures failed for created gisLayerId ' + createdLayersIdsArray[p].createdGisLayerId + ' error: ' + e.message + ' listOfUpdatedLayersIdsInCaseOfFeaturesCreation ' + listOfUpdatedLayersIdsInCaseOfFeaturesCreation;
    //       throw e;
    //     }
    //   }
    // }
    // console.log('stage updateGisLayerFeatures for new created layers done.')
    // let listOfUpdatedLayersIdsInCaseOfFeaturesUpdate: string[] = [];
    // if (gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.length) {
    //   for (let d = 0; d < gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.length; d++) {
    //     try {
    //       if (gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].featuresToCreateInGis.length) {
    //         await updateGisLayerFeatures(
    //           gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId,
    //           gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].featuresToCreateInGis,
    //           [],
    //           [],
    //           lastAuthUpdateObject,
    //           sessionObject
    //         );
    //         listOfUpdatedLayersIdsInCaseOfFeaturesUpdate.push(gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId);
    //       }
    //       else {
    //         console.log('no objects for update gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId ', gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId)
    //       }
    //     }
    //     catch (e) {
    //       e.message = 'await updateGisLayerFeatures failed to update for gisLayerId ' + gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId + ' error: ' + e.message + ' listOfUpdatedLayersIdsInCaseOfFeaturesUpdate ' + listOfUpdatedLayersIdsInCaseOfFeaturesUpdate;
    //       throw e;
    //     }
    //   }
    // }
    // console.log('stage updateGisLayerFeatures for update layers done.')
    // //отдельно сделано для того, чтобы не удалить данные в случае возникновения ошибки в запросе
    // let listOfUpdatedLayersIdsInCaseOfFeaturesDelete: string[] = [];
    // if (gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.length) {
    //   for (let d = 0; d < gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate.length; d++) {
    //     try {
    //       if (gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].featuresToCreateInGis.length && gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].featuresToDeleteInGis.length) {
    //         await updateGisLayerFeatures(
    //           gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId,
    //           [],
    //           [],
    //           gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].featuresToDeleteInGis,
    //           lastAuthUpdateObject,
    //           sessionObject
    //         );
    //         listOfUpdatedLayersIdsInCaseOfFeaturesDelete.push(gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId);
    //       }
    //       else {
    //         console.log('no objects for delete gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId ', gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId)
    //       }
    //     }
    //     catch (e) {
    //       e.message = 'await updateGisLayerFeatures failed to delete for gisLayerId ' + gisLayerIdWithWfsLayerIdWithFeaturesToUpdateInGisToUpdate[d].gisLayerId + ' error: ' + e.message + ' listOfUpdatedLayersIdsInCaseOfFeaturesDelete ' + listOfUpdatedLayersIdsInCaseOfFeaturesDelete;
    //       throw e;
    //     }
    // }
    // }
    console.log('stage updateGisLayerFeatures for delete layers done.')
    console.log('sync iteration successfully done')
  }
  catch (e) {
    e.message = 'updateFeaturesLogicWrapper error: ' + e.message
    throw e
  }
};

export default updateFeaturesLogicWrapper;