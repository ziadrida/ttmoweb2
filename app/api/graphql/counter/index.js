import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const Counter = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("Counter meteor isServer")
} else {
  console.log("Counter meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(Counter, { types, resolvers });


export default Counter
