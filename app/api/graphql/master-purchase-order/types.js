// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type MasterPurchaseOrder {
    _id: String!
    username: String
    userId: String

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
    payment_method: String

    first_payment: Float
    first_payment_date: DateTime

    final_payment:Float
    final_payment_date: DateTime
    discount: Float

    membership_amount: Float
    vip: Boolean
    closed: Boolean

    status: String
    notes: String
    message: String
    date_created: DateTime
    created_by: String
    last_updated: DateTime
    updated_by: String
  }

  input UpdateMasterPurchaseOrderInput {
    po_no: String
    notes: String
    status: String

    first_payment: Float
    first_payment_date: DateTime

    final_payment:Float
    final_payment_date: DateTime

    senderID: String
    delivered:Int
    customer_delivery_date: String

  }

  type Query {
        geteMasterPurchaseOrder(poNo: String!): MasterPurchaseOrder
  }

  type Mutation {
    updateMasterPurchaseOrder (input: UpdateMasterPurchaseOrderInput!): MasterPurchaseOrder
  }

`;



export default types;
