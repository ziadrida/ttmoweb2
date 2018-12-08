// quotation graphql
// import resolvers for type, query and mutations
import VendorPurchase from './type-resolver';
import Query from './query';
import Mutation from './mutation'
// const Mutation = require('./mutation');

const resolvers = {
  VendorPurchase,
  Query,
  Mutation,
};

export default resolvers;
