import bsonRequest from '../../../deql-ms-server/tools/utils/bsonRequest';
import http from 'http';
import { Readable } from 'stream';
import bson from 'bson';
import IsAuthorizedInGis from './isAuthorizedInGis';
import GisAuth from './gisAuth';
import { SessionObject, LastAuthUpdateObject, FeatureFromGis } from '../interfaces';
import options from './../../../deql-ms-server/tools/options';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
const { config } = options;

export let getFeaturesFromGis = async (
  layerId: string,
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
  select: string[],
): Promise<FeatureFromGis[]> => {
  try {
    let currentDate = +new Date();
    if (currentDate > lastAuthUpdateObject.lastAuthUpdate + 1000 * 60 * 5) {
      let isElevated = await IsAuthorizedInGis(sessionObject);
      if (!isElevated) {
        await GisAuth(sessionObject);
      }
      lastAuthUpdateObject.lastAuthUpdate = currentDate;
    }
    let featuresFromGis: FeatureFromGis[] = await new Promise((res, rej) => {
      let features: FeatureFromGis[] = [];
      let headers = {
        'content-type': 'application/bson',
        cookie: sessionObject.session,
        // 'origin': 'https://geo.cap.ru',
        // 'Referer': '',
        // 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        // 'x-cache': '2ae0df197659ea4fe5dd9c7894283e64',
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
          // filter: {
          //   'geometry.type': featureType
          // },
          select: select
        },
      );
      request.on('data', data => {
        let des: unknown = bson.deserialize(data);
        if (
          typeof des === 'object' &&
          des !== null &&
          hasOwnPropertyFromUnknown(des, '_id') &&
          typeof des._id === 'object' &&
          des._id !== null &&
          hasOwnPropertyFromUnknown(des, 'properties') &&
          typeof des.properties === 'object' &&
          des.properties !== null
          &&
          hasOwnPropertyFromUnknown(des, 'geometry') &&
          typeof des.geometry === 'object' &&
          des.geometry !== null &&
          hasOwnPropertyFromUnknown(des.geometry, 'type') &&
          typeof des.geometry.type === 'string'
        ) {
          if (
            des.geometry.type === 'Point' &&
            hasOwnPropertyFromUnknown(des.geometry, 'coordinates') &&
            Array.isArray(des.geometry.coordinates) &&
            des.geometry.coordinates.length === 2 //в каких то стандартах там щее опциональный 3 элемент, мб не стоит добавлять эту проверку
          ) {
            if (typeof des.geometry.coordinates[0] === 'number' && typeof des.geometry.coordinates[1] === 'number') {
              let props: {
                gisogdgemssyncfeatureid?: string
              };
              if (
                hasOwnPropertyFromUnknown(des.properties, 'gisogdgemssyncfeatureid') &&
                typeof des.properties.gisogdgemssyncfeatureid === 'string'
              ) {
                props = {
                  gisogdgemssyncfeatureid: des.properties.gisogdgemssyncfeatureid
                };
              }
              else {
                props = {};
              }
              features.push({
                _id: des._id,
                properties: props,
                geometry: {
                  type: des.geometry.type,
                  coordinates: [des.geometry.coordinates[0], des.geometry.coordinates[1]],
                },
              });
            }
            else {
              throw new Error('Point des.geometry.coordinates check failed')
            }
          }
          else if (
            des.geometry.type === 'MultiLineString' &&
            hasOwnPropertyFromUnknown(des.geometry, 'coordinates') &&
            Array.isArray(des.geometry.coordinates)
          ) {
            let coords: [number, number][][] = []
            des.geometry.coordinates.forEach((e: unknown) => {
              if (Array.isArray(e)) {
                let innerCoords: [number, number][] = [];
                e.forEach((innerE: unknown) => {
                  if (
                    Array.isArray(innerE) &&
                    innerE.length === 2 &&
                    typeof innerE[0] === 'number' &&
                    typeof innerE[1] === 'number'
                  ) {
                    innerCoords.push([innerE[0], innerE[1]]);
                  }
                  else {
                    throw new Error('MultiLineString des.geometry.coordinates check failed')
                  }
                });
                coords.push(innerCoords);
              }
              else {
                throw new Error('MultiLineString des.geometry.coordinates check failed')
              }
            });
            let props: {
              gisogdgemssyncfeatureid?: string
            };
            if (
              hasOwnPropertyFromUnknown(des.properties, 'gisogdgemssyncfeatureid') &&
              typeof des.properties.gisogdgemssyncfeatureid === 'string'
            ) {
              props = {
                gisogdgemssyncfeatureid: des.properties.gisogdgemssyncfeatureid
              };
            }
            else {
              props = {};
            }
            features.push({
              _id: des._id,
              properties: props,
              geometry: {
                type: des.geometry.type,
                coordinates: coords,
              },
            });
          }
          else if (
            des.geometry.type === 'MultiPolygon' &&
            hasOwnPropertyFromUnknown(des.geometry, 'coordinates') &&
            Array.isArray(des.geometry.coordinates)
          ) {
            let coords: [number, number][][][] = []
            des.geometry.coordinates.forEach((e: unknown) => {
              if (Array.isArray(e)) {
                let innerCoords: [number, number][][] = [];
                e.forEach((innerE: unknown) => {
                  if (Array.isArray(innerE)) {
                    let anotherInnerCoordinates: [number, number][] = [];
                    innerE.forEach((anotherInnerE: unknown) => {
                      if (
                        Array.isArray(anotherInnerE) &&
                        anotherInnerE.length === 2 &&
                        typeof anotherInnerE[0] === 'number' &&
                        typeof anotherInnerE[1] === 'number'
                      ) {
                        anotherInnerCoordinates.push([anotherInnerE[0], anotherInnerE[1]]);
                      }
                      else {
                        throw new Error('MultiPolygon des.geometry.coordinates check failed1')
                      }
                    });
                    innerCoords.push(anotherInnerCoordinates);
                  }
                  else {
                    throw new Error('MultiPolygon des.geometry.coordinates check failed1')
                  }
                });
                coords.push(innerCoords);
              }
              else {
                throw new Error('MultiPolygon des.geometry.coordinates check failed1')
              }
            });
            let props: {
              gisogdgemssyncfeatureid?: string
            };
            if (
              hasOwnPropertyFromUnknown(des.properties, 'gisogdgemssyncfeatureid') &&
              typeof des.properties.gisogdgemssyncfeatureid === 'string'
            ) {
              props = {
                gisogdgemssyncfeatureid: des.properties.gisogdgemssyncfeatureid
              };
            }
            else {
              props = {};
            }
            features.push({
              _id: des._id,
              properties: props,
              geometry: {
                type: des.geometry.type,
                coordinates: coords,
              },
            });
          }
          else {
            //может тут нужно просто игнорировать все остальные типы?
            console.error('непподдерживаемый тип геометрии ' + des.geometry.type)
            // rej(new Error('unexpected des.geometry.type or coordinates'));
          }
        }
        else {
          rej(new Error('parsing data failed' + JSON.stringify(des)));
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
