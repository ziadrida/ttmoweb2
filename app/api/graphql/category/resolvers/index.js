// quotation graphql
// import resolvers for type, query and mutations
//import Category from './type-resolver';
import Query from './query';
import Mutation from './mutation';

const resolvers = {
  //PurchaseOrder, //  resolvers for types inside PurchaseOrder
  Query,
  Mutation,
};

export default resolvers;
