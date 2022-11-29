// import options from '../../../deql-ms-server/tools/options';
// const { config } = options;

// export let getGisPlace = (): string => {
//   try {
//     if (config.gis.http === 'http') {
//       return config.gis.host + ':' + config.gis.port
//     }
//     else if (config.gis.http === 'https') {
//       return config.gis.host
//     }
//     else {
//       throw new Error('config.gis.http !== http && config.gis.http !== https')
//     }
//   }
//   catch (e) {
//     e.message = 'getGisPlace error: ' + e.message;
//     throw e
//   }
// };

// export default getGisPlace;