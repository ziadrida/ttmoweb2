// quotation graphql
// import resolvers for type, query and mutations
import VendorTracking from './type-resolver';
import Query from './query';
import Mutation from './mutation'
// const Mutation = require('./mutation');

const resolvers = {
  VendorTracking,
  Query,
  Mutation,
};

export default resolvers;
