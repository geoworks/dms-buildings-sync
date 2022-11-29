import GraphQLJSON from 'graphql-type-json';
// import { withFilter } from 'graphql-subscriptions';
import { withFilter } from './../../deql-ms-server/tools/graphql/utils';
import { cloneDeep, get as getVal, set as setVal } from 'lodash';


export const getServiceName = service => {
  return Object.keys(service)[0];
};

const defaultGuest = {
  id: 0,
  isElevated: false,
  login: 'guest',
  userName: 'guest',
  roles: [],
};

var t = 0;

export default pubsub => ({
  JSON: GraphQLJSON,
  Query: {
    SessionInfo: async (
      users,
      args,
      { db, req, session, sb, sessionID }
    ) => {
      console.log('SessionInfo');
      const guest = cloneDeep(defaultGuest);
      if (
        !(
          getVal(session, 'isElevated', false) === true &&
          getVal(session, 'user.id', 0) > 0
        )
      ) {
        if (session === undefined) {
          session = {};
        }
        session.isElevated = false;
        session.sessionID = sessionID;
        try {
          const role = await db.Roles.findOne({
            include: [
              {
                model: db.Rules,
              },
            ],
            where: {
              name: 'guest',
            },
          });
          if (role) {
            const roles = {
              id: role.id, //<-- ??????
              name: role.name,
              rules: role.Rules.map(r => {
                return r.name;
              }),
            };
            setVal(guest, 'roles[0]', roles);
          }
        } catch (e) {
          console.error(
            'Ошибка поиска роли' + (e && e.message) ? e.message : null
          );
        }
        session.user = cloneDeep(guest);
        return session.user;
      } else {
        // paranoid checking for logouted users
        if (session.isElevated !== session.user.isElevated) {
          session.isElevated = session.user.isElevated;
        }
        try {
          const authType = sb.getType('auth');
          if (
            authType &&
            authType.hasOwnProperty(getServiceName(authType))
          ) {
            await authType[
              getServiceName(authType)
            ].mutation.getUpdateSession(
              {
                sessionId: session.sessionID,
              },
              '',
              { context: { sessionID: session.sessionID } }
            );
            return session.user;
          }
        } catch (err) {
          console.error(
            `Query.SessionInfo sb.auth.sessionUpdate err: ${err.message}`
          );
          return session.user;
        }
      }
    },
  },
  Subscription: {
    sessionInfoChanged: {
      subscribe: withFilter(
        (e, p, c) => {
          return pubsub.asyncIterator('SESSION_INFO_CHANGED');
        },
        (payload, variables, context) => {
          console.log(
            'sessionInfoChanged subscribed!',
            payload,
            variables,
            context
          );

          return payload.sessionID === context.sessionID;
        }
      ),
    },
  },
});
