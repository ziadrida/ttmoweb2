import gql from 'graphql-tag';
//import postFragment from '../../post/fragment/post';

//console.log("in grapphql quotation fraqment quotation.js")
// user {
//   name
// }
const quotationFragment = gql`
fragment quotationFragment on Quotation {
  _id
  quote_no
  senderId
  sales_person

  quotation {
    quote_no
    quote_date
    price_selection
    notes
    final
    active
    po_no
    username
    sales_person
    message
    reason
    item {
      recipientID
      ownderId
      title
      MPN
      asin
      url
      thumbnailImage
      source
      price
      qty
      shipping
      category
      condition
      weight
      height
      length
      width
      language
      username
      chargeableWeight
      final
      requestor
      quote_no
      recipentID

    }
    prices {
      amm_exp {
        destination
        type
        delivery
        price
      }
      amm_std {
        destination
        type
        delivery
        price
      }
      aq_std {
        destination
        type
        delivery
        price
      }

    }
  }
}
`;

// posts {
//   ...postFragment
// }
// }
// ${postFragment}
export default quotationFragment;
