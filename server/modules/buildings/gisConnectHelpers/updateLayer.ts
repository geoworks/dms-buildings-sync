import fetch from 'node-fetch';
import IsAuthorizedInGis from './isAuthorizedInGis';
import GisAuth from './gisAuth';
import {
  SessionObject,
  LastAuthUpdateObject,
  GisGeometryTypeLayer,
} from '../interfaces';
import getGisPlace from './getGisPlace';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
import options from '../../../deql-ms-server/tools/options';
const { config } = options;

export interface GisUpdateLayerBodyType {
  operationName: "updateLayer",
  variables: {
    displayName: string,
    catalogs: unknown[],
    layerId: string,
    props: {
      description: string,
      displayName: string,
      editable: true,
      visible: true,
      public: false,
      modules: [],
      defaultSettings: {
        visible: true,
        filter: null,
        isCluster: false,
        clusterizationLevel: 0,
        opacity: 1,
        orderWeight: 1
      },
      geometryTypes: GisGeometryTypeLayer[],
      serviceName: "dms-features"
    },
    type: "Feature"
  },
  query: "mutation updateLayer($catalogs: [String], $displayName: String!, $layerId: String!, $props: JSON!, $type: String!) {\n  updateLayer(catalogs: $catalogs, displayName: $displayName, layerId: $layerId, type: $type, props: $props) {\n    catalogs\n    _id\n    props\n    type\n    displayName\n    __typename\n  }\n}\n"
}

export let updateLayer = async (
  layerId: string,
  displayName: string,
  description: string,
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
    let body: GisUpdateLayerBodyType[] = [
      {
        "operationName": "updateLayer",
        "variables": {
          "displayName": displayName,
          "catalogs": [],
          "layerId": layerId,
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
            "geometryTypes": geometryTypes,
            "serviceName": "dms-features"
          },
          "type": "Feature"
        },
        "query": "mutation updateLayer($catalogs: [String], $displayName: String!, $layerId: String!, $props: JSON!, $type: String!) {\n  updateLayer(catalogs: $catalogs, displayName: $displayName, layerId: $layerId, type: $type, props: $props) {\n    catalogs\n    _id\n    props\n    type\n    displayName\n    __typename\n  }\n}\n"
      }
    ];
    let bodyStringified = JSON.stringify(body);
    let req = await fetch(config.gis.http + '://' + getGisPlace() + '/graphql', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ru-RU,ru',
        'Connection': 'keep-alive',
        'Content-Length': '' + Buffer.byteLength(bodyStringified),
        'content-type': 'application/json',
        'Cookie': sessionObject.session,
        // 'Host': 'localhost:3000',
        // 'Origin': 'http://localhost:3000',
        // 'Referer': 'http://localhost:3000/administration/layers',
        'origin': 'https://geo.cap.ru',
        'referer': 'https://geo.cap.ru/portal',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      },
      body: bodyStringified,
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
          hasOwnPropertyFromUnknown(data[0].data, 'updateLayer') &&
          typeof data[0].data.updateLayer &&
          data[0].data.updateLayer !== null &&
          hasOwnPropertyFromUnknown(data[0].data.updateLayer, '_id') &&
          typeof data[0].data.updateLayer._id === 'string'
        ) {
          return data[0].data.updateLayer._id;
        }
        else {
          throw new Error('type check failed, data: ' + JSON.stringify(data));
        }
      }
    }
  }
  catch (e) {
    e.message = 'updateLayer error: ' + e.message
    throw e
  }
};