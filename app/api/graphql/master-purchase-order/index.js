import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const MasterPurchaseOrder = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("MasterPurchaseOrder meteor isServer")
} else {
  console.log("MasterPurchaseOrder meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(MasterPurchaseOrder, { types, resolvers });


export default MasterPurchaseOrder
