
import gql from 'graphql-tag';
import userFragment from '../userFragment';


const usersQuery = gql `

  query users ($username: String, $userId: String,$search: String,$searchField: String) {
  getUsers(username: $username,userId:$userId, search: $search, searchField: $searchField) {
    ...userFragment
  }
}
  ${userFragment}
`;

export default usersQuery;
