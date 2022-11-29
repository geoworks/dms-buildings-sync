import options from '../../../deql-ms-server/tools/options';
const { config } = options;

export function getAddress() {
  if (config.gisogdGems.isNeedSpecifyPort === true) {
    return config.gisogdGems.host + ':' + config.gisogdGems.port
  }
  else {
    return config.gisogdGems.host;
  }
};

export function getEncodedFullAddress() {
  if (config.gisogdGems.isNeedSpecifyPort === true) {
    return encodeURIComponent(config.gisogdGems.host + ':' + config.gisogdGems.port)
  }
  else {
    return encodeURIComponent(config.gisogdGems.host);
  }
};

export function getEncodedSeparatelyAddress() {
  if (config.gisogdGems.isNeedSpecifyPort === true) {
    return encodeURIComponent(config.gisogdGems.host) + ':' + encodeURIComponent(config.gisogdGems.port)
  }
  else {
    return encodeURIComponent(config.gisogdGems.host);
  }
};