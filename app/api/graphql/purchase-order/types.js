// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type PurchaseOrder {
    _id: String!
    username: String
    userId: String
    title: String
    link:  String
    trc: Boolean
    destination: String
    order_type: String
    po_date:String
    deadline: String
    company: String
    real_name: String
    user_title: String
    address: String
    phone_no: String
    email: String
    sales_person: String
    communication_method: String
    total_amount: Float
    first_payment: Float
    payment_method: String
    final_payment:Float
    category: String
    source: String
    price: Float
    sale_price:Float
    po_qty: Int
    delivered_qty: Int
    warranty: String
    options: String
    membership_amount: Float
    vip: Boolean
    closed: Boolean
    chargable_wt: Float
    customer_delivery_date: String
    amm_showroom_arrival_date: String
    aq_showroom_arrival_date: String
    amm_customs_arrival_date: String
    aq_customs_arrival_date: String
    orign_facility_arrival_date: String
    status: String
    notes: String
    vendorPurchase: [VendorPurchase]
  }

  type Query {
        getPurchaseOrder(poNo: String!): PurchaseOrder
        getNotPurchased(poNo: String, search: String): [PurchaseOrder]
        vendorPurchases: [VendorPurchase]
  }


`;

  // type Mutation {
  //   # create purchase order.
  //   #createPurchaseOrder (input: PurchaseOrder!): PurchaseOrder
  // }

export default types;
