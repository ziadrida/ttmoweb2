import mongoose  from 'mongoose';

const schema = mongoose.Schema({
      _id: String,
      category_name: String,
      category_name_ar:String,
      personal_allowed: Boolean,
      customs: Number,
      tax_aqaba: Number,
      tax_amm: Number,
      margin_amm:Number,
      margin_aqaba: Number,
      special_tax: Boolean,
      us_tax: Number,
      cap_aqaba: Number,
      cap_amm: Number,
      min_side_length: Number,
      keywords: String,
      min_lonng_side:Number
},{ collection: 'categories' })

const Category = mongoose.model('categories', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('NEW Category collection:',Category)
if (!Category) console.log("categories.js Category is null!")

export default Category;
