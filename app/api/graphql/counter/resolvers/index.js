// quotation graphql
// import resolvers for type, query and mutations
import Counter from './type-resolver';
//import Query from './query';
import Mutation from './mutation'
// const Mutation = require('./mutation');

const resolvers = {
  Counter,
//  Query,
   Mutation,
};

export default resolvers;
