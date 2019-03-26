import gql from 'graphql-tag';

const userFragment = gql`
  fragment userFragment on User {
    _id
    userId
    username
    sales_person
    role
    name
    first_name
    last_name
    real_name
    address
    email
    phone_no
    fbInboxLink
    profile_pic

    createdAt
    services
    emails {
      address
      verified
    }
    profile {
      name
      gender
      avatar
    }
    roles
    subscriptions {
      endpoint
      keys {
        auth
        p256dh
      }
    }
  }
`;

export default userFragment;
