// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type Quotation {
    _id: ID!
    quote_no: Int
    senderId: String
    sales_person: String
    user:  User
    quotation: QuotationInstance
    date_created: String
    created_by: String
  }

  type QuotationInstance {
    quote_no: Int!
    quote_date: String
    price_selection: String
    notes: String

    active: Boolean
    po_no: String
    sales_person: String

    message: String
    reason: String
    ownderId: String
    url: String
    title: String
    thumbnailImage: String
    source: String,
    price: Float
    qty: Float
    shipping: Float
    category: [String]

    weight: Float
    height: Float
    length: Float
    width: Float
    username: String
    chargeableWeight: Float
    final: Boolean
    requestor: String
    item: Item
    prices: PriceOptions
  }

  type Item {
      recipientID: String
      ownderId: String
      url: String
      title: String
      MPN: String
      asin: String
      thumbnailImage: String
      source: String,
      price: Float
      qty: Float
      shipping: Float
      category: [String]
      condition: String
      availability: String,
      weight: Float
      height: Float
      length: Float
      width: Float
      language: String
      username: String
      chargeableWeight: Float
      final: Boolean
      requestor: String
      quote_no: Int
      recipentID: String
    }

    type PriceOptions  {
          amm_exp: PriceDest
          amm_std: PriceDest
          aq_std: PriceDest

    }
    type PriceDest {
          destination: String
          type: String
          delivery: String
          price: Float
    }

  type Query {
        getQuotation(
              quote_no: Int,
              dateFrom:String,
              dateTo:String,
              search: String,
              searchField: String): [Quotation]
        user: User

  }

`;
export default types;
