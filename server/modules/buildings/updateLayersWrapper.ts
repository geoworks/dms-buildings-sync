import {
  SessionObject,
  LastAuthUpdateObject,
  GisogdFeatureCollectionWrapper,
  UpdateGisWfsLayersIdsWithPossibleWfsFeatures,
  UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsed,
  UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted,
  UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes,
  GisogdFeature,
  GeometryTypeHandle,
  UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesMerged
} from './interfaces';
import parseGisodgFeatureCollection from './gisogdGemsHelpers/parseGisodgFeatureCollection';
import convertGisogdFeaturesToNewGisFeatures from './gisogdGemsHelpers/convertGisogdFeaturesToNewGisFeatures';
import convertNewFeaturesToGeometryTypes from './gisConnectHelpers/convertNewFeaturesToGeometryTypes';
import { updateLayer } from './gisConnectHelpers/updateLayer';
import options from '../../deql-ms-server/tools/options';
import mergeGeometryTypes from './gisConnectHelpers/mergeGeometryTypes';
const { config } = options;

let updateLayersWrapper = async (
  existingInGisWfsLayersIds: {
    gisLayerId: string,
    wfsLayerId: string,
    possibleWfslayerFeatureCollection: unknown;
    gisLayerGeometryTypeHandleArray: GeometryTypeHandle[],
  }[],//тут еще нужны айдишники слоев из нашего гиса
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
): Promise<{
  gisLayerId: string;
  wfsLayerId: string;
  gisogdFeatures: GisogdFeature[];
}[]> => {
  try {
    let existingInGisWfsLayersIdsWithPossibleWfsFeatures: UpdateGisWfsLayersIdsWithPossibleWfsFeatures = {};
    for (let i = 0; i < existingInGisWfsLayersIds.length; i++) {
      try {
        existingInGisWfsLayersIdsWithPossibleWfsFeatures[existingInGisWfsLayersIds[i].wfsLayerId] = {
          possibleFeatures: existingInGisWfsLayersIds[i].possibleWfslayerFeatureCollection,
          gisLayerId: existingInGisWfsLayersIds[i].gisLayerId,
          gisLayerGeometryTypeHandleArray: existingInGisWfsLayersIds[i].gisLayerGeometryTypeHandleArray,
        };
      }
      catch (e) {
        e.message = 'existingInGisWfsLayersIds failed to await wfsl.getFeatures for layer with wfs id ' + existingInGisWfsLayersIds[i] + ' ' + e.message;
        throw e;
      }
    }
    let existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed: UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsed = {};
    Object.entries(existingInGisWfsLayersIdsWithPossibleWfsFeatures).forEach(e => {
      try {
        let gisogdFeaturesWrapper: GisogdFeatureCollectionWrapper = parseGisodgFeatureCollection(e[1].possibleFeatures);
        existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed[e[0]] =
        {
          gisogdFeatureCollectionWrapper: gisogdFeaturesWrapper,
          gisLayerId: e[1].gisLayerId,
          gisLayerGeometryTypeHandleArray: e[1].gisLayerGeometryTypeHandleArray
        };
      }
      catch (e) {
        e.message = 'existingInGisWfsLayersIds failed to parseGisodgFeatureCollection, with wfs layer id ' + e[0] + ' ' + e.message;
        throw e;
      }
    })
    console.log('stage parseGisodgFeatureCollection done. Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed).length', Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed).length)
    let existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted: UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted = {};
    Object.entries(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsed).forEach(e => {
      try {
        let createFeaturesArray = convertGisogdFeaturesToNewGisFeatures(
          e[1].gisogdFeatureCollectionWrapper.features,
        );
        existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted[e[0]] =
        {
          featuresFromGisogdToCreateInGis: createFeaturesArray,
          gisLayerId: e[1].gisLayerId,
          gisogdFeatures: e[1].gisogdFeatureCollectionWrapper.features,
          gisLayerGeometryTypeHandleArray: e[1].gisLayerGeometryTypeHandleArray
        };
      }
      catch (e) {
        e.message = 'existingInGisWfsLayersIds failed to convertGisogdFeaturesToNewGisFeatures with wfs layer id ' + e[0] + ' ' + e.message;
        throw e;
      }
    });
    console.log('stage convertGisogdFeaturesToNewGisFeatures done. Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted).length', Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted).length)
    let existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes: UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes = {};
    Object.entries(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted).forEach(e => {
      try {
        let gisGeometryTypeLayers = convertNewFeaturesToGeometryTypes(e[0], e[1].featuresFromGisogdToCreateInGis);
        existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes[e[0]] =
        {
          gisGeometryTypeLayers: gisGeometryTypeLayers,
          gisLayerId: e[1].gisLayerId,
          gisogdFeatures: e[1].gisogdFeatures,
          gisLayerGeometryTypeHandleArray: e[1].gisLayerGeometryTypeHandleArray
        };
      }
      catch (e) {
        e.message = 'existingInGisWfsLayersIds failed to convertNewFeaturesToGeometryTypes with wfs layer id ' + e[0] + ' ' + e.message;
        throw e;
      }
    });
    console.log('stage convertNewFeaturesToGeometryTypes done. Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes).length', Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes).length)
    let existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesFeatureFromGis: UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesMerged = {};
    Object.entries(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes).forEach(e => {
      try {
        let merged = mergeGeometryTypes(
          e[1].gisGeometryTypeLayers,
          e[1].gisLayerGeometryTypeHandleArray
        );
        existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesFeatureFromGis[e[0]] = {
          gisGeometryTypeLayersMerged: merged,
          gisLayerId: e[1].gisLayerId,
          gisogdFeatures: e[1].gisogdFeatures,
        }
      }
      catch (e) {
        e.message = 'existingInGisWfsLayersIds failed to mergeGeometryTypes with wfs layer id ' + e[0] + ' ' + e.message;
        throw e;
      }
    });
    console.log('stage mergeGeometryTypes done. Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesFeatureFromGis).length', Object.keys(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesFeatureFromGis).length)
    let entries = Object.entries(existingInGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesFeatureFromGis);
    let updatedLayersArray: {
      gisLayerId: string,
      wfsLayerId: string,//maybe not needed
      gisogdFeatures: GisogdFeature[],
    }[] = [];
    for (let i = 0; i < entries.length; i++) {
      try {
        await updateLayer(
          entries[i][1].gisLayerId,
          config.gis.syncLayersPrefix + entries[i][0],
          entries[i][0],
          entries[i][1].gisGeometryTypeLayersMerged,
          lastAuthUpdateObject,
          sessionObject,
        );
        updatedLayersArray.push({
          gisLayerId: entries[i][1].gisLayerId,
          wfsLayerId: entries[i][0],//maybe not needed
          gisogdFeatures: entries[i][1].gisogdFeatures
        });
      }
      catch (e) {
        e.message = 'existingInGisWfsLayersIds failed to updateLayer with wfs layer id ' + entries[i][0] + ' ' + e.message;
        throw e;
      }
    }
    console.log('stage updateLayer done. updatedLayersArray.length', updatedLayersArray.length);
    return updatedLayersArray;
  }
  catch (e) {
    e.message = 'updateLayersWrapper error: ' + e.message
    throw e
  }
};

export default updateLayersWrapper;