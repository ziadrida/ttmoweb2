// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type VendorPurchase {
    _id: Float
    po_no: String
    order_no: String
    seller: String
    order_date: String
    delivery_days_from: Int
    delivery_days_to: Int
    purchased_qty: Int
    ship_to_address: String
    price_paid: Float
    part_no: String
    ein: String
    title: String
    link: String
    source: String
    ship_price: Float
    tax: Float
    options: String
    notes: String
    date_created: DateTime
    last_updated: DateTime
#   message is not a DB field
    message: String
  }


  input VendorPurchaseInput {
    _id:Float
    po_no: String
    order_no: String
    seller: String
    order_date: String
    delivery_days_from: Int
    delivery_days_to: Int
    purchased_qty: Int
    ship_to_address: String
    price_paid: Float
    part_no: String
    title: String
    link: String
    source: String
    ship_price: Float
    tax: Float
    notes: String

  }

 type Query {
        getVendorPurchase(_id: Float!): VendorPurchase!

  }
  type Mutation {
    # create vendor purchase.
    createVendorPurchase (input: VendorPurchaseInput!): VendorPurchase
  }
`;

//  user: User
export default types;
