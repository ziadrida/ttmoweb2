import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const VendorTracking = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("VendorTracking meteor isServer")
} else {
  console.log("VendorTracking meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(VendorTracking, { types, resolvers });


export default VendorTracking
