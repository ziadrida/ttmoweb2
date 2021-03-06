import mongoose  from 'mongoose';
//import VendorPurchase from './vendor-purchase'

const schema = mongoose.Schema({
    _id: String,
    username: String,
    userId: String,
    title: String,
    link:  String,
    trc: Boolean,
    destination: String,
    order_type: String,
    po_date:String,
    deadline: String,
    company: String,
    real_name: String,
    user_title: String,
    address: String,
    phone_no: String,
    email: String,
    sales_person: String,
    communication_method: String,

    vip: Boolean,
    membership_amount:Number,
    payment_status:String,
    first_payment:Number,
    first_payment_date:Date,
    final_payment: Number,
    final_payment_date: Date,
    discount: Number,

    total_amount:Number,
    payment_method:String,
    paid_in_full:Boolean,
    booked: Boolean,
    accounting_note: String,

    category: String,
    source: String,
    price: Number,
    sale_price:Number,
    po_qty: Number,
    delivered_qty: Number,
    warranty: String,
    options: String,
    membership_amount: Number,

    closed: Boolean,
    chargable_wt: Number,
    customer_delivery_date: String,
    amm_showroom_arrival_date: String,
    aq_showroom_arrival_date: String,
    amm_customs_arrival_date: String,
    aq_customs_arrival_date: String,
    orign_facility_arrival_date: String,
    status: String,
    notes: String,
    date_created: Date,
    created_by: String,
    last_updated: Date,
    updated_by: String,
    //vendorPurchase: [VendorPurchase]
  }

);

const PurchaseOrder = mongoose.model('purchase_orders', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('NEW PurchaseOrder collection:',PurchaseOrder)
if (!PurchaseOrder) console.log("purchaseOrder.js PurchaseOrder is null!")

export default PurchaseOrder;
