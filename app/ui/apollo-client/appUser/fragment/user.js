import gql from 'graphql-tag';

const userFragment = gql`
  fragment userFragment on AppUser {
    _id
    name
    real_name
    address
    email
  }
`;

export default userFragment;
