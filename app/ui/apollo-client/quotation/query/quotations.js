import gql from 'graphql-tag';
import quotationFragment from '../fragment/quotation';

const quotationsQuery = gql `

  query quotation ($quoteNo: Int,$dateFrom:String, $dateTo:String, $search: String) {
  getQuotation(quote_no: $quoteNo,dateFrom:$dateFrom,dateTo:$dateTo, search: $search) {
    ...quotationFragment
  }
}
  ${quotationFragment}
`;

export default quotationsQuery;
