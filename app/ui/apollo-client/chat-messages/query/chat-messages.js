import gql from 'graphql-tag';
import chatMessagesFragment from '../fragment/chat-messages';

const chatMessagesQuery = gql `

  query chatMessages ($username: String, $userId: String,$dateFrom:String, $dateTo:String, $search: String,$searchField: String) {
  getChatMessages(username: $username,userId:$userId,dateFrom: $dateFrom,dateTo:$dateTo, search: $search, searchField: $searchField) {
    ...chatMessagesFragment
  }
}
  ${chatMessagesFragment}
`;

export default chatMessagesQuery;
