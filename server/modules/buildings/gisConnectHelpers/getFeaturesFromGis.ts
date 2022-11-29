// import bsonRequest from '../../../deql-ms-server/tools/utils/bsonRequest';
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

//модифицированный bsonRequest так как нужна логика изменнеия хоста и порта на просто порт хост без порта
class bsonRequest extends Readable {
  rs: http.ClientRequest
  constructor(reqParams: {
    host: string,
    port: string | number,
    url: string,
    method?: 'GET' | 'POST',
    headers?: { [key: string]: string }
  },
    params: any
  ) {
    super({ objectMode: true }); //указываем что мы будем работать не с потоками байт
    const postData = bson.serialize(params);

    let options: object;
    if (config.gis.http === 'http') {
      options = {
        host: reqParams.host,
        port: reqParams.port,
        path: reqParams.url,
        method: reqParams.method || 'POST',
        headers: {
          ...{
            'Content-Type': 'application/bson',
            'Content-Length': Buffer.byteLength(postData),
          },
          ...(reqParams.headers || {}),
        },
      };
    }
    else if (config.gis.http === 'https') {
      options = {
        host: reqParams.host,
        // port: reqParams.port,
        path: reqParams.url,
        method: reqParams.method || 'POST',
        headers: {
          ...{
            'Content-Type': 'application/bson',
            'Content-Length': Buffer.byteLength(postData),
          },
          ...(reqParams.headers || {}),
        },
      };
    }
    else {
      throw new Error('config.gis.http !== http && config.gis.http !== https')
    }
    this.rs = http
      .request(options, resp => {
        this.emit(
          'headers',
          resp.headers, resp.statusCode
        );
        //Ошибка при получении фичеров
        if ((resp.statusCode || 600) > 200) {
          let buf = Buffer.alloc(0);
          resp.on('data', chunk => {
            buf = Buffer.concat([buf, chunk]);
          });
          resp.on('end', () => {
            this.emit(
              'error',
              new Error(buf.toString() || 'Произошла непредвиденная ошибка')
            );
          });
          return;
        }

        if (resp.headers['content-type'] === 'application/json') {
          throw new Error(`Сервер ответил типом ${resp.headers['content-type']}`);
        }
        //ошибок нет
        let buf = Buffer.alloc(0);

        resp.on('data', chunk => {
          if (buf.length === 0) {
            buf = chunk;
          } else {
            buf = Buffer.concat([buf, chunk]);
          }
          let featureLength =
            buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24);
          while (buf.length >= featureLength && buf.length !== 0) {
            if (featureLength < 0) {
              buf = Buffer.alloc(0);
              featureLength = 0;
              break;
            }
            if (buf.length >= featureLength) {
              let obj = buf.subarray(0, featureLength);
              this.push(obj);
            }
            buf = buf.subarray(featureLength);
            if (buf.length < 4) {
              featureLength = -1;
            } else {
              featureLength =
                buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24);
            }
          }
        });
        resp.on('end', () => {
          this.push(null);
        });
      })
      .on('error', err => {
        console.log('Error: ' + err.message);
        this.emit('error', err);
      });
    this.rs.write(postData);
    this.rs.end();
  }
  _read() {
    return;
  }
  close() {
    this.rs.abort();
  }
}
