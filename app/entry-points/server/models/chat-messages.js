import mongoose  from 'mongoose';

// const isEmail = require('validator/lib/isEmail');
// const Joi = require('joi');
// const jwt = require('jsonwebtoken');

console.log('Importing ChatMessages')

const schema = mongoose.Schema({
_id: String,
userId:String,
is_echo: Boolean,
seq:Number,
senderId: String,
recipientId: String,
messageText: String,
messageAttachments: String,
title: String,
url: String,
type: String,
payload: String,
timestamp: Date,
dateCretaed: Date

},{ collection: 'user_messages' });


const ChatMessages = mongoose.model('user_messages', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('ChatMessages collection:',ChatMessages)
if (!ChatMessages) console.log("index.js ChatMessages is null!")

export  {
  ChatMessages,

};
