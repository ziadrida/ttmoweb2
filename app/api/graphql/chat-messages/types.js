// graphql type definition and query definition

import { gql } from 'apollo-server-express'


//const typeDefs = `
const types = gql`

  type ChatMessages {
    _id: ID
    userId: String
    senderId: String
    recipientId: String
    seq: Int
    is_echo: Boolean
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
              search: String,
              searchField:String): [ChatMessages]

  }

`;


export default types;
