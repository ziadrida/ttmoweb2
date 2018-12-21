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
    date_created: DateTime
    last_updated: DateTime
    notes: String
    message: String
  }

type PackageTracking {
  _id: String
  carrier: String
  box_id: String
  created_by: String
  date_received: DateTime
  date_created: DateTime
  last_updated: DateTime
  ship_date: String
  time_in_transit_from: Int
  time_in_transit_to: Int
  updated_by: String
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
    carrier: String
    notes: String
  }

 type Query {
        getVendorTracking(_id: Float!): VendorTracking
        getPackageTracking(_id: String!): PackageTracking

  }
  type Mutation {
    # create vendor purchase.
    createVendorTracking (input: VendorTrackingInput!): VendorTracking
  }
`;

//  user: User
export default types;
