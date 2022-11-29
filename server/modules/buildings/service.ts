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
if (!config.gis.projectId) {
  throw new Error('Пожалуйста укажите config.gis.projectId(как gis_projectId) в enviroment приложения');
}
if (!config.gis.syncLayersPrefix) {
  throw new Error('Пожалуйста укажите config.gis.syncLayersPrefix(как gis_syncLayersPrefix) в enviroment приложения');
}
if (!config.gis.http) {
  throw new Error('Пожалуйста укажите config.gis.http(как gis_http) в enviroment приложения');
}
if (!(config.gis.http === 'http' || config.gis.http === 'https')) {
  throw new Error('Пожалуйста config.gis.http(как gis_http) должен быть равен http или https');
}
if (!config.gisogdGems.redirectHost) {
  throw new Error('Пожалуйста укажите config.gisogdGems.redirectHost(как gisogdGems_redirectHost) в enviroment приложения');
}
if (!config.gisogdGems.redirectPort) {
  throw new Error('Пожалуйста укажите config.gisogdGems.redirectPort(как gisogdGems_redirectPort) в enviroment приложения');
}
if (!config.gisogdGems.host) {
  throw new Error('Пожалуйста укажите config.gisogdGems.host(как gisogdGems_host) в enviroment приложения');
}
if (!config.gisogdGems.isNeedSpecifyPort) {
  throw new Error('Пожалуйста укажите config.gisogdGems.isNeedSpecifyPort(как gisogdGems_isNeedSpecifyPort) в enviroment приложения');
}
if (typeof config.gisogdGems.isNeedSpecifyPort !== 'boolean') {
  throw new Error('Пожалуйста укажите config.gisogdGems.isNeedSpecifyPort(как gisogdGems_isNeedSpecifyPort) в значении либо true либо false');
}
if (!config.gisogdGems.port) {
  throw new Error('Пожалуйста укажите config.gisogdGems.port(как gisogdGems_port) в enviroment приложения');
}
if (!config.gisogdGems.username) {
  throw new Error('Пожалуйста укажите config.gisogdGems.username(как gisogdGems_username) в enviroment приложения');
}
if (!config.gisogdGems.password) {
  throw new Error('Пожалуйста укажите config.gisogdGems.password(как gisogdGems_password) в enviroment приложения');
}
if (!config.gisogdGems.clientId) {
  throw new Error('Пожалуйста укажите config.gisogdGems.clientId(как gisogdGems_clientId) в enviroment приложения');
}
if (!config.gisogdGems.clientSecret) {
  throw new Error('Пожалуйста укажите config.gisogdGems.clientSecret(как gisogdGems_clientSecret) в enviroment приложения');
}
if (!config.gisogdGems.projectAlias) {
  throw new Error('Пожалуйста укажите config.gisogdGems.projectAlias(как gisogdGems_projectAlias) в enviroment приложения');
}
if (!config.gisogdGems.scope) {
  throw new Error('Пожалуйста укажите config.gisogdGems.scope(как gisogdGems_scope) в enviroment приложения');
}
if (!config.gisogdGems.layersIds) {
  throw new Error('Пожалуйста укажите config.gisogdGems.layersIds(как gisogdGems_layersIds) в enviroment приложения');
}

serviceWrapper().catch((e) => {
  console.error(e);
  process.exit(1);
});