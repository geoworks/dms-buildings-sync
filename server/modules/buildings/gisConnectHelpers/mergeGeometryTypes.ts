import {
  GeometryTypeHandle,
  GisGeometryTypeLayer,
} from '../interfaces';

let mergeGeometryTypes = (
  gisGeometryTypeLayers: GisGeometryTypeLayer[],
  gisLayerGeometryTypeHandleArray: GeometryTypeHandle[]
): GisGeometryTypeLayer[] => {
  try {
    let gisGeometryTypeLayersMerged: GisGeometryTypeLayer[] = [];
    gisGeometryTypeLayers.forEach(e => {
      let propertiesSchemaFieldsEntriesElementToMerge = Object.entries(e.propertiesSchema.fields);
      let handle = e;
      for (let i = 0; i < gisLayerGeometryTypeHandleArray.length; i++) {
        if (e.geometryType === gisLayerGeometryTypeHandleArray[i].geometryType) {
          let propertiesSchemaFieldsEntriesElementToCompare = Object.entries(gisLayerGeometryTypeHandleArray[i].propertiesSchema.fields);
          let fields: {
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
          } = {};
          propertiesSchemaFieldsEntriesElementToMerge.forEach(e => {
            let exist: {
              showInPopup: boolean,
              showInTable: boolean,
            } | null
              = null;
            for (let b = 0; b < propertiesSchemaFieldsEntriesElementToCompare.length; b++) {
              if (e[0] === propertiesSchemaFieldsEntriesElementToCompare[b][0]) {
                exist = {
                  showInPopup: propertiesSchemaFieldsEntriesElementToCompare[b][1].showInPopup,
                  showInTable: propertiesSchemaFieldsEntriesElementToCompare[b][1].showInTable,
                };
                break;
              }
            }
            if (exist) {
              fields[e[0]] = {
                description: e[1].description,
                name: e[1].name,
                showInPopup: exist.showInPopup,
                showInTable: exist.showInTable,
                editable: e[1].editable,
                hidden: e[1].hidden,
                propWeight: e[1].propWeight,
                required: e[1].required,
                type: e[1].type,
                options: e[1].options,
                maxLength: e[1].maxLength,
                defaultValue: e[1].defaultValue
              }
            }
            else {
              fields[e[0]] = e[1]
            }
          });
          if (propertiesSchemaFieldsEntriesElementToMerge.length !== Object.entries(fields).length) {
            throw new Error('propertiesSchemaFieldsEntriesElementToMerge.length !== Object.entries(fields).length');
          }
          handle.propertiesSchema.fields = fields
        }
      }
      gisGeometryTypeLayersMerged.push(handle);//but not e
    })
    if (gisGeometryTypeLayersMerged.length !== gisGeometryTypeLayers.length) {
      throw new Error("gisGeometryTypeLayersMerged.length !== gisGeometryTypeLayers.length")
    }
    return gisGeometryTypeLayersMerged
  }
  catch (e) {
    e.message = 'mergeGeometryTypes error: ' + e.message
    throw e
  }
};

export default mergeGeometryTypes;