import PurchaseOrder from '/app/entry-points/server/models/purchase-order';

import {
  removeEmpty
} from '/app/api/graphql/utils'
import moment from 'moment';
const debugOn = true;

const errorOn = true;
// create or update purchase order)
//

async function cancelPurchaseOrder(root, args, context) {

  console.log("=> in cancelPurchaseOrder")
  console.log('root:', root)
  console.log('args:', args)
  console.log('context:', context)

  if (debugOn) console.log("=> in cancelPurchaseOrder:", JSON.stringify(args.input));
  console.log("  context.user.profile.name:",  context.user.profile.name)
  var senderID = context.user && context.user.profile && context.user.profile.name?
    context.user.profile.name: 'wedadmin';

  // Peform a simple find and return one  documents
  var result = {}
  if (!args.input.po_no || args.input.po_no == undefined || !args.input.status ) {
    result.message = "Must pass PO number and status (po_no)"
    result._id = -99;
    return result;
  }



  result._id = args.input.po_no;

  // set update fields
  var order = {}

  order.updated_by = senderID ? senderID : 'admin'
  order.status =  args.input.status?  args.input.status:'hold'
  order.delivered_qty =  args.input.delivered_qty?parseInt(args.input.delivered_qty):null;
  order.closed =   order.status == "closed"? true:false; // can reopen PO
  order.notes = args.input.notes ? args.input.notes : "status set to "+order.status+" by " + senderID
  order.last_updated = moment().toDate();

  var queryStr = ""
    queryStr = {
      _id: args.input.po_no
  }
  console.log('queryStr:', queryStr)
  var existingPo = await PurchaseOrder.findOne(queryStr);
  console.log("existingPo:",existingPo)
  if (!existingPo) {
    result.message  = "PO not found";
    console.log('return result 1:',result)
    return result
  } else {

    result.delivered_qty = existingPo.delivered_qty;
    result.status = existingPo.status
    result.notes = existingPo.notes;
    result.closed = existingPo.closed;
    result.message=""

    console.log("set result 2:",result)
    console.log("set order 2:",order)
  if (order.status == 'delivered' && (!order.delivered_qty || order.delivered_qty <existingPo.po_qty))
  {
    result.message = "Invalid delivered qty. Po Qty is "
    console.log('return result   result.message1:',  result.message)
    result.message =   result.message+   existingPo.po_qty +  " but delivered qty is "
    result.message =   result.message+  (order.delivered_qty?order.delivered_qty:'not set')
    console.log('return result   result.message2:',  result.message)
    console.log('return result 3:',result)
    return result;
  }   if (order.status == 'delivered' &&
    (args.input.delivered && args.input.delivered <0))
    {
      result.message = "Did not arrive to final destination! Check packing"
      console.log('return result 6 ',result)
      return result;
    }
  else  if (order.status == 'closed' &&
      ((existingPo.status == "active"|| existingPo.status == "delivered")
       &&
        ( order.delivered_qty?order.delivered_qty:-1 < existingPo.po_qty&&
         existingPo.delivered_qty < existingPo.po_qty)
      ))
   {
    result.message = "Cannot close active or delivered PO that is not fully delivered"
    console.log('return result 4 ',result)
    return result;
  }

  // cannot set status of delivered PO unless to cancelled or from cancelled to any
  if((args.input.delivered && args.input.delivered >0 && order.status != "cancelled" )&&
    (existingPo.status != "cancelled" ) ) {
      result.message = "PO never arrived to final destination. Invalid status change to "+order.status
      console.log('return result 5 ',result)
      return result;

  }
  updateFlds = removeEmpty(order)
  updateStr = {
    $set: updateFlds
  }

  console.log('updateStr:', updateStr)

  var doc = await PurchaseOrder.findOneAndUpdate(
    queryStr,
    updateStr,
     {
      new: true,
      upsert: false
    });

  if (debugOn) console.log("purchaseOrder findOneAndUpdate doc:", JSON.stringify(doc));
  if (doc) {
    result = doc;

    result.message = "Status Updated"
    console.log("success result:",result)
    return result;
  } else {
    result.message = "Error - count not update status"

    return result;
  }
}

}

export default cancelPurchaseOrder;
