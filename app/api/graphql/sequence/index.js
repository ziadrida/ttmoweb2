import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const Sequence = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("Sequence meteor isServer")
} else {
  console.log("Sequence meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(Sequence, { types, resolvers });


export default Sequence
