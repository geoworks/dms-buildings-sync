import typeDefs from './type-defs';
import resolvers from './resolvers';

export default {
  moduleName: 'appsettings',
  graphql: {
    typeDefs,
    resolvers,
  },
};
