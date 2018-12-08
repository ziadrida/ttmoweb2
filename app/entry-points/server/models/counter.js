import mongoose  from 'mongoose';

console.log('Importing Counter')

const schema = mongoose.Schema({
_id: String,
sequence: Number,

});
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};


const Counter = mongoose.model('Counter', schema);

console.log(' collection:',Counter)
if (!Counter) console.log("index.js Counter is null!")


export  {
  Counter,

};
