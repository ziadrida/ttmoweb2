import gql from 'graphql-tag';

const userFragment = gql`
  fragment userFragment on User {
    _id
    name
    email
  }
`;

export default userFragment;
