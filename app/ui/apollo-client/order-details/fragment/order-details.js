import gql from 'graphql-tag';
//import postFragment from '../../post/fragment/post';

//console.log("in grapphql orderDetails fraqment orderDetails.js")
// user {
//   name
// }
const orderDetailsFragment = gql`
fragment orderDetailsFragment on OrderDetails {
  _id
  seller_ship_id
  purchase_id
  userId
  po_no
  po_date
  po_qty
  price
  sale_price
  destination
  address
  username
  phone_no
  email
  sales_person
  title
  options
  link
  source
  category
  first_payment
  total_amount
  payment_method
  vip
  trc
  membership_amount
  payment_status
  status
  closed
  order_no
  orders
  order_type
  delivery_days_from
  delivery_days_to
  order_date
  seller
  purchased_qty
  purchased
  total_purchased_qty
  customer_delivery_date
  delivered_qty
  tracking_no
  shipped_qty
  total_order_shipped_qty
  ship_date
  time_in_transit_from
  time_in_transit_to
  box_id
  final_box_id
  date_received
  ship_id
  packing {
    box_id
    final_box_id
  }
  last_updated
  notes
  departure_date
  amm_showroom_arrival_date
  aq_showroom_arrival_date
  amm_customs_arrival_date
  aq_customs_arrival_date
  customer_address_arrival_date
  awb_destination
  shipment_ref
  awb_status
  awb_no
  received
}
`;


export default orderDetailsFragment;
