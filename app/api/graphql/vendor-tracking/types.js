// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type VendorTracking {
    _id: Float
    purchase_id: Float
    po_no: String
    order_no: String
    tracking_no: String
    ship_date: String
    time_in_transit_to: Int
    time_in_transit_from: Int
    shipped_qty: Int
    notes: String
    date_created: DateTime
    last_updated: DateTime
    message: String
  }


  input VendorTrackingInput {
    _id:Float
    purchase_id: Float
    po_no: String
    order_no: String
    tracking_no: String
    ship_date: String
    time_in_transit_to: Int
    time_in_transit_from: Int
    shipped_qty: Int
    notes: String
  }

 type Query {
        getVendorTracking(_id: Float!): VendorTracking!

  }
  type Mutation {
    # create vendor purchase.
    createVendorTracking (input: VendorTrackingInput!): VendorTracking
  }
`;

//  user: User
export default types;
