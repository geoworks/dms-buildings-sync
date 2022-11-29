import fetch from 'node-fetch';
import IsAuthorizedInGis from './isAuthorizedInGis';
import GisAuth from './gisAuth';
import {
  SessionObject,
  LastAuthUpdateObject,
  GisGeometryTypeLayer,
} from '../interfaces';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
import options from '../../../deql-ms-server/tools/options';
const { config } = options;

export interface GisCreateLayerBodyType {
  operationName: "createLayer",
  variables: {
    displayName: string,
    projectName: string,
    catalogs: [],
    props: {
      description: string,
      displayName: string,
      editable: boolean,
      visible: true,
      public: false,
      modules: [],
      defaultSettings: {
        visible: boolean,
        filter: null,
        isCluster: false,
        clusterizationLevel: 0,
        opacity: 1,
        orderWeight: 1
      },
      geometryTypes: GisGeometryTypeLayer[]
    },
    type: "Feature"
  },
  query: "mutation createLayer($roleName: String, $displayName: String!, $projectName: String, $props: JSON!, $type: String!) {\n  createLayer(displayName: $displayName, projectName: $projectName, props: $props, type: $type, roleName: $roleName) {\n    _id\n    props\n    type\n    displayName\n    __typename\n  }\n}\n"
}

export interface GisCreateLayerSuccessResponseElement {
  data: {
    createLayer: {
      _id: string,//object ?
      // "props": {
      //   "description": string,
      //   "displayName": string,
      //   "editable": true,
      //   "visible": true,
      //   "public": false,
      //   "modules": [],
      //   "defaultSettings": {
      //     "visible": true,
      //     "filter": null,
      //     "isCluster": false,
      //     "clusterizationLevel": 0,
      //     "opacity": 1,
      //     "orderWeight": 1
      //   },
      //   "geometryTypes": [
      //     {
      //       "id": "",
      //       "name": "",
      //       "geometryType": "Point",
      //       "style": {
      //         "defaultStyle": {
      //           "borderType": "marker",
      //           "color": "#0288d1",
      //           "fill": false,
      //           "fillColor": "#0288d1",
      //           "iconColor": "#FFFFFF",
      //           "iconUrl": "",
      //           "opacity": 1,
      //           "showMarker": true,
      //           "size": 21,
      //           "weight": 3,
      //           "lineWidth": 1,
      //           "unfill": false,
      //           "id": ""
      //         },
      //         "cases": {}
      //       },
      //       "propertiesSchema": {
      //         "fields": {
      //           "propertyname": {
      //             "description": "",
      //             "name": "",
      //             "showInPopup": false,
      //             "showInTable": false,
      //             "editable": true,
      //             "hidden": false,
      //             "propWeight": 0,
      //             "required": false,
      //             "type": "text",
      //             "options": {},
      //             "maxLength": 50,
      //             "defaultValue": ""
      //           }
      //         }
      //       }
      //     }
      //   ],
      //   "serviceName": "dms-features"
      // },
      // "type": "Feature",
      // "displayName": "",
      // "__typename": "Layer"
    }
  }
}

export let createLayer = async (
  displayName: string,
  description: string,
  projectName: string,
  geometryTypes: GisGeometryTypeLayer[],
  lastAuthUpdateObject: LastAuthUpdateObject,
  sessionObject: SessionObject,
): Promise<string> => {
  try {
    let currentDate = +new Date();
    if (currentDate > lastAuthUpdateObject.lastAuthUpdate + 1000 * 60 * 5) {
      let isElevated = await IsAuthorizedInGis(sessionObject);
      if (!isElevated) {
        await GisAuth(sessionObject);
      }
      lastAuthUpdateObject.lastAuthUpdate = currentDate;
    }
    let body: GisCreateLayerBodyType[] = [
      {
        "operationName": "createLayer",
        "variables": {
          "displayName": displayName,
          "catalogs": [],
          "projectName": projectName,
          "props": {
            "description": description,
            "displayName": displayName,
            "editable": true,
            "visible": true,
            "public": false,
            "modules": [],
            "defaultSettings": {
              "visible": true,
              "filter": null,
              "isCluster": false,
              "clusterizationLevel": 0,
              "opacity": 1,
              "orderWeight": 1
            },
            "geometryTypes": geometryTypes
          },
          "type": "Feature"
        },
        "query": "mutation createLayer($roleName: String, $displayName: String!, $projectName: String, $props: JSON!, $type: String!) {\n  createLayer(displayName: $displayName, projectName: $projectName, props: $props, type: $type, roleName: $roleName) {\n    _id\n    props\n    type\n    displayName\n    __typename\n  }\n}\n"
      }
    ];
    let req = await fetch('http' + '://' + config.gis.host + ':' + config.gis.port + '/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Cookie': sessionObject.session,
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru-RU,ru;q=0.8',
        'content-length': '1204',
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
      throw new Error(message || 'Не удалось установить связь с сервером');
    } else {
      let data: unknown = await req.json();
      if (
        typeof data === 'object' &&
        data !== null &&
        hasOwnPropertyFromUnknown(data, 'errors') &&
        data.errors &&
        Array.isArray(data.errors) &&
        data.errors[0]
      ) {
        throw new Error(
          data.errors[0].message || 'Произошла непредвиденная ошибка'
        );
      } else {
        if (
          Array.isArray(data) &&
          data.length === 1 &&
          typeof data[0] === 'object' &&
          data[0] !== null &&
          hasOwnPropertyFromUnknown(data[0], 'data') &&
          typeof data[0].data === 'object' &&
          data[0].data !== null &&
          hasOwnPropertyFromUnknown(data[0].data, 'createLayer') &&
          typeof data[0].data.createLayer &&
          data[0].data.createLayer !== null &&
          hasOwnPropertyFromUnknown(data[0].data.createLayer, '_id') &&
          typeof data[0].data.createLayer._id === 'string'
        ) {
          return data[0].data.createLayer._id;
        }
        else {
          throw new Error('type check failed');
        }
      }
    }
  }
  catch (e) {
    e.message = 'createLayer error: ' + e.message
    throw e
  }
};