import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const PurchaseOrder = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("PurchaseOrder meteor isServer")
} else {
  console.log("PurchaseOrder meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(PurchaseOrder, { types, resolvers });


export default PurchaseOrder
