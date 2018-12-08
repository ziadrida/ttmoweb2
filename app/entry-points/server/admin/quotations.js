import React from 'react';
import { compose, setDisplayName } from 'recompose';
import { FormattedMessage as T, injectIntl } from 'react-intl';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withSEO } from '/app/ui/hocs';
import Loading from '/app/ui/components/dumb/loading';


const GET_DATA = gql`
query quotations {
  getQuotation(quote_no:80000) {
    quote_no
  }
}
`;

const Quotations = () => (
  <Query query={GET_DATA}>
    {({ data, loading, error}) => (
      error
      ?  <p> {error.message} </p> :
      loading
        ? <Loading  />
        : <T id={data.quotations.quote_no} />
    )}
  </Query>
);

export default compose(
  injectIntl,
  withSEO({ title: 'quotationsHTMLTitle' }),
  setDisplayName('Quotations'),
)(Quotations);
