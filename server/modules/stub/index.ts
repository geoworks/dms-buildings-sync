import typeDefs from './type-defs';
import resolvers from './resolvers';
import router from './router';
export default {
  moduleName: 'stub',
  router,
  graphql: {
    typeDefs,
    resolvers,
  },
};
