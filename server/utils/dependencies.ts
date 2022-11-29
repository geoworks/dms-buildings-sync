import options from './../deql-ms-server/tools/options';
import { getDmsName } from './../deql-ms-server/tools/utils/index';
import { getKeyValue } from './../deql-ms-server/tools/redis';
import serviceSync from './../deql-ms-server/modules/service-sync';

export const dependencies = async function ({ app }) {

  const db = null;
  let serviceProps;
  if (options.config.standAloneMode) {
    serviceProps = { sb: [] };
  } else {
    let defaultServices = [
      {
        serviceName: 'dms-auth' + getDmsName(),
        useSchemaStitching: true,
      },
    ];
    const initiatorConnectionOptions = await getKeyValue('initiator');
    serviceProps = await serviceSync({
      initiatorConnectionOptions,
      defaultServices,
    });
  }
  return { ...{ db }, ...serviceProps };
};
