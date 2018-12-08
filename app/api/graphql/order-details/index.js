import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const OrderDetails = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("OrderDetails meteor isServer")
} else {
  console.log("OrderDetails meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(OrderDetails, { types, resolvers });


export default OrderDetails
