import mongoose  from 'mongoose';

console.log('Importing OrderDetails')


const Packing = mongoose.Schema({
        box_id: [String],
        final_box_id: [String],

})

const schema = mongoose.Schema({
        _id: String,
        seller_ship_id:String,
        purchase_id: String,
        userId: String,
        po_no: String,
        po_date:Date,
        po_qty: Number,
        price:Number,
        sale_price:Number,
        destination:String,
        address:String,
        username: String,
        phone_no:String,
        email:String,
        sales_person:String,
        title: String,
        options:String,
        link: String,
        source:String,
        category: String,

        trc:String,
        vip:Boolean,

        status:String,
        closed:String,
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


        order_no: String,
        orders:[String],
        trackings:[String],
        order_type: String,
        delivery_days_from: String,
        delivery_days_to: String,
        order_date: String,
        seller:String,
        purchased_qty: String,
        purchased: Number,
        total_purchased_qty: String,
        customer_delivery_date:String,
        delivered_qty:String,
        tracking_no: String,
        shipped_qty: String,
        total_order_shipped_qty:String,
        ship_date: String,
        carrier: String,
        time_in_transit_from: String,
        time_in_transit_to: String,
        box_id: String,
        final_box_id:[String],
        date_received: String,
        ship_id: String,
        packing: [Packing],
        last_updated: Date,
        purchase_last_updated: Date,
        tracking_last_updated: Date,
        notes: String,
        tracking_notes: String,
        purchase_notes: String,
        departure_date:Date,
        amm_showroom_arrival_date:Date,
        aq_showroom_arrival_date:Date,
        amm_customs_arrival_date:Date,
        aq_customs_arrival_date:Date,
        customer_address_arrival_date:Date,
        awb_destination:String,
        shipment_ref:String,
        awb_status:String,
        awb_no:String,
        received: Date,
})




const OrderDetails = mongoose.model('OrderDetails', schema);
console.log('NEW OrderDetails collection:',OrderDetails)
if (!OrderDetails) console.log("order-details.js OrderDetails is null!")

export default OrderDetails;
