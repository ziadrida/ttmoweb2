import gql from 'graphql-tag';
import orderDetailsFragment from '../fragment/order-details';

const orderDetailsQuery = gql `

  query orderDetails (
        $poNo: String,
        $status: String,
        $orderNo: String,
        $trackingNo: String,
        $awbNo: String,
        $username: String,
        $stage: String,
        $search: String)
  {
           getOrderDetails(
             po_no: $poNo,
             status: $status
             order_no:$orderNo
             tracking_no: $trackingNo
             awb_no: $awbNo
             username: $username
             stage: $stage
             search: $search) {
              ...orderDetailsFragment

  }
}

  ${orderDetailsFragment}
`;


export default orderDetailsQuery;
