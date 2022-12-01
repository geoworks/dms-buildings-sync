import updateFeaturesLogicWrapper from './updateFeaturesLogicWrapper';
import { SessionObject, LastAuthUpdateObject } from './interfaces';
import options from '../../deql-ms-server/tools/options';
const { config } = options;

async function serviceWrapper() {
  while (1) {
    try {
      console.log('config', config)
      //нужно для сохранения состояния обьекта при его мутабельной передаче в функции
      let lastAuthUpdateObject: LastAuthUpdateObject = {
        lastAuthUpdate: 0,
      };
      //нужно для сохранения состояния обьекта при его мутабельной передаче в функции
      let sessionObject: SessionObject = {
        session: ''
      };
      await updateFeaturesLogicWrapper(
        lastAuthUpdateObject,
        sessionObject,
      )
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
