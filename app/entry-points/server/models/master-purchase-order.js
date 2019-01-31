import mongoose  from 'mongoose';
//import VendorPurchase from './vendor-purchase'

// this is a new collection to maintain backward compatability

const schema = mongoose.Schema({
    _id: String,
    po_date:String,
    username: String,
    company: String,
    userId: String,
    real_name: String,
    user_title: String,
    address: String,

    phone_no: String,
    email: String,
    sales_person: String,

    destination: String,
    order_type: String,

    communication_method: String,

    vip: Boolean,
    membership_amount:Number,

    // accounting
    payment_status:String,
    first_payment:Number,
    first_payment_date:Date,
    final_payment: Number,
    final_payment_date: Date,
    total_amount:Number,
    payment_method:String,
    paid_in_full:Boolean,
    booked: Boolean,
    accounting_note: String,


    membership_amount: Number,

    closed: Boolean,

    status: String,
    notes: String,
    date_created: Date,
    created_by: String,
    last_updated: Date,
    updated_by: String,
    //vendorPurchase: [VendorPurchase]
  }

);

const MasterPurchaseOrder = mongoose.model('master_purchase_orders', schema);
console.log('NEW masterPurchaseOrder collection:',MasterPurchaseOrder)
if (!MasterPurchaseOrder) console.log("master_purchase_orders.js MasterPurchaseOrder is null!")

export default MasterPurchaseOrder;
