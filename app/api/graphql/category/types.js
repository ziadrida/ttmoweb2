// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type Category {
    _id: ID
    category_name: String
    category_name_ar: String
    customs: Float
    tax_aqaba: Float
    tax_amm: Float
    margin_amm: Float
    margin_aqaba: Float
    special_tax: Float
    us_tax: Float
    cap_aqaba: Float
    cap_amm: Float
    min_side_length: Float
    keywords: String
    min_lonng_side: Float

  }

  input CategoryInput {
    _id: ID
    category_name: String
    category_name_ar: String
    customs: Float
    tax_aqaba: Float
    tax_amm: Float
    margin_amm: Float
    margin_aqaba: Float
    special_tax: Float
    us_tax: Float
    cap_aqaba: Float
    cap_amm: Float
    min_side_length: Float
    keywords: String
    min_lonng_side: Float

  }

  type Query {

        getCategories(category_name: String, search: String, searchField: String): [Category]
  }

  type Mutation {
    updateCategory (input: CategoryInput!): Category
  }

`;



export default types;
