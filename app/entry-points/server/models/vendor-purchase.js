import mongoose  from 'mongoose';

const schema = mongoose.Schema({
  _id: Number,
  po_no: String,
  order_no: String,
  seller: String,
  order_date: String,
  delivery_days_from: Number,
  delivery_days_to: Number,
  purchased_qty: Number,
  ship_to_address: String,
  price_paid: Number,
  part_no: String,
  ein: String,
  title: String,
  link: String,
  source: String,
  ship_price: Number,
  tax: Number,
  options: String,
  notes: String,
  date_created: Date,
  last_updated: Date,
})

const VendorPurchase = mongoose.model('vendor_purchases', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('NEW VendorPurchase collection:',VendorPurchase)
if (!VendorPurchase) console.log("purchaseOrder.js VendorPurchase is null!")

export default VendorPurchase;
