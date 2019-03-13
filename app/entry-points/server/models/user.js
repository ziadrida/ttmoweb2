import mongoose  from 'mongoose';

// const isEmail = require('validator/lib/isEmail');
// const Joi = require('joi');
// const jwt = require('jsonwebtoken');

console.log('Importing user')

const MessageAttachments = mongoose.Schema({
  title: String,
  url: String,
  type: String,
  payload: String
})

const Messages = mongoose.Schema({
  messageText: String,
  messageAttachments: [MessageAttachments],
  timestamp: String,
  dateCretaed: String
})


const schema = mongoose.Schema({
_id: String,
name: String,
userId: String,
first_name: String,
last_name: String,
address:  String,
locale: String,
city: String,
vip: Boolean,
phone_no: String,
tax_exempt: Boolean,
company: String,
user_title: String,
real_name: String,
email: String,
role: String,
location: String,
order_status_subscription: Boolean,
price_drop_subscription: Boolean,
date_created: String,
messages: [Messages]

},{ collection: 'users' });

//const User = mongoose.model('User', schema);


//console.log('Process.env:',process.env)
const { JWT_PRIVATE_KEY } = process.env;

// if (!JWT_PRIVATE_KEY || JWT_PRIVATE_KEY.length === 0) {
//   console.error('FATAL ERROR: JWT_PRIVATE_KEY env var missing');
//   process.exit(1);
// }

// // Constants
// const MIN_STRING_LENGTH = 2;
// const MAX_STRING_LENGTH = 255;
// const PASS_CODE_LENGTH = 6;
//
// // Mongoose schema and model
// const schema = mongoose.Schema({
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     minlength: MIN_STRING_LENGTH,
//     maxlength: MAX_STRING_LENGTH,
//     unique: true,
//     required: [true, 'Email address is required'],
//     validate: [isEmail, 'Please fill a valid email address'],
//   },
// });

schema.methods.genAuthToken = function () {
  console.log('=> in getAuthToken')
  return jwt.sign({ _id: this._id }, JWT_PRIVATE_KEY);
};

const User = mongoose.model('User', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('user collection:',User)
if (!User) console.log("index.js User is null!")

// Joi schema validator
//const emailVal = Joi.string().email().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH).required(); // eslint-disable-line
//const passCodeVal = Joi.string().length(PASS_CODE_LENGTH).required(); // eslint-disable-line

// const validateNewUser = (user) => {
//   console.log('=> in model/user validateNewUser ')
//   const joiSchema = {
//     email: emailVal,
//   };
//
//   return Joi.validate(user, joiSchema); // { error, value }
// };

// const validateLogin = (credentials) => {
//   console.log('=> in validateLogin')
//   const joiSchema = {
//     email: emailVal,
//     passCode: passCodeVal,
//   };

//   return Joi.validate(credentials, joiSchema); // { error, value }
// };

export  {
  User,
  //validateNewUser,
  //validateLogin,
};
