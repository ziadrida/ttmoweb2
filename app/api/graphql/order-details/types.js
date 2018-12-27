// graphql type definition and query definition

import { gql } from 'apollo-server-express'

//const typeDefs = `
const types = gql`

  type OrderDetails {
    _id: String
    seller_ship_id:String
    purchase_id: String
    userId: String
    po_no: String
    po_date:DateTime
    po_qty: Int
    price:Float
    sale_price:Float
    destination:String
    address:String
    username: String
    phone_no:String
    email:String
    sales_person:String
    title: String
    options:String
    link: String
    source:String
    category: String
    first_payment:String
    total_amount:String
    payment_method:String
    vip:String
    trc:String
    membership_amount:String
    payment_status:String
    status:String
    closed:String
    order_no: String
    orders:[String]
    trackings:[String]
    order_type: String
    delivery_days_from: String
    delivery_days_to: String
    order_date: String
    seller:String
    purchased_qty: String
    purchased: Int
    total_purchased_qty: String
    customer_delivery_date:String
    delivered_qty:String
    tracking_no: String
    shipped_qty: String
    total_order_shipped_qty:String
    ship_date: String
    time_in_transit_from: String
    time_in_transit_to: String
    box_id: String
    final_box_id:[String]
    date_received: String
    ship_id: String
    packing: [Packing]
    purchase_last_updated: String
    tracking_last_updated: String
    notes: String
    tracking_notes: String
    purchase_notes: String
    carrier: String
    departure_date:String
    amm_showroom_arrival_date:String
    aq_showroom_arrival_date:String
    amm_customs_arrival_date:String
    aq_customs_arrival_date:String
    customer_address_arrival_date:String
    awb_destination:String
    shipment_ref:String
    awb_status:String
    awb_no:String
    received: String
    date_created: String
    created_by: String
    last_updated: String
    updated_by: String
  }

  type Packing {
    box_id:[String]
    final_box_id: [String]

  }

  type Query {
        getOrderDetails(po_no: String,
            status: String,
            order_no: String,
            tracking_no: String,
            awb_no:String,
            username: String,
            stage: String,
            search: String): [OrderDetails]
  }

`;

export default types;