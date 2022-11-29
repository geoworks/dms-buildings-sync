import XXH from 'xxhashjs';
import { JsType } from '../../../deql-ms-server/modules/gis/types';
import {
  FeatureFromGisogdToCreateInGis,
  GisGeometryTypeLayer,
  GisGeometryTypeLayerFields,
} from '../interfaces';

let convertNewFeaturesToGeometryTypes = (
  wfsLayerId: string,
  newFeatures: FeatureFromGisogdToCreateInGis[]
): GisGeometryTypeLayer[] => {
  try {
    let geometryTypes: GisGeometryTypeLayer[] = [];
    let fieldsForPoint: GisGeometryTypeLayerFields = {};
    let fieldsForMultiLineString: GisGeometryTypeLayerFields = {};
    let fieldsForMultiPolygon: GisGeometryTypeLayerFields = {};
    let propetiesTypes: {
      Point: {
        [key: string]: JsType[]
      }
      MultiLineString: {
        [key: string]: JsType[]
      }
      MultiPolygon: {
        [key: string]: JsType[]
      }
    } = {
      Point: {},
      MultiLineString: {},
      MultiPolygon: {},
    }
    newFeatures.forEach(e => {
      if (
        e.geometry.type === 'Point'
      ) {
        Object.entries(e.properties).forEach(e => {
          let previousTypes = propetiesTypes.Point[e[0]];
          if (previousTypes === undefined) {
            previousTypes = [];
          }
          previousTypes.push(typeof e[1]);
          propetiesTypes.Point[e[0]] = previousTypes;
        });
      }
      else if (e.geometry.type === 'MultiLineString') {
        Object.entries(e.properties).forEach(e => {
          let previousTypes = propetiesTypes.MultiLineString[e[0]];
          if (previousTypes === undefined) {
            previousTypes = [];
          }
          previousTypes.push(typeof e[1]);
          propetiesTypes.MultiLineString[e[0]] = previousTypes;
        });
      }
      else if (e.geometry.type === 'MultiPolygon') {
        Object.entries(e.properties).forEach(e => {
          let previousTypes = propetiesTypes.MultiPolygon[e[0]];
          if (previousTypes === undefined) {
            previousTypes = [];
          }
          previousTypes.push(typeof e[1]);
          propetiesTypes.MultiPolygon[e[0]] = previousTypes;
        });
      }
      else {
        throw new Error('unknown GeoJson geometry.type from newFeatures')
      }
    });
    Object.entries(propetiesTypes).forEach(e => {
      if (e[0] === 'Point') {
        Object.entries(e[1]).forEach(v => {
          //вынужденная логика, так как возникает баг с отображением объекта при наведении
          if (v[1].includes('object')) {
            fieldsForPoint[v[0]] =
            {
              description: "",
              name: v[0],
              showInPopup: false,
              showInTable: false,
              editable: true,
              hidden: false,
              propWeight: 0,
              required: false,
              type: "text",
              options: {},
              maxLength: 50,
              defaultValue: ""
            };
          }
          else {
            fieldsForPoint[v[0]] =
            {
              description: "",
              name: v[0],
              showInPopup: true,
              showInTable: true,
              editable: true,
              hidden: false,
              propWeight: 0,
              required: false,
              type: "text",
              options: {},
              maxLength: 50,
              defaultValue: ""
            };
          }
        });
      }
      else if (e[0] === 'MultiLineString') {
        Object.entries(e[1]).forEach(v => {
          //вынужденная логика, так как возникает баг с отображением объекта при наведении
          if (v[1].includes('object')) {
            fieldsForMultiLineString[v[0]] =
            {
              description: "",
              name: v[0],
              showInPopup: false,
              showInTable: false,
              editable: true,
              hidden: false,
              propWeight: 0,
              required: false,
              type: "text",
              options: {},
              maxLength: 50,
              defaultValue: ""
            };
          }
          else {
            fieldsForMultiLineString[v[0]] =
            {
              description: "",
              name: v[0],
              showInPopup: true,
              showInTable: true,
              editable: true,
              hidden: false,
              propWeight: 0,
              required: false,
              type: "text",
              options: {},
              maxLength: 50,
              defaultValue: ""
            };
          }
        });
      }
      else if (e[0] === 'MultiPolygon') {
        Object.entries(e[1]).forEach(v => {
          //вынужденная логика, так как возникает баг с отображением объекта при наведении
          if (v[1].includes('object')) {
            fieldsForMultiPolygon[v[0]] =
            {
              description: "",
              name: v[0],
              showInPopup: false,
              showInTable: false,
              editable: true,
              hidden: false,
              propWeight: 0,
              required: false,
              type: "text",
              options: {},
              maxLength: 50,
              defaultValue: ""
            };
          }
          else {
            fieldsForMultiPolygon[v[0]] =
            {
              description: "",
              name: v[0],
              showInPopup: true,
              showInTable: true,
              editable: true,
              hidden: false,
              propWeight: 0,
              required: false,
              type: "text",
              options: {},
              maxLength: 50,
              defaultValue: ""
            };
          }
        });
      }
      else {
        throw new Error("unexpected type")
      }
    });
    newFeatures.forEach(e => {
      if (
        e.geometry.type === 'Point'
      ) {
        if (!geometryTypes.length) {
          geometryTypes.push(
            {
              id: 'Point',
              name: 'Point',
              geometryType: 'Point',
              style: {
                defaultStyle: {
                  borderType: "marker",
                  color: '#' + XXH.h32(wfsLayerId + 'Point' + 'color').toString(16).slice(0, 6),
                  fill: false,
                  fillColor: '#' + XXH.h32(wfsLayerId + 'Point' + 'fillColor').toString(16).slice(0, 6),
                  iconColor: '#' + XXH.h32(wfsLayerId + 'Point' + 'iconColor').toString(16).slice(0, 6),
                  iconUrl: "",
                  opacity: 1,
                  showMarker: true,
                  size: 21,
                  weight: 3,
                  lineWidth: 1,
                  unfill: false,
                  id: 'Point'
                },
                cases: {}
              },
              propertiesSchema: {
                fields: fieldsForPoint
              }
            }
          );
        }
        else {
          let isPointAlreadyInThere = false;
          for (let i = 0; i < geometryTypes.length; i++) {
            if (geometryTypes[i].geometryType === 'Point') {
              isPointAlreadyInThere = true;
              break;
            }
          }
          if (!isPointAlreadyInThere) {
            geometryTypes.push(
              {
                id: 'Point',
                name: 'Point',
                geometryType: 'Point',
                style: {
                  defaultStyle: {
                    borderType: "marker",
                    color: '#' + XXH.h32(wfsLayerId + 'Point' + 'color').toString(16).slice(0, 6),
                    fill: false,
                    fillColor: '#' + XXH.h32(wfsLayerId + 'Point' + 'fillColor').toString(16).slice(0, 6),
                    iconColor: '#' + XXH.h32(wfsLayerId + 'Point' + 'iconColor').toString(16).slice(0, 6),
                    iconUrl: "",
                    opacity: 1,
                    showMarker: true,
                    size: 21,
                    weight: 3,
                    lineWidth: 1,
                    unfill: false,
                    id: 'Point'
                  },
                  cases: {}
                },
                propertiesSchema: {
                  fields: fieldsForPoint
                }
              }
            );
          }
        }
      }
      else if (e.geometry.type === 'MultiLineString') {
        if (!geometryTypes.length) {
          geometryTypes.push(
            {
              id: 'MultiLineString',
              name: 'MultiLineString',
              geometryType: 'MultiLineString',
              style: {
                defaultStyle: {
                  borderType: "marker",
                  color: '#' + XXH.h32(wfsLayerId + 'MultiLineString' + 'color').toString(16).slice(0, 6),
                  fill: false,
                  fillColor: '#' + XXH.h32(wfsLayerId + 'MultiLineString' + 'fillColor').toString(16).slice(0, 6),
                  iconColor: '#' + XXH.h32(wfsLayerId + 'MultiLineString' + 'iconColor').toString(16).slice(0, 6),
                  iconUrl: "",
                  opacity: 1,
                  showMarker: true,
                  size: 21,
                  weight: 3,
                  lineWidth: 1,
                  unfill: false,
                  id: 'MultiLineString'
                },
                cases: {}
              },
              propertiesSchema: {
                fields: fieldsForMultiLineString
              }
            }
          );
        }
        else {
          let isMultiLineStringAlreadyInThere = false;
          for (let i = 0; i < geometryTypes.length; i++) {
            if (geometryTypes[i].geometryType === 'MultiLineString') {
              isMultiLineStringAlreadyInThere = true;
              break;
            }
          }
          if (!isMultiLineStringAlreadyInThere) {
            geometryTypes.push(
              {
                id: 'MultiLineString',
                name: 'MultiLineString',
                geometryType: 'MultiLineString',
                style: {
                  defaultStyle: {
                    borderType: "marker",
                    color: '#' + XXH.h32(wfsLayerId + 'MultiLineString' + 'color').toString(16).slice(0, 6),
                    fill: false,
                    fillColor: '#' + XXH.h32(wfsLayerId + 'MultiLineString' + 'fillColor').toString(16).slice(0, 6),
                    iconColor: '#' + XXH.h32(wfsLayerId + 'MultiLineString' + 'iconColor').toString(16).slice(0, 6),
                    iconUrl: "",
                    opacity: 1,
                    showMarker: true,
                    size: 21,
                    weight: 3,
                    lineWidth: 1,
                    unfill: false,
                    id: 'MultiLineString'
                  },
                  cases: {}
                },
                propertiesSchema: {
                  fields: fieldsForMultiLineString
                }
              }
            );
          }
        }
      }
      else if (e.geometry.type === 'MultiPolygon') {
        if (!geometryTypes.length) {
          geometryTypes.push(
            {
              id: 'MultiPolygon',
              name: 'MultiPolygon',
              geometryType: 'MultiPolygon',
              style: {
                defaultStyle: {
                  borderType: "marker",
                  color: '#' + XXH.h32(wfsLayerId + 'MultiPolygon' + 'color').toString(16).slice(0, 6),
                  fill: false,
                  fillColor: '#' + XXH.h32(wfsLayerId + 'MultiPolygon' + 'fillColor').toString(16).slice(0, 6),
                  iconColor: '#' + XXH.h32(wfsLayerId + 'MultiPolygon' + 'iconColor').toString(16).slice(0, 6),
                  iconUrl: "",
                  opacity: 1,
                  showMarker: true,
                  size: 21,
                  weight: 3,
                  lineWidth: 1,
                  unfill: false,
                  id: 'MultiPolygon'
                },
                cases: {}
              },
              propertiesSchema: {
                fields: fieldsForMultiPolygon
              }
            }
          );
        }
        else {
          let isMultiPolygonAlreadyInThere = false;
          for (let i = 0; i < geometryTypes.length; i++) {
            if (geometryTypes[i].geometryType === 'MultiPolygon') {
              isMultiPolygonAlreadyInThere = true
              break;
            }
          }
          if (!isMultiPolygonAlreadyInThere) {
            geometryTypes.push(
              {
                id: 'MultiPolygon',
                name: 'MultiPolygon',
                geometryType: 'MultiPolygon',
                style: {
                  defaultStyle: {
                    borderType: "marker",
                    color: '#' + XXH.h32(wfsLayerId + 'MultiPolygon' + 'color').toString(16).slice(0, 6),
                    fill: false,
                    fillColor: '#' + XXH.h32(wfsLayerId + 'MultiPolygon' + 'fillColor').toString(16).slice(0, 6),
                    iconColor: '#' + XXH.h32(wfsLayerId + 'MultiPolygon' + 'iconColor').toString(16).slice(0, 6),
                    iconUrl: "",
                    opacity: 1,
                    showMarker: true,
                    size: 21,
                    weight: 3,
                    lineWidth: 1,
                    unfill: false,
                    id: 'MultiPolygon'
                  },
                  cases: {}
                },
                propertiesSchema: {
                  fields: fieldsForMultiPolygon
                }
              }
            );
          }
        }
      }
      else {
        throw new Error('unknown GeoJson geometry.type from newFeatures')
      }
    });
    if (geometryTypes.length > 3) {
      throw new Error('geometryTypes.length > 3')
    }
    return geometryTypes;
  }
  catch (e) {
    e.message = 'convertNewFeaturesToGeometryTypes error: ' + e.message
    throw e
  }
};

export default convertNewFeaturesToGeometryTypes;