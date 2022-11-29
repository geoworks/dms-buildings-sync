import { getDmsName, getDmsHost } from './deql-ms-server/tools/utils/index';
export default {
  port: '5010',
  projectName: 'dms-buildings-sync' + getDmsName(),
  host: getDmsHost(),
  restartAppTimeout: 5000,
  graphql: {
    engineApiKey: 'service:deql-ms-server:4bBKVv14mLq7dWyaQeqfjA',
    useEngine: false,
  },
  redis: {
    host: '110.10.0.212',
    port: 32768,
    password: 'mapcam-redispass',
  },
  mongodb: {
    options: {
      host: '110.10.0.212',
      port: 27020,
    },
    username: 'vsweb',
    password: 'mapcam-vsweb-mongodbpass',
    dbName: 'admin',
  },
  gis: {
    login: 'gisogdsyncbotplan',
    password: 'wygfh2y40fhahgf3804fslbfp9834hfjkbnfds',
    host: '110.10.0.211',//'geo.cap.ru',//'110.10.0.211'
    port: '8888',
    layerSyncPeriod: 30000,// 2592000 //примерно месяц в милисекундах 60×60×24×30
    layerId: '42',
  },
  buildings: {
    mainLink: 'https://api.shichuvashia.ekspa.io/GZHI/webresources/geocap/get',
  },
  cookieMaxAge: '86400000',
  // project_title: 'ГИС',
  NODE_ENV: 'development',
  withClient: true,
  introspectionDisable: false,
  playgroundEnable: true,
  standAloneMode: false, // если true, то нужно указать loggerConnections, иначе логи не будут отправляться в dms-logger.
  logger: {
    turnOn: true, // если логгер выключен то не будет отправлять данные на сервис dms-logger.
    // connections: {
    // настройки логгера будут браться отсюда, если standAloneMode true.
    host: '110.10.0.212',
    port: '8891',
    docker_container_name: 'dms-logger-aivanov',
    // }
  },
  rootApi: "/api",
  maintenance: false,
  nedb: {
    force: false,
    cleaner: {
      num: 2,
      type: "days",
      scheduleJob: "0 0 * * *" // every day
      /*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/
    }
  }
};
