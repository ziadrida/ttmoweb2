import VendorTracking from '/app/entry-points/server/models/vendor-tracking';
import PurchaseOrder from '/app/entry-points/server/models/purchase-order';

import VendorPurchase from '/app/entry-points/server/models/vendor-purchase';

import moment from 'moment';
  import updateOrInsert from './helper'
import {removeEmpty} from '/app/api/graphql/utils'
import {getNextSequenceValue} from '/app/api/graphql/utils'

const debugOn = true;

const errorOn = true;
  // resolver - createVendorTracking (SEE BELOW!)
  //
  // updateOrInsert helper function
  // update or insert a new VendorTracking *ship

  async function createVendorTracking(root, args, context) {

    var order = args.input
    order.order_no = order.order_no.trim()
    order.tracking_no = order.tracking_no.trim()

    if (debugOn) console.log("=>in VendorTracking - update or insert a new VendorTracking:",
        JSON.stringify(order));

    console.log('root:', root)
    console.log('args:', args)
    console.log('context:', context)

    var result = {};
    var senderID = 'web-ziad'
    result.message = undefined
      // Peform a simple find and return one  documents

        if ((!order._id || order._id == undefined) && // only ship id for update
          (!order.po_no || !order.tracking_no || !order.order_no)) { // these are required for creation
          result.message = "For new tracking I need po_no, order_no and tracking_no. For updates, at least ship_id is required "
          ;
        } else {
          // validate input
          if (order.shipped_qty <= 0 ) {
            result.message = "Invalid shipped_qty or " + order.shipped_qty
            ;
          } else {

              doc = await VendorPurchase.findOne(
                {
                  $or: [{
                    purchase_id: order.purchase_id
                  }, {
                    $and : [
                      { "po_no": order.po_no, "order_no": order.order_no}
                    //  { "_id" : order._id }
                    ]
                  }]

              })

            if (doc)  {
              // give error if  quantity is higher than PO Quantity
              if (doc.po_qty < order.shipped_qty ) {
                result.message = "Shipped quantity is more than PO quantity! PO quantity is: " + doc.po_qty

              } else {
                order.purchase_id = doc._id;
                if (debugOn) console.log("set purchase_id:",order.purchase_id)
                resp =  await updateOrInsert(order,senderID) ;
                  if (debugOn) console.log( ">>>>>>>> after updateOrInsert VendorTracking resp: ", resp)
                  result = resp
              }
            } else  {
              if (debugOn) console.log("Could not find PO# ["+order.po_no +
                "] and seller order# [" +
                  order.order_no + "]. Create PO first before purchasing!")

              result.message = "Could not find PO#, seller order#, or ship_id" +
                    ". You must create PO then purchase item before assigning a tracking#!"

            }

      }
      console.log("RETURN RESULT:",result)
      return result;
    }

    }

export default createVendorTracking;
