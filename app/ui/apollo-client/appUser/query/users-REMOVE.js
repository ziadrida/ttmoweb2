
import gql from 'graphql-tag';
import usersFragment from '../fragment/users';

console.log('==> in query users')
const usersQuery = gql `

  query users ($username: String, $userId: String,$search: String,$searchField: String) {
  getUsers(username: $username,userId:$userId, search: $search, searchField: $searchField) {
    ...usersFragment
  }
}
  ${usersFragment}
`;

export default usersQuery;
