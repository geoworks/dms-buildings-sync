import fetch from 'node-fetch';
import crypto from 'crypto';
import { SessionObject } from './../interfaces';
import getGisPlace from './getGisPlace';
import options from './../../../deql-ms-server/tools/options';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
const { config } = options;

let GisAuth = async (sessionObject: SessionObject) => {
  try {
    let password = crypto.createHash('md5').update(config.gis.password).digest('hex');
    let req = await fetch(config.gis.http + '://' + getGisPlace() + '/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionObject.session,
      },
      body: JSON.stringify({
        operationName: 'login',
        variables: { login: config.gis.login, password },
        query: `mutation login($login: String!, $password: String!) {
              login(login: $login, password: $password) { 
                login
              }
            }`,
      }),
    });
    if (req.status !== 200) {
      let message = await req.text();
      throw new Error(message || 'req.status !== 200');
    } else {
      let data: unknown = await req.json();
      if (
        typeof data === 'object' &&
        data !== null &&
        hasOwnPropertyFromUnknown(data, 'errors') &&
        data.errors &&//нужна ли тут проверка?
        data.errors[0]
      ) {
        throw new Error(
          data.errors[0].message || 'Произошла непредвиденная ошибка'
        );
      } else {
        let cookie = req.headers.get('set-cookie');
        if (cookie) {
          sessionObject.session = cookie;
        }
      }
    }
  }
  catch (e) {
    throw new Error('GisAuth error: ' + e)
  }
};
export default GisAuth;