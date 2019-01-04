import extend from 'lodash/extend';
// standard - does not change
//import types from './types';
//import resolvers from './resolvers';
const ChatMessages = {};
// export {
//   types,
//   resolvers,
// };

// Load server-only utilities
if (Meteor.isServer) {
  console.log("ChatMessages meteor isServer")
} else {
  console.log("ChatMessages meteor isClient!!!")
}
import types from './types';
import resolvers from './resolvers';

extend(ChatMessages, {
  types,
  resolvers
});


export default ChatMessages
