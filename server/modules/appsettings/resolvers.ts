import GraphQLJSON from 'graphql-type-json';
import defaultAppSettings from './defaultAppSettings';

export default pubsub => ({
  JSON: GraphQLJSON,
  Query: {
    AppSettings: async (_, args, { db }) => {
      try {
        const appSettings = await db.CatalogDocs.findAll({
          where: { CatalogName: 'settings' },
        });
        if (!appSettings || !appSettings.length) {
          return defaultAppSettings;
        }
        return appSettings.reduce((p, v) => {
          p[v.properties.settingsname] = v.properties.val;
          return p;
        }, defaultAppSettings);
      } catch (err) {
        console.error(err.message);
        return defaultAppSettings;
      }
    },
  },
});
