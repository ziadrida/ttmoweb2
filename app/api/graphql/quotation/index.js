import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const Quotations = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("quotations meteor isServer")
} else {
  console.log("quotations meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(Quotations, { types, resolvers });


export default Quotations
