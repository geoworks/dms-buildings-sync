import serviceWrapper from './serviceWrapper';
import options from '../../deql-ms-server/tools/options';
const { config } = options;

if (!config.gis.login) {
  throw new Error('Пожалуйста укажите config.gis.login(как gis_login) в enviroment приложения');
}
if (!config.gis.password) {
  throw new Error('Пожалуйста укажите config.gis.password(как gis_password) в enviroment приложения');
}
if (!config.gis.host) {
  throw new Error('Пожалуйста укажите config.gis.host(как gis_host) в enviroment приложения');
}
if (!config.gis.port) {
  throw new Error('Пожалуйста укажите config.gis.port(как gis_port) в enviroment приложения');
}
if (!config.gis.layerSyncPeriod) {
  throw new Error('Пожалуйста укажите config.gis.layerSyncPeriod(как gis_layerSyncPeriod) в enviroment приложения');
}
if (config.gis.layerSyncPeriod < 30000) {
  throw new Error('Пожалуйста укажите config.gis.layerSyncPeriod(как gis_layerSyncPeriod) больше чем 30сек. Меньшего времени возможно будет недостаточно для итерации синхронизации');
}
if (!config.gis.layerId) {
  throw new Error('Пожалуйста укажите config.gis.layerId(как gis_layerId) в enviroment приложения');
}

serviceWrapper().catch((e) => {
  console.error(e);
  process.exit(1);
});