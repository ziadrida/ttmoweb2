import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const User = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("User meteor isServer")
} else {
  console.log("User meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(User, { types, resolvers });


export default User
