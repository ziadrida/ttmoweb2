import mongoose  from 'mongoose';

const schema = mongoose.Schema({
  _id: String,
  carrier: String,
  box_id: String,
  ship_date: String,
  time_in_transit_from: Number,
  time_in_transit_to: Number,
  date_received: Date,
  notes: String,
  date_created: Date,
  created_by: String,
  last_updated: Date,
  updated_by: String,

},{ collection: 'package_tracking' })

const PackageTracking = mongoose.model('package_tracking', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('NEW PackageTracking collection:',PackageTracking);
if (!PackageTracking) console.log("vendorTracking.js PackageTracking is null!")

export default PackageTracking;
