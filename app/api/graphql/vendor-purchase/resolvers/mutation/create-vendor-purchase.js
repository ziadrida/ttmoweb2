import VendorPurchase from '/app/entry-points/server/models/vendor-purchase';
import PurchaseOrder from '/app/entry-points/server/models/purchase-order';

import moment from 'moment';

import {getNextSequenceValue} from '/app/api/graphql/utils'
  import updateOrInsert from './helper';
const debugOn = true;

const errorOn = true;
  // resolver - createVendorPurchase (SEE BELOW!)
  //


async function createVendorPurchase(root, args, context) {

  console.log('root:', root)
  console.log('args:', args)
  console.log('context:', context)
  var order = args.input;
  var result = {};
  //vendorPurchase: function(senderID, order, callback) {
  if (debugOn) console.log(" in vendorPurchase - update or insert a new vendorPurchase:", JSON.stringify(order));
   var senderID = 'web-ziad'
  result.message = undefined
  // Peform a simple find and return one  documents

  if (!order.get && (!order._id || order._id == undefined) && // only purchase_id for update
    (!order.po_no || !order.order_no)) {
    // these are required for creation
    result.message = "For new purchase I need po_no, order_no, order_date and purchased_qty. For updates, at least purchase_id or po_no and order_no is required "

  } else {
    // validate values
    if (order.purchased_qty && order.purchased_qty < 1) {
      result.message = "Invalid purchased_qty of " + order.purchased_qty


    } else if (order.po_no) {
      //  PO must exits and order# must exist too
      try {
          doc = await PurchaseOrder.findOne({ "_id": order.po_no  })

          if (doc) {
          // give error if purchase quantity is higher than PO Quantity
          if (doc.po_qty < order.purchased_qty) {
            result.message = "Purchased quantity is more than PO quantity! PO quantity is: " + doc.po_qty
            console.log('after updateOrInsert order[1]:',order)

          } else {

            try {
              resp = await updateOrInsert(order,senderID);

              if (debugOn) console.log(">>>> after updateOrInsert vendorPurchase resp: ", resp)
              console.log('after updateOrInsert[2] resp:',resp)
              result = resp
            } catch(err) {
              console.log("Error from updateOrInsert ", err)
            }
          }
        } else {
          if (debugOn) console.log("Could not find PO:", order.po_no)
          result.message = "Could not find PO: [" + order.po_no + "]. Create PO first before purchasing!"

        }
      } catch(err) {
        if (errorOn) console.log("find PurchaseOrder ERR:", JSON.stringify(err, null, 2))
        result.message = "Error trying to find PO#:" + JSON.stringify(err, null, 2)
        console.log('after updateOrInsert order[3]:',order)
      }


    } else {
      // must have purchase_id
      try {
      resp = await updateOrInsert(order)
      if (debugOn) console.log(">>>>>>>>>>>>> after updateOrInsert vendorPurchase resp: ", resp)
      console.log('after updateOrInsert resp:',resp)
      result = resp;
      }
      catch(err) {
        console.log("Error from updateOrInsert[2]: ",err)
      }


    }
  } // validate values
  console.log("RETURN RESULT:",result)
  return result;
  // updateOrInsert helper function

}

export default createVendorPurchase;
