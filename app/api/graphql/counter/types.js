// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type Counter {
    _id: Float
    sequence: Float
  }

 input CounterInput {
   name: String
 }

  type Mutation {
      getNextSeq(counter: CounterInput!): Float!
  }
`;

//  user: User
export default types;
