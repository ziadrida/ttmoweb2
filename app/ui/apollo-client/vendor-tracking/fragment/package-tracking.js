import gql from 'graphql-tag';
//import postFragment from '../../post/fragment/post';

//console.log("in grapphql orderDetails fraqment orderDetails.js")
// user {
//   name
// }
const packageTrackingFragment = gql`
fragment packageTrackingFragment on PackageTracking {
  _id
  carrier
  box_id
  created_by
  date_received
  date_created
  last_updated
  ship_date
  time_in_transit_from
  time_in_transit_to
  updated_by
}
`;


export default packageTrackingFragment;
