// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type Quotation {
    _id: ID
    quote_no: Int
    senderId: String
    user:  User
    sales_person: String

    quotation: QuotationInstance
    date_created: String
    created_by: String
  }

  type QuotationInstance {
    quote_no: Int
    quote_date: String
    price_selection: String
    notes: String

    active: Boolean
    deleted: Boolean
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
      category_info: Category
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

    type QuotationResponse {
      quote_no: String
      message: String
    }

    input QuotationInput {
      quote_no: Int
      quote_date: String
      price_selection: String
      notes: String
      active: Boolean
      deleted: Boolean
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
      item: ItemInput
      prices: PriceOptionsInput
    }

    input ItemInput {
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
        category_info: CategoryInput
        recipentID: String
      }
      input PriceDestInput {
            destination: String
            type: String
            delivery: String
            price: Float
      }

      input PriceOptionsInput  {
            amm_exp: PriceDestInput
            amm_std: PriceDestInput
            aq_std: PriceDestInput

      }
    input UserInput {
      userId: String
      username: String
      phone_no: String
      first_name: String
      last_name: String
    }

    input QuoteInput {
      quote_no: Int
      userInfo: UserInput
      senderId: String

      sales_person: String
      quotation: QuotationInput,
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

  input FBQuoteAction {
    quote_no: Int
    options: String
    senderId: String
    sales_person: String
    text: String
  }

  type ActionResponse {

    status: String
    message: String
  }

  type Mutation {
    updateQuotation (input: QuoteInput!): QuotationResponse
    sendFBQuoteAction (action: String!, input: FBQuoteAction!): ActionResponse
  }

`;

export default types;
