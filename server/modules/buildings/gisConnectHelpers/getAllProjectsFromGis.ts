// import fetch from 'node-fetch';
// import IsAuthorizedInGis from './isAuthorizedInGis';//getElevated
// import GisAuth from './gisAuth';
// import { SessionObject, LastAuthUpdateObject } from './../interfaces';
// import getGisPlace from './getGisPlace';
// import { hasOwnPropertyFromUnknown } from '../../../deql-ms-server/tools/utils';
// import options from '../../../deql-ms-server/tools/options';
// const { config } = options;

// let getAllProjectsFromGis = async (
//   lastAuthUpdateObject: LastAuthUpdateObject,
//   sessionObject: SessionObject,
// ) => {
//   try {
//     let currentDate = +new Date();
//     if (currentDate > lastAuthUpdateObject.lastAuthUpdate + 1000 * 60 * 5) {
//       let isElevatedAndSession = await IsAuthorizedInGis(sessionObject);//может тут дополнительную логику с сессией нужно учитывать?
//       if (isElevatedAndSession.session !== null) {
//         sessionObject.session = isElevatedAndSession.session;
//       }
//       if (!isElevatedAndSession.isElevated) {
//         await GisAuth(sessionObject);
//       }
//       lastAuthUpdateObject.lastAuthUpdate = currentDate;
//     }
//     let body = [
//       {
//         "operationName": null,
//         "variables": {
//           "params": {
//             "offset": 0,
//             "limit": 2000
//           }
//         },
//         "query": "query ($params: JSON) {\n  allProjects(params: $params) {\n   projects {\n      description\n      displayName\n      id\n    name\n  }}\n}\n"
//       }
//     ];
//     let req = await fetch(config.gis.http + '://' + getGisPlace() + '/graphql', {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//         cookie: sessionObject.session,
//         'accept': '*/*',
//         'accept-encoding': 'gzip, deflate, br',
//         'accept-language': 'ru-RU,ru;q=0.8',
//         'content-length': '446',
//         'origin': 'https://geo.cap.ru',
//         'referer': 'https://geo.cap.ru/administration/projects',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'same-origin',
//         'sec-gpc': '1',
//         'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
//       },
//       body: JSON.stringify(body),
//     });
//     if (req.status !== 200) {
//       let message = await req.text();
//       throw new Error(message || 'req.status !== 200');
//     } else {
//       let data: unknown = await req.json();
//       if (
//         typeof data === 'object' &&
//         data !== null &&
//         hasOwnPropertyFromUnknown(data, 'errors') &&
//         data.errors &&
//         data.errors[0]
//       ) {
//         throw new Error(
//           data.errors[0].message || 'data.errors && data.errors[0] === true'
//         );
//       } else {
//         if (
//           Array.isArray(data) &&
//           Array.length &&
//           typeof data[0] === 'object' &&
//           data[0] !== null &&
//           hasOwnPropertyFromUnknown(data[0], 'data') &&
//           typeof data[0].data === 'object' &&
//           data[0].data !== null &&
//           hasOwnPropertyFromUnknown(data[0].data, 'allProjects') &&
//           typeof data[0].data.allProjects === 'object' &&
//           data[0].data.allProjects !== null &&
//           hasOwnPropertyFromUnknown(data[0].data.allProjects, 'projects') &&
//           Array.isArray(data[0].data.allProjects.projects)
//         ) {
//           let ids: {
//             id: string,
//             name: string,
//           }[] = [];
//           data[0].data.allProjects.projects.forEach((e: unknown) => {
//             if (
//               typeof e === 'object' &&
//               e !== null &&
//               hasOwnPropertyFromUnknown(e, 'id') &&
//               typeof e.id === 'number' &&
//               hasOwnPropertyFromUnknown(e, 'name') &&
//               typeof e.name === 'string'
//             ) {
//               ids.push({
//                 id: e.id + '',
//                 name: e.name,
//               });
//             }
//             else {
//               throw new Error('element of data[0].data.allProjects.projects - parsing failed' + JSON.stringify(e));
//             }
//           });
//           return ids;
//         }
//         else {
//           throw new Error('data[0].data.allProjects.projects parsing failed');
//         }
//       }
//     }
//   }
//   catch (e) {
//     e.message = 'getAllProjectsFromGis error: ' + e.message
//     throw e
//   }
// };
// export default getAllProjectsFromGis;