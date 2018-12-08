import React from 'react';
import { compose, setDisplayName } from 'recompose';
import { FormattedMessage as T, injectIntl } from 'react-intl';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withSEO } from '/app/ui/hocs';
import Loading from '/app/ui/components/dumb/loading';
import TextField from '@material-ui/core/TextField';

const GET_DATA = gql`
query quotations {
  getQuotation(quote_no:80000) {
    _id
    quote_no
    senderId
  }
}
`;

const Quotations = () => (
  <div>
  <T id="quotationsHeaderTitle" />
  <QuotationForm onSubmit={this.handleSubmit} />
  <Query query={GET_DATA}>
    {({ data, loading }) => (
      loading
        ? <Loading />
        :
        <div>

         {data.getQuotation.map(quotation => (
           <div key={quotation._id} >
           {quotation.quote_no}
           {quotation.senderId}
           </div>
         ))}
         </div>
    )}
  </Query>
  </div>
);

export default compose(
  injectIntl,
  withSEO({ title: 'quotationsHTMLTitle' }),
  setDisplayName('Quotations'),
)(Quotations);
