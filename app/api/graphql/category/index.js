import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const Category = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("Category meteor isServer")
} else {
  console.log("Category meteor isClient!!!")
}
  import types from './types';
  import resolvers from './resolvers';

  extend(Category, { types, resolvers });


export default Category
