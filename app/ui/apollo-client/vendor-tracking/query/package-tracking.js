import gql from 'graphql-tag';
import packageTrackingFragment from '../fragment/package-tracking';

const packageTrackingQuery = gql `

  query packageTracking (
        $tracking_no: String!)
  {
           getPackageTracking(
             _id: $tracking_no) {
              ...packageTrackingFragment

  }
}

  ${packageTrackingFragment}
`;


export default packageTrackingQuery;
