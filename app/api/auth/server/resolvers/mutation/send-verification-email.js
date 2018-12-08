import { Accounts } from 'meteor/accounts-base';

async function sendVerificationEmail(root, { email }, { user }) {
  console.log('=> in sendVerificationEmail', email,' user:',user)
  Accounts.sendVerificationEmail(user._id, email);
  return {
    success: true,
  };
}

export default sendVerificationEmail;
