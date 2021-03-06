// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`
type User {
  _id: ID!
  name: String
  address:  String
  locale: String
  city: String
  vip: Boolean
  phone_no: String
  tax_exempt: Boolean
  company: String
  user_title: String
  real_name: String
  email: String
  role: String
  location: String
  order_status_subscription: Boolean
  price_drop_subscription: Boolean
  date_created: String

}

  type Query {
        #getUsers(userId: String): [User]
          getUsers(username: String,userId:String, search: String, searchField: String): [User]
  }

`;
export default types;
//  getMessages(userId: String): [UserMessages]
// messages: [UserMessages]
//   type Messages {
//     messageText: String,
//     messageAttachments: [MessageAttachments],
//     timestamp: String,
//     dateCretaed: String
//   }
//
//   type MessageAttachments {
//     title: String,
//     url: String,
//     type: String,
//     payload: String
//   }
