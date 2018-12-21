import mongoose  from 'mongoose';

const schema = mongoose.Schema({
  _id: Number,
  po_no: String,
  order_no: String,
  tracking_no: String,
  purchase_id: Number,
  seller: String,
  ship_date: String,
  time_in_transit_from: Number,
  time_in_transit_to: Number,
  shipped_qty: Number,
  notes: String,
  date_created: Date,
  created_by: String,
  last_updated: Date,
  updated_by: String,

},{ collection: 'vendor_order_tracking' })

const VendorTracking = mongoose.model('vendor_order_tracking', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};

console.log('NEW VendorTracking collection:',VendorTracking);
if (!VendorTracking) console.log("vendorTracking.js VendorTracking is null!")

export default VendorTracking;
