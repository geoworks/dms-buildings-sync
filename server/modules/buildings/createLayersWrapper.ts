// import {
//   SessionObject,
//   LastAuthUpdateObject,
//   GisogdFeatureCollectionWrapper,
//   GisWfsLayersIdsWithPossibleWfsFeatures,
//   GisWfsLayersIdsWithPossibleWfsFeaturesParsed,
//   GisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted,
//   GisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes,
//   FeatureFromGisogdToCreateInGis
// } from './interfaces';
// import parseGisodgFeatureCollection from './gisogdGemsHelpers/parseGisodgFeatureCollection';
// import convertGisogdFeaturesToNewGisFeatures from './gisogdGemsHelpers/convertGisogdFeaturesToNewGisFeatures';
// import { createLayer } from './gisConnectHelpers/createLayer';
// import convertNewFeaturesToGeometryTypes from './gisConnectHelpers/convertNewFeaturesToGeometryTypes';
// import options from '../../deql-ms-server/tools/options';
// const { config } = options;

// let createLayersWrapper = async (
//   projectName: string,
//   nonExistingInGisWfsLayersIds: {
//     wfsLayerId: string;
//     possibleWfslayerFeatureCollection: unknown;
//   }[],
//   lastAuthUpdateObject: LastAuthUpdateObject,
//   sessionObject: SessionObject,
// ): Promise<{
//   createdGisLayerId: string,
//   featuresFromGisogdToCreateinGis: FeatureFromGisogdToCreateInGis[]
// }[]> => {
//   try {
//     let nonExistingInGisWfsLayersIdsWithPossibleWfsFeatures: GisWfsLayersIdsWithPossibleWfsFeatures = {};
//     for (let i = 0; i < nonExistingInGisWfsLayersIds.length; i++) {
//       try {
//         nonExistingInGisWfsLayersIdsWithPossibleWfsFeatures[nonExistingInGisWfsLayersIds[i].wfsLayerId] = nonExistingInGisWfsLayersIds[i].possibleWfslayerFeatureCollection;
//       }
//       catch (e) {
//         e.message = 'nonExistingInGisWfsLayersIds failed to await wfsl.getFeatures for layer with wfs id ' + nonExistingInGisWfsLayersIds[i] + e.message;
//         throw e;
//       }
//     }
//     let nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed: GisWfsLayersIdsWithPossibleWfsFeaturesParsed = {};
//     Object.entries(nonExistingInGisWfsLayersIdsWithPossibleWfsFeatures).forEach(e => {
//       try {
//         let gisogdFeaturesWrapper: GisogdFeatureCollectionWrapper = parseGisodgFeatureCollection(e[1]);
//         nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed[e[0]] = gisogdFeaturesWrapper;
//       }
//       catch (e) {
//         e.message = 'nonExistingInGisWfsLayersIds failed to parseGisodgFeatureCollection, with wfs layer id ' + e[0] + e.message;
//         throw e;
//       }
//     })
//     console.log('stage parseGisodgFeatureCollection done. Object.keys(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed).length', Object.keys(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed).length)
//     let nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted: GisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted = {};
//     Object.entries(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed).forEach(e => {
//       try {
//         let createFeaturesArray = convertGisogdFeaturesToNewGisFeatures(
//           e[1].features,
//         );
//         nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted[e[0]] = createFeaturesArray;
//       }
//       catch (e) {
//         e.message = 'nonExistingInGisWfsLayersIds failed to convertGisogdFeaturesToNewGisFeatures with wfs layer id ' + e[0] + ' ' + e.message;
//         throw e;
//       }
//     });
//     console.log('stage convertGisogdFeaturesToNewGisFeatures done. Object.keys(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted).length', Object.keys(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted).length)
//     let nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes: GisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes = {};
//     Object.entries(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted).forEach(e => {
//       try {
//         let gisGeometryTypeLayers = convertNewFeaturesToGeometryTypes(e[0], e[1]);
//         nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes[e[0]] = {
//           gisGeometryTypeLayer: gisGeometryTypeLayers,
//           featuresFromGisogdToCreateinGis: e[1],
//         };
//       }
//       catch (e) {
//         e.message = 'nonExistingInGisWfsLayersIds failed to convertNewFeaturesToGeometryTypes with wfs layer id ' + e[0] + ' ' + e.message;
//         throw e;
//       }
//     });
//     console.log('stage convertNewFeaturesToGeometryTypes done. Object.keys(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes).length', Object.keys(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes).length)
//     //много где может зафейлится. может получится ситуация в которой создание слоев будет бесконечным
//     // let alreadyCreatedButMustBeRemovedInCaseOfFail: Layer[] = [];
//     let createdLayersIdsArray: {
//       createdGisLayerId: string,
//       featuresFromGisogdToCreateinGis: FeatureFromGisogdToCreateInGis[]
//     }[] = [];
//     let nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesEntries = Object.entries(nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes);
//     for (let i = 0; i < nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesEntries.length; i++) {
//       try {
//         let gisLayerId = await createLayer(
//           config.gis.syncLayersPrefix + nonExistingInGisWfsLayersIds[i].wfsLayerId,
//           nonExistingInGisWfsLayersIds[i].wfsLayerId,
//           projectName,
//           nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesEntries[i][1].gisGeometryTypeLayer,
//           lastAuthUpdateObject,
//           sessionObject,
//         );
//         createdLayersIdsArray.push({
//           createdGisLayerId: gisLayerId,
//           featuresFromGisogdToCreateinGis: nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesEntries[i][1].featuresFromGisogdToCreateinGis
//         });
//       }
//       catch (e) {
//         e.message = 'nonExistingInGisWfsLayersIds failed to createLayer with wfs layer id ' + nonExistingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesEntries[i][0] + e.message;
//         throw e;
//       }
//     }
//     console.log('stage createLayer done. createdLayersIdsArray.length', createdLayersIdsArray.length);
//     return createdLayersIdsArray;
//   }
//   catch (e) {
//     e.message = 'createLayersWrapper error: ' + e.message
//     throw e
//   }
// };

// export default createLayersWrapper;