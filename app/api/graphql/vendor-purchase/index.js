import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const VendorPurchase = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("VendorPurchase meteor isServer")
} else {
  console.log("VendorPurchase meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(VendorPurchase, { types, resolvers });


export default VendorPurchase
