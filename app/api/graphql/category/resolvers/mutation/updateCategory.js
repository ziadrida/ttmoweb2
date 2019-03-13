import Category from '/app/entry-points/server/models/category';

import {
  removeEmpty
} from '/app/api/graphql/utils'
import moment from 'moment';
const debugOn = true;

const errorOn = true;
// create or update purchase order)
//

async function updateCategory(root, args, context) {

  console.log("=> in updateCategory args:",args)
  //console.log('root:', root)
//  console.log('args:', args)
  //console.log('context:', context)

  //if (debugOn) console.log("=> in updateCategory:", JSON.stringify(args.input));
//  console.log("  context.user.profile.name:",context&& context.user&&context.user.profile&&
  //        context.user.profile.name)
  var senderID = context.user && context.user.profile && context.user.profile.name?
    context.user.profile.name: 'wedadmin';

  // Peform a simple find and return one  documents
  var result = {}
  if (!args.input.po_no || typeof args.input.po_no == 'undefined' ) {
    result.message = "Must pass PO number"
    console.log("error with po_no")
    result._id = -99;
    return result;
  }



  result._id = args.input.po_no;

  // set update fields
  var order = {}

try {
  order.paid_in_full =  args.input.paid_in_full
  order.closed =  args.input.closed
  order.booked =  args.input.booked

  order.updated_by = senderID ? senderID : 'admin'
  order.status =  args.input.status && args.input.status!=''?  args.input.status:null;
  order.delivered_qty =  args.input.delivered_qty !=null ?parseInt(args.input.delivered_qty):null;
  order.first_payment =  args.input.first_payment !=null?  parseFloat(args.input.first_payment):null;
    order.first_payment_date =  args.input.first_payment_date!= null   ?args.input.first_payment_date:null;
    if (  args.input.first_payment== 0 ||   order.first_payment_date== null ) {
      order.first_payment_date=''; // RESET DATE
    }
   order.final_payment =  args.input.final_payment !=null ?parseFloat(args.input.final_payment):null;

    order.final_payment_date =  args.input.final_payment_date!= null   ?args.input.final_payment_date:null;
    if (  args.input.final_payment== 0 ||   order.final_payment_date== null) {
      order.final_payment_date=''; // RESET DATE
    }
    order.discount =  args.input.discount !=null ?parseFloat(args.input.discount):null;

  order.accounting_note =  args.input.accounting_note?args.input.accounting_note:null;
  order.customer_delivery_date =  args.input.customer_delivery_date?args.input.customer_delivery_date:null;
} catch(err) {
  console.log("Error setting order: ",err)
  result.message = "Internal error. Error setting order"
  return result;
}
  if ( order.delivered_qty === 0) {
    order.customer_delivery_date = '0';
  }
  if (order.status == "closed") {
    order.closed =  true
    order.status = null; // keep last status
  } else if (order.status == "reopen" ) {
    order.closed =  false
  }


  order.notes = args.input.notes ? args.input.notes : ""
  order.last_updated_by_name = senderID
  order.last_updated = moment().toDate();

  var queryStr = ""
    queryStr = {
      _id: args.input.po_no
  }
  console.log('queryStr:', queryStr)
  var existingPo = await Category.findOne(queryStr);

  //console.log("existingPo:",existingPo)
  if (!existingPo) {
    result.message  = "PO not found";
    console.log('return result 1:',result)
    return result
  } else {
    console.log("Found PO")
    result.delivered_qty = existingPo.delivered_qty;
    result.first_payment = existingPo.first_payment;
    result.first_payment_date = existingPo.first_payment_date;
    result.final_payment = existingPo.final_payment;
    result.final_payment_date = existingPo.final_payment_date;
    result.discount = existingPo.discount;
    result.accounting_note = existingPo.accounting_note;
    result.customer_delivery_date = existingPo.customer_delivery_date;
    result.status = existingPo.status
    result.notes = existingPo.notes;
    result.closed = existingPo.closed;
    result.paid_in_full = existingPo.paid_in_full;
    result.booked =  existingPo.booked;
    result.message=""

    console.log("set result 2:",result)
    console.log("set order 2:",order)
  if (order.status == 'active' ) {
      if (order.delivered_qty && order.delivered_qty > existingPo.po_qty) {
          result.message = "Invalid delivered qty "+order.delivered_qty+" for active status. Po qty is "+ existingPo.po_qty;
          return result;
      } else if (order.delivered_qty && order.delivered_qty == existingPo.po_qty) {
            result.message = "Invalid delivered qty "+order.delivered_qty+" for active status. (same as PO qty! - set status to delivered)";
            return result;
      }
  } else if (order.status == 'delivered' ) {
    if (!order.customer_delivery_date || order.customer_delivery_date=='0') {
        result.message = "Invalid delivery date "
        return result
    }
    else if (!order.delivered_qty || order.delivered_qty != existingPo.po_qty)
    {
      result.message = "Invalid delivered qty. Po Qty is "
      console.log('return result   result.message1:',  result.message)
      result.message =   result.message+   existingPo.po_qty +  " but delivered qty is "
      result.message =   result.message+  (order.delivered_qty?order.delivered_qty:'not set')
      console.log('result.message2:',  result.message)
      console.log('return result 3:',result)
      return result;
    }  else if (args.input.delivered && args.input.delivered <0)  {
        result.message = "Did not arrive to final destination! Check packing"
        console.log('return result 6 ',result)
        return result;
    }
  } else if (args.input.status == 'closed') {
      if  (!["cancelled","delivered"].includes(existingPo.status) )  {
        result.message = "Only cancelled or delivered POs can be closed"
        console.log('return result 5 ',result)
        return result;
      }
      else  if ( existingPo.status == "delivered" &&  existingPo.delivered_qty != existingPo.po_qty) {
        result.message = "Cannot close delivered PO that is not properly delivered. Check delivered qty"
        console.log('return result 4 ',result)
        return result;
      }
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

  var doc = await Category.findOneAndUpdate(
    queryStr,
    updateStr,
     {
      new: true,
      upsert: false
    });

  //if (debugOn) console.log("purchaseOrder findOneAndUpdate doc:", JSON.stringify(doc));
  if (doc) {
      result = doc;
      result._id = doc._id;
      result.delivered_qty = doc.delivered_qty;
      result.first_payment = doc.first_payment;
      result.first_payment_date = doc.first_payment_date;
      result.final_payment = doc.final_payment;
      result.final_payment_date = doc.final_payment_date;
      result.discount = doc.discount;
      result.accounting_note = doc.accounting_note;
      result.customer_delivery_date = doc.customer_delivery_date;
      result.status = doc.status
      result.notes = doc.notes;
      result.closed = doc.closed;
      result.paid_in_full = doc.paid_in_full;
      result.booked = doc.booked;
      result.message = "Status Updated";
      console.log("success result:",result)
      return result;
    }  else {
      result.message = "Error - count not update status"

      return result;
    }
  }
}
export default updateCategory;
