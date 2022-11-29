import React from 'react';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import has from 'lodash/has';
import Transliterate from 'transliterate';

export const defaultMapCenter = [56.1153, 47.1955] as const; //[56.135203, 47.239894];
export const defaultMapZoom = 11;
export const RedStar = () => <span style={{ color: 'red' }}>*</span>;
export const Aux = ({ children }) => children;
export const isAdminModule = (path = '') =>
  typeof path === 'string' &&
    path.split('/').indexOf('administration') !== -1
    ? true
    : false;
/**
 * checks if data is array and it's not empty
 * @param {Array} data
 * @returns { Boolean }
 */
export const isNotEmptyArray = data => {
  if (data && data instanceof Array && data.length) {
    return true;
  } else {
    return false;
  }
};

/**
 * checks if data is object and it's not empty
 * @param {Array} someArray
 * @returns { Boolean }
 */
export const getObjectValue = (data, path, defaultValue = null) => {
  if (data && data instanceof Object && has(data, path)) {
    return get(data, path, defaultValue);
  } else {
    return defaultValue;
  }
};

export const getAdminRole = roles => {
  let admin = null;
  let system = null;
  roles.forEach(role => {
    if (role === 'system') {
      system = role;
    } else if (role === 'administrator') {
      admin = role;
    }
  });

  return system ? system : admin ? admin : null;
};

// check if user has rule for showing search component
export const searchRuleInRoles = (roles = [], rule = null) => {
  let result = false;
  if (Array.isArray(roles) && roles.length) {
    result = roles.some(item => {
      return Array.isArray(item.rules) && item.rules.indexOf(rule) !== -1;
    });
  }
  return result;
};

/**
 * метод готовит данные для Трансфер компонента
 * @param { Array<Object> } data
 * @param { string } path
 * @param { string } key
 * @return { Array<Object> }
 */
export const prepareTransferData = (data, path, key) => {
  if (Array.isArray(data) && data.length) {
    return data.map(item => {
      const id = String(item[key]);
      return {
        key: id,
        title: get(item, path, id),
      };
    });
  } else {
    return [];
  }
};

/**
 * transliterates input string and removes backspaces
 * @param { string } str
 * @returns { string }
 */
export const transliterateString = (str = '') => {
  return Transliterate(
    (str || '')
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/\./g, '|')
  );
};

/* creates layer.props object from form data */
export const constructLayerProps = ({
  cases,
  features,
  modules,
  props,
  properties,
  values,
}) => {
  if (!props) {
    props = {};
  }
  props.description = values.description;
  props.displayName = values.displayName;
  props.editable = values.editable;
  props.visible = values.visible;
  props.public = values.public;

  if (values.link) {
    props.link = values.link;
  }
  if (values.limit) {
    props.limit = values.limit;
  }
  if (values.zMax) {
    props.zMax = values.zMax;
  }
  props.modules = modules;
  /* prepare defaultSettings block */
  const defaultSettings = {
    visible: true,
    filter: null,
    isCluster: values.isCluster,
    clusterizationLevel: values.clusterizationLevel,
    opacity: values.opacity,
    orderWeight: values.orderWeight,
  };
  /* add defaultSettings to result object */
  props.defaultSettings = { ...defaultSettings };
  /* prepares geometry objects of the layer */
  let geometryTypes = [];
  if (Object.keys(features).length) {
    Object.keys(features).forEach(item => {
      const featureId = item.substr(0, 4) === 'new-' ? item.substr(4) : item;
      let tmpGT = cloneDeep(features[item]);
      tmpGT.id = featureId;
      /* prepares main params of the geometry object */
      let gtParams = {
        id: featureId,
        name: tmpGT.name,
        geometryType: tmpGT.geometryType,
      };
      /* prepares properties of thegeometry object */
      let props = {
        propertiesSchema: {
          fields: {},
        },
      };

      if (Object.keys(properties).length) {
        Object.keys(properties).forEach(prop => {
          if (prop === item) {
            props.propertiesSchema.fields = properties[item];
          }
        });
      }

      Object.keys(props.propertiesSchema.fields).forEach(p => {
        if (p.substr(0, 4) === 'new-') {
          props.propertiesSchema.fields[p.substr(4)] = cloneDeep(
            props.propertiesSchema.fields[p]
          );
          delete props.propertiesSchema.fields[p];
        }
      });

      let featureCases = {};
      /* structure of newCases
       *  {
       *   featureId: {
       *     simpleTypes: {
       *       propertyId: {
       *         caseId: { }
       *       }
       *     },
       *     simpleFunc: {
       *       propertyId: {
       *         caseId: { }
       *       }
       *     }
       *   }
       * }
       */

      if (
        cases &&
        Object.keys(cases).length &&
        cases[item] &&
        Object.keys(cases[item]).length
      ) {
        const caseTypes = cloneDeep(cases[item]);
        Object.keys(caseTypes).forEach(type => {
          featureCases[type] = cloneDeep(caseTypes[type]);
          if (Object.keys(featureCases[type]).length) {
            Object.keys(featureCases[type]).forEach(c => {
              if (c.substr(0, 4) === 'new-') {
                featureCases[type][c.substr(4)] = cloneDeep(
                  featureCases[type][c]
                );
                delete featureCases[type][c];
              }
            });
          }
        });
      }
      /* remove copied params */
      delete tmpGT.name;
      delete tmpGT.geometryType;
      /* prepare styles of geometry object */
      let gtStyle = {
        style: {
          defaultStyle: tmpGT,
          cases: featureCases,
        },
      };

      /* merge params and styles to one object */
      const gt = { ...gtParams, ...gtStyle, ...props };
      geometryTypes.push(gt);
    });
  }
  /* add geometry objects array to result object */
  props.geometryTypes = geometryTypes;
  return props;
};

export const prepareCatalogsTransferBlockData = data => {
  let targetKeys = [];
  const layerCatalogs = getObjectValue(data, 'catalogs');
  if (isNotEmptyArray(layerCatalogs)) {
    layerCatalogs.forEach(item => {
      if (item !== 'modules') {
        targetKeys.push(item);
      }
    });
  }
  return targetKeys;
};

export const prepareModulesTransferBlockData = data => {
  let targetKeys = [];
  if (isNotEmptyArray(data)) {
    const layerModules = data.props.modules ? data.props.modules : [];
    if (isNotEmptyArray(layerModules)) {
      layerModules.forEach(item => {
        targetKeys.push(item);
      });
    }
  }
  return targetKeys;
};
