import fetch from 'node-fetch';
import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
import { SessionObject } from '../interfaces';
// import getGisPlace from './getGisPlace';
import options from '../../../deql-ms-server/tools/options';
const { config } = options;

let IsAuthorizedInGis = async (
  sessionObject: SessionObject,
): Promise<{
  isElevated: boolean,
  session: string | null
}> => {
  try {
    let stringifiedBody = JSON.stringify({
      operationName: null,
      variables: {},
      query: `{
              SessionInfo {
                isElevated
                login
              }
          }`,
    });
    let req = await fetch('http' + '://' + config.gis.host + ':' + config.gis.port + '/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionObject.session,
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru-RU,ru;q=0.8',
        'content-length': stringifiedBody.length + '',
        'origin': 'https://geo.cap.ru',
        'referer': 'https://geo.cap.ru/portal',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      },
      body: stringifiedBody,
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
          data.errors[0].message || 'data.errors && data.errors[0] === true'
        );
      } else {
        if (
          typeof data === 'object' &&
          data !== null &&
          hasOwnPropertyFromUnknown(data, 'data') &&
          typeof data.data === 'object' &&
          data.data !== null &&
          hasOwnPropertyFromUnknown(data.data, 'SessionInfo') &&
          typeof data.data.SessionInfo === 'object' &&
          data.data.SessionInfo !== null &&
          hasOwnPropertyFromUnknown(data.data.SessionInfo, 'isElevated') &&
          typeof data.data.SessionInfo.isElevated === 'boolean'
        ) {
          let cookieHandle: string | null = null;
          let cookie = req.headers.get('set-cookie');
          if (cookie) {
            cookieHandle = cookie;
          }
          return {
            isElevated: data.data.SessionInfo.isElevated,
            session: cookieHandle
          };
        }
        else {
          throw new Error('data parsing failed');
        }
      }
    }
  }
  catch (e) {
    e.message = 'IsAuthorizedInGis error: ' + e.message
    throw e
  }
};
export default IsAuthorizedInGis;