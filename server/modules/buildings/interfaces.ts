import { GisGeometryType } from '../../deql-ms-server/modules/gis/types';

export type BuildingsData = {
  GeoCap: BuildingsDataElement[]
}

export type BuildingsDataElement = {
  latCoordinate: string,
  longCoordinate: string,
  [key: string]: unknown
}




export interface GisGeometryTypeLayerFields {
  [key: string]: {
    description: string,
    name: string,
    showInPopup: boolean,
    showInTable: boolean,
    editable: true,
    hidden: false,
    propWeight: 0,
    required: false,
    type: "text",
    options: {},
    maxLength: 50,
    defaultValue: string
  }
}

export interface GisGeometryTypeLayer {
  id: string,
  name: string,
  geometryType: GisGeometryType,
  style: {
    defaultStyle: {
      borderType: "marker",
      color: string,
      fill: false,
      fillColor: string,
      iconColor: string,
      iconUrl: "",
      opacity: 1,
      showMarker: true,
      size: 21,
      weight: 3,
      lineWidth: 1,
      unfill: false,
      id: string
    },
    cases: {}
  },
  propertiesSchema: {
    fields: GisGeometryTypeLayerFields
  }
}

export interface LastAuthUpdateObject {
  lastAuthUpdate: number,
}

export interface SessionObject {
  session: string,
}

export interface GisogdFeatureCollectionWrapper {
  type: 'FeatureCollection',//what if its a "GeometryCollection" ?
  features: GisogdFeature[],
  totalFeatures: number,
  numberMatched: number,
  numberReturned: number,
  timeStamp: string,
  crs: {
    type: string,
    properties: {
      name: string
    }
  } | null
}

export interface WfsLayersIdsWithPossibleFeatures {
  [key: string]: unknown
}

export interface UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypesMerged {
  [key: string]: {
    gisGeometryTypeLayersMerged: GisGeometryTypeLayer[],
    gisLayerId: string,
    gisogdFeatures: GisogdFeature[],
  }
}

export interface UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes {
  [key: string]: {
    gisGeometryTypeLayers: GisGeometryTypeLayer[],
    gisLayerId: string,
    gisogdFeatures: GisogdFeature[],
    gisLayerGeometryTypeHandleArray: GeometryTypeHandle[]
  }
}

export interface UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted {
  [key: string]: {
    featuresFromGisogdToCreateInGis: FeatureFromGisogdToCreateInGis[],
    gisLayerId: string,
    gisogdFeatures: GisogdFeature[],
    gisLayerGeometryTypeHandleArray: GeometryTypeHandle[]
  }
}

export interface UpdateGisWfsLayersIdsWithPossibleWfsFeaturesParsed {
  [key: string]: {
    gisogdFeatureCollectionWrapper: GisogdFeatureCollectionWrapper,
    gisLayerId: string,
    gisLayerGeometryTypeHandleArray: GeometryTypeHandle[]
  }
}

export interface UpdateGisWfsLayersIdsWithPossibleWfsFeatures {
  [key: string]: {
    possibleFeatures: unknown,
    gisLayerId: string,
    gisLayerGeometryTypeHandleArray: GeometryTypeHandle[]
  }
}

export interface GisWfsLayersIdsWithPossibleWfsFeaturesParsedConvertedGeometryTypes {
  [key: string]: {
    gisGeometryTypeLayer: GisGeometryTypeLayer[],
    featuresFromGisogdToCreateinGis: FeatureFromGisogdToCreateInGis[],
  }
}

export interface GisWfsLayersIdsWithPossibleWfsFeaturesParsedConverted {
  [key: string]: FeatureFromGisogdToCreateInGis[]
}

export interface GisWfsLayersIdsWithPossibleWfsFeaturesParsed {
  [key: string]: GisogdFeatureCollectionWrapper
}

export interface GisWfsLayersIdsWithPossibleWfsFeatures {
  [key: string]: unknown
}

export interface BuildingFeature {
  type: 'Feature',
  geometry:
  {
    type: "Point";
    coordinates: [string, string];//number, number
  },
  properties: {
    [key: string]: unknown
  },
  ot: "Point"//todo - use from config
}

export interface GisogdFeature {
  type: 'Feature',
  id: string,
  geometry:
  {
    type: "Point";
    coordinates: [number, number];
  }
  |
  {
    type: "MultiPoint";
    coordinates: [number, number][];
  }
  |
  {
    type: "LineString";
    coordinates: [number, number][]
  }
  |
  {
    type: "MultiLineString";
    coordinates: [number, number][][];
  }
  |
  {
    type: "Polygon";
    coordinates: [number, number][][];
  }
  |
  {
    type: "MultiPolygon";
    coordinates: [number, number][][][];
  },
  geometry_name: string,
  properties: object
}

export interface BuildingFeatureFromGis {
  _id: object,
}

export interface FeatureToUpdateInGis {
  _id: object,//new ObjectId("63491659862b350a5ab09e40")//unknown
  properties: {
    gisogdgemssyncfeatureid: string
    gisogdgemssyncfeaturegeometryname: string
    [key: string]: unknown// | symbol | number//странно что тут нельзя вставить boolean, null, undefined 
  },
  geometry:
  {
    type: "Point";
    coordinates: [number, number];
  }
  |
  {
    type: "MultiLineString";
    coordinates: [number, number][][];
  }
  |
  {
    type: "MultiPolygon";
    coordinates: [number, number][][][];
  }
  type: "Feature" | null,
  ot: GisGeometryType
}

export interface Layer {
  _id: string;
  props: {
    description: string | null | undefined,
    // displayName: 'Полигоны по городу',
    // editable: true,
    // visible: false,
    // public: true,
    // modules: [],
    // defaultSettings: [Object],
    geometryTypes: GeometryTypeHandle[],
    // featuresCount: 6,
    // lastFeatureUpdate: '2021-04-08T14:01:05.702Z',
    // accessRules: [Object],
    // serviceName: 'dms-features',
    // defaultStyle: [Object]
  }
}

export interface GeometryTypeHandle {
  id: string,
  name: string,
  geometryType: GisGeometryType,
  propertiesSchema: {
    fields: {
      [key: string]: {
        showInPopup: boolean,
        showInTable: boolean,
      }
    }
  }
}

export interface FeatureFromGisogdToCreateInGis {
  type: 'Feature',
  geometry:
  {
    type: "Point";
    coordinates: [number, number];
  }
  |
  {
    type: "MultiLineString";
    coordinates: [number, number][][]
  }
  |
  {
    type: "MultiPolygon";
    coordinates: [number, number][][][];
  },
  properties: {
    gisogdgemssyncfeatureid: string
    gisogdgemssyncfeaturegeometryname: string
    [key: string]: unknown// | symbol | number//странно что тут нельзя вставить boolean, null, undefined
  },
  ot: GisGeometryType
}