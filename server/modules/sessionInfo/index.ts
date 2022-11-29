import typeDefs from './type-defs';
import resolvers from './resolvers';

export default {
  moduleName: 'appState',
  graphql: {
    typeDefs,
    resolvers,
  },
};
