import gql from 'graphql-tag';

const usersFragment = gql`
  fragment usersFragment on User {
    _id
    name
    first_name
    last_name
    real_name
    address
    email
  }
`;

export default usersFragment;
