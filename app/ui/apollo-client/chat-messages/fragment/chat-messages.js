import gql from 'graphql-tag';
//import postFragment from '../../post/fragment/post';

//   name
// }
const chatMessagesFragment = gql`
fragment chatMessagesFragment on ChatMessages {
  _id
  userId
  senderId
  recipientId
  seq
  is_echo
  first_name
  last_name
  name
  gender
  city
  messageText
  messageId
  messageAttachments
  timestamp
  userDateCreated
  dateCreated
}
`;

// ${postFragment}
export default chatMessagesFragment;
