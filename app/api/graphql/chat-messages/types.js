// graphql type definition and query definition

import { gql } from 'apollo-server-express'


//const typeDefs = `
const types = gql`

  type ChatMessages {
    _id: ID
    userId: String
    first_name: String
    last_name: String
    name: String
    gender: String
    city: String
    messageText: String
    messageId: String
    messageAttachments: String
    timestamp: String
    userDateCreated: String
    dateCreated: String
  }

  type Query {
    getChatMessages(
              username: String,
              userId: String,
              dateFrom: String,
              dateTo: String,
              search: String): [ChatMessages]

  }

`;


export default types;
