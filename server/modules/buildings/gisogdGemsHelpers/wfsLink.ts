import { URL } from 'url'
import { XMLParser } from "fast-xml-parser";
import fetch from 'node-fetch';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';

export interface WfsLayer {
  Name: string,
  Title: string,
  //not actually all fields, ignoring others
}

//full WfsLayer example
// {
//   Name: 'batyrevskii:batyrevskii_v_wf_geo_rs_overdue',
//   Title: 'v_wf_geo_rs_overdue',
//   Abstract: '',
//   DefaultSRS: 'urn:x-ogc:def:crs:EPSG:4326',
//   'ows:WGS84BoundingBox': {
//     'ows:LowerCorner': '46.91587939654014 54.89813519774169',
//     'ows:UpperCorner': '47.9532718005453 55.1897075515478'
//   }
// }

const xmlParserInstans = new XMLParser();
export default class WSLLink {
  link: URL
  headers: {
    authorization: string
  }
  constructor(
    link: string,
    headers: {
      authorization: string
    }
  ) {
    this.link = new URL(link)
    this.headers = headers
  }
  async getCapabilites() {
    try {
      let newurl = new URL(this.link.toString())
      newurl.search = '?service=wfs&version=1.1.0&request=GetCapabilities'
      let res = await fetch(newurl.toString(), {
        headers: this.headers
      })
      if (!res.ok) {
        let error = await res.text()
        try {
          let jObj = xmlParserInstans.parse(error);
          error = JSON.stringify(jObj)
        } catch (err) { }
        throw new Error(error)
      }
      let str = await res.text()
      return str
    }
    catch (e) {
      e.message = 'WSLLink getCapabilites error: ' + e.message
      throw e;
    }
  }
  async getLayers() {
    try {
      let txt = await this.getCapabilites()
      let jObj: unknown = xmlParserInstans.parse(txt);
      if (
        typeof jObj === 'object' &&
        jObj !== null &&
        hasOwnPropertyFromUnknown(jObj, 'wfs:WFS_Capabilities') &&
        typeof jObj['wfs:WFS_Capabilities'] == 'object' &&
        jObj['wfs:WFS_Capabilities'] !== null &&
        hasOwnPropertyFromUnknown(jObj['wfs:WFS_Capabilities'], 'FeatureTypeList') &&
        typeof jObj['wfs:WFS_Capabilities'].FeatureTypeList === 'object' &&
        jObj['wfs:WFS_Capabilities'].FeatureTypeList !== null &&
        hasOwnPropertyFromUnknown(jObj['wfs:WFS_Capabilities'].FeatureTypeList, 'FeatureType') &&
        Array.isArray(jObj['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType)
      ) {
        let rawLayers: WfsLayer[] = [];
        jObj['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType.forEach((e: unknown) => {
          if (
            typeof e === 'object' &&
            e !== null &&
            hasOwnPropertyFromUnknown(e, 'Name') &&
            typeof e.Name === 'string' &&
            hasOwnPropertyFromUnknown(e, 'Title') &&
            typeof e.Title === 'string'
          ) {
            rawLayers.push({
              Title: e.Title,
              Name: e.Name,
            });
          }
          else {
            throw new Error('jObj[wfs:WFS_Capabilities].FeatureTypeList.FeatureType check element type failed')
          }
        });
        return rawLayers;
      }
      else {
        throw new Error('jObj[wfs:WFS_Capabilities].FeatureTypeList.FeatureType check type failed')
      }
    }
    catch (e) {
      e.message = 'WSLLink getLayers error: ' + e.message
      throw e;
    }
  }
  async getFeatures(layerId: string) {
    try {
      let newurl = new URL(this.link.toString())
      newurl.search = `?service=wfs&version=1.1.0&request=GetFeature&typeNames=${layerId}&outputFormat=application/json`
      let res = await fetch(newurl.toString(), {
        headers: this.headers
      })
      if (!res.ok) {
        let error = await res.text()
        try {
          let jObj = xmlParserInstans.parse(error);
          error = JSON.stringify(jObj)
        } catch (err) { }
        throw new Error(error)
      }
      let possibleJson: unknown;
      try {
        possibleJson = await res.json();
        //можно добавить потенциальный парсинг xml в случае ошибки
      }
      catch (e) {
        throw new Error('await res.text() failed: ' + e.message)
      }
      return possibleJson
    }
    catch (e) {
      e.message = 'WSLLink getFeatures error: ' + e.message
      throw e
    }
  }
}