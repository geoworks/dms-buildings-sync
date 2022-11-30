import fetch from 'node-fetch';
import options from '../../deql-ms-server/tools/options';
const { config } = options;

let getBuildingsJson = async (): Promise<unknown> => {
  try {
    let req = await fetch(config.buildings.mainLink, {
      method: 'GET',
      headers: {},
    });
    if (req.status !== 200) {
      let message = await req.text();
      throw new Error(message || 'req.status !== 200');
    } else {
      let data: unknown = await req.json();
      console.log('data', data);
      return data
    }
  }
  catch (e) {
    e.message = 'getBuildingsJson error: ' + e.message
    throw e
  }
};
export default getBuildingsJson;