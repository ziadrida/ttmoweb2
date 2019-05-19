import gql from 'graphql-tag';
//import postFragment from '../../post/fragment/post';

//console.log("in grapphql category fraqment category.js")
// user {
//   name
// }
const categoryFragment = gql`
fragment categoryFragment on Category {
  _id
  category_name
  category_name_ar
  personal_allowed
  customs
  tax_aqaba
  tax_amm
  margin_amm
  margin_aqaba
  special_tax
  us_tax
  cap_aqaba
  cap_amm
  min_side_length
  keywords
  min_lonng_side
}
`;

// posts {
//   ...postFragment
// }
// }
// ${postFragment}
export default categoryFragment;
