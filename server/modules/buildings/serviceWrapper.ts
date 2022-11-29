import updateFeaturesLogicWrapper from './updateFeaturesLogicWrapper';
import { SessionObject, LastAuthUpdateObject } from './interfaces';
import { getBearerToken } from '../../utils/dependencies';
import options from '../../deql-ms-server/tools/options';
const { config } = options;

async function serviceWrapper() {
  while (1) {
    try {
      console.log('config.gis', config.gis)
      console.log('config.gisogdGems', config.gisogdGems)
      //нужно для сохранения состояния обьекта при его мутабельной передаче в функции
      let lastAuthUpdateObject: LastAuthUpdateObject = {
        lastAuthUpdate: 0,
      };
      //нужно для сохранения состояния обьекта при его мутабельной передаче в функции
      let sessionObject: SessionObject = {
        session: ''
      };
      let wfsLayersFromConfig = config.gisogdGems.layersIds.split(',');
      wfsLayersFromConfig.forEach(e => {
        if (!(e.startsWith(config.gisogdGems.projectAlias))) {
          throw new Error('one of layersIds - ' + e + ' does not starts with config.gisogdGems.projectAlias(' + config.gisogdGems.projectAlias + '')
        }
      });
      let bearerToken = getBearerToken();
      if (bearerToken !== null) {
        await updateFeaturesLogicWrapper(
          lastAuthUpdateObject,
          sessionObject,
          bearerToken,
          wfsLayersFromConfig,
        );
      }
      else {
        console.log('bearerToken === null on this iteration')
      }
    }
    catch (e) {
      e.message = 'serviceWrapper error: ' + e.message
      throw e
    }
    await new Promise(
      resolve =>
        setTimeout(
          resolve, config.gis.layerSyncPeriod)
    );
  }

}
export default serviceWrapper;
