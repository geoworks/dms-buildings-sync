import { getDmsName, getDmsHost } from './deql-ms-server/tools/utils/index';
export default {
  port: '4444',
  projectName: 'dms-template' + getDmsName(),
  host: getDmsHost(),
  restartAppTimeout: 5000,
  graphql: {
    engineApiKey: 'service:deql-ms-server:4bBKVv14mLq7dWyaQeqfjA',
    useEngine: false,
  },
  redis: {
    host: getDmsHost(),
    port: 32768,
    password: 'mapcam-redispass',
  },
  mongodb: {
    options: {
      host: getDmsHost(),
      port: 27020,
    },
    username: 'vsweb',
    password: 'mapcam-vsweb-mongodbpass',
    dbName: 'admin',
  },
  cookieMaxAge: '86400000',
  // project_title: 'ГИС',
  NODE_ENV: 'development',
  withClient: true,
  standAloneMode: false, // если true, то нужно указать loggerConnections, иначе логи не будут отправляться в dms-logger.
  logger: {
    turnOn: true, // если логгер выключен то не будет отправлять данные на сервис dms-logger.
    // connections: {
    // настройки логгера будут браться отсюда, если standAloneMode true.
    host: getDmsHost(),
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
