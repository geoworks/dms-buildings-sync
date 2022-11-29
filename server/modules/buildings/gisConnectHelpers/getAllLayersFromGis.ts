import fetch from 'node-fetch';
import IsAuthorizedInGis from './isAuthorizedInGis';//getElevated
import GisAuth from './gisAuth';
import { SessionObject, LastAuthUpdateObject, Layer, GeometryTypeHandle } from './../interfaces';
import getGisPlace from './getGisPlace';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
import options from '../../../deql-ms-server/tools/options';
const { config } = options;

let getAllLayersFromGis = async (
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
) => {
  try {
    let currentDate = +new Date();
    if (currentDate > lastAuthUpdateObject.lastAuthUpdate + 1000 * 60 * 5) {
      let isElevatedAndSession = await IsAuthorizedInGis(sessionObject);//может тут дополнительную логику с сессией нужно учитывать?
      if (isElevatedAndSession.session !== null) {
        sessionObject.session = isElevatedAndSession.session;
      }
      if (!isElevatedAndSession.isElevated) {
        await GisAuth(sessionObject);
      }
      lastAuthUpdateObject.lastAuthUpdate = currentDate;
    }
    let body = {
      'operationName': null,
      'variables': {},
      'query': 'query ($params: JSON) {\n  allLayers(params: $params) {_id\n    props}\n}\n',//\n    props\n    type\n    displayName\n    __typename\n  //\n    
    };
    let req = await fetch(config.gis.http + '://' + getGisPlace() + '/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionObject.session,
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru-RU,ru;q=0.8',
        'content-length': '178',
        // 'content-type': 'application/json',
        // 'cookie': 'connect.sid=s%3AxvVgMZIZ1OXcH58GRiK0Ferlq9VCcLV2.S4x%2B%2FdJRzWtrbnCPZ2eialYNyq42nW4TBi%2Fob0w8iT8',
        'origin': 'https://geo.cap.ru',
        'referer': 'https://geo.cap.ru/administration/layers',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(body),
    });
    if (req.status !== 200) {
      let message = await req.text();
      throw new Error(message || 'req.status !== 200');
    } else {
      let data: unknown = await req.json();
      if (
        typeof data === 'object' &&
        data !== null &&
        hasOwnPropertyFromUnknown(data, 'errors') &&
        data.errors && // Array.isArray('errors') &&
        data.errors[0]
      ) {
        throw new Error(
          data.errors[0].message || 'data.errors && data.errors[0] === true'
        );
      } else {
        if (
          typeof data === 'object' &&
          data !== null &&
          hasOwnPropertyFromUnknown(data, 'data') &&
          typeof data.data === 'object' &&
          data.data !== null &&
          hasOwnPropertyFromUnknown(data.data, 'allLayers') &&
          Array.isArray(data.data.allLayers)
        ) {
          let allLayers: Layer[] = [];
          data.data.allLayers.forEach((e: unknown) => {
            if (
              typeof e === 'object' &&
              e !== null &&
              hasOwnPropertyFromUnknown(e, '_id') &&
              typeof e._id === 'string' &&
              hasOwnPropertyFromUnknown(e, 'props') &&
              typeof e.props === 'object' &&
              e.props !== null &&
              hasOwnPropertyFromUnknown(e.props, 'geometryTypes') &&
              Array.isArray(e.props.geometryTypes)
            ) {
              let descriptionHandle: string | null;
              if (
                hasOwnPropertyFromUnknown(e.props, 'description') &&
                (typeof e.props.description === 'string' || e.props.description === null)
              ) {
                descriptionHandle = e.props.description;
              }
              else {
                descriptionHandle = null;//корректно ли?
              }
              let geometryTypeHandleArray: GeometryTypeHandle[] = [];
              e.props.geometryTypes.forEach((e: unknown) => {
                if (
                  typeof e === 'object' &&
                  e !== null &&
                  hasOwnPropertyFromUnknown(e, 'id') &&
                  typeof e.id === 'string' &&
                  hasOwnPropertyFromUnknown(e, 'name') &&
                  typeof e.name === 'string' &&
                  hasOwnPropertyFromUnknown(e, 'geometryType') &&
                  (e.geometryType === "Point" || e.geometryType === "MultiLineString" || e.geometryType === "MultiPolygon")
                ) {
                  if (
                    hasOwnPropertyFromUnknown(e, 'propertiesSchema') &&
                    typeof e.propertiesSchema === 'object' &&
                    e.propertiesSchema !== null &&
                    hasOwnPropertyFromUnknown(e.propertiesSchema, 'fields') &&
                    typeof e.propertiesSchema.fields === 'object' &&
                    e.propertiesSchema.fields !== null
                  ) {
                    let fieldsHandle: {
                      [key: string]: {
                        showInPopup: boolean,
                        showInTable: boolean,
                      }
                    } = {};
                    Object.entries(e.propertiesSchema.fields).forEach((d: [string, unknown]) => {
                      if (
                        typeof d[1] === 'object' &&
                        d[1] !== null &&
                        hasOwnPropertyFromUnknown(d[1], 'showInPopup') &&
                        typeof d[1].showInPopup === 'boolean' &&
                        hasOwnPropertyFromUnknown(d[1], 'showInTable') &&
                        typeof d[1].showInTable === 'boolean'
                      ) {
                        fieldsHandle[d[0]] = {
                          showInPopup: d[1].showInPopup,
                          showInTable: d[1].showInTable,
                        }
                      }
                      else {
                        throw new Error('Object.entries(e.propertiesSchema.fields) e[1] check failed')
                      }
                    });
                    geometryTypeHandleArray.push(
                      {
                        id: e.id,
                        name: e.name,
                        geometryType: e.geometryType,
                        propertiesSchema: {
                          fields: fieldsHandle
                        }
                      }
                    )
                  }
                  else {
                    geometryTypeHandleArray.push(
                      {
                        id: e.id,
                        name: e.name,
                        geometryType: e.geometryType,
                        propertiesSchema: {
                          fields: {}
                        }
                      }
                    )
                  }
                }
                else {
                  throw new Error('one of e.props.geometryTypes check failed ' + JSON.stringify(e));
                }
              });
              allLayers.push({
                _id: e._id,
                props: {
                  description: descriptionHandle,
                  geometryTypes: geometryTypeHandleArray
                }
              });
            }
            else {
              throw new Error('element of data.data.allLayers - parsing failed' + JSON.stringify(e));
            }
          });
          return allLayers;
        }
        else {
          throw new Error('data.data.allLayers parsing failed');
        }
      }
    }
  }
  catch (e) {
    e.message = 'getAllLayersFromGis error: ' + e.message
    throw e
  }
};
export default getAllLayersFromGis;