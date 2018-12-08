// quotation graphql
// import resolvers for type, query and mutations
import PurchaseOrder from './type-resolver';
import Query from './query';
// const Mutation = require('./mutation');

const resolvers = {
  PurchaseOrder, //  resolvers for types inside PurchaseOrder
  Query,
  // Mutation,
};

export default resolvers;
