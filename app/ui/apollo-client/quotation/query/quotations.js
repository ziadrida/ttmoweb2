import gql from 'graphql-tag';
import quotationFragment from '../fragment/quotation';

const quotationsQuery = gql `

  query quotation ($quoteNo: Int, $search: String) {
  getQuotation(quote_no: $quoteNo, search: $search) {
    ...quotationFragment
  }
}
  ${quotationFragment}
`;

export default quotationsQuery;
