// quotation graphql
// import resolvers for type, query and mutations
import OrderDetails from './type-resolver';
import Query from './query';
// const Mutation = require('./mutation');

const resolvers = {
  OrderDetails,
  Query,
  // Mutation,
};

export default resolvers;
