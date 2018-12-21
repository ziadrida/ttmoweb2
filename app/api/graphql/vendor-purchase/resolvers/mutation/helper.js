import VendorPurchase from '/app/entry-points/server/models/vendor-purchase';
import {removeEmpty} from '/app/api/graphql/utils'
import {getNextSequenceValue} from '/app/api/graphql/utils'

import moment from 'moment';
updateOrInsert = async function(order,senderID) {
  var debugOn = true;
  var errorOn = true;
  if (debugOn) console.log(">>>>>>>>>>>>> in vendorPurchase->updateOrInsert  ")

  var resp = {};
  order.last_updated = moment().toDate();
  order.updated_by = senderID ? senderID : 'admin'
  saveGet = order.get
  order.get = undefined
  updateFlds = removeEmpty(order)

  updateStr = {
    $set: updateFlds
  }
  if (debugOn) console.log("GET?", order.get)
  var queryStr = ""
  if (saveGet) {
    queryStr = {
      $or: [{
        po_no: order.po_no
      }, {
        order_no: order.order_no
      }]
    }
  } else {
    queryStr = order._id ? {
      _id: order._id
    } : {
      po_no: order.po_no,
      order_no: order.order_no
    }
  }
  if (debugOn) console.log("queryStr:", queryStr)
  var resp = {}
  try {
    resp = await VendorPurchase.findOneAndUpdate(
      queryStr,
      updateStr,
      { sort: {  _id: 1  },
      returnOriginal: false,
       upsert: false })
  } catch(err) {
    if (errorOn) console.log(" +++++==== findOneAndUpdate ERROR! err:", JSON.stringify(err, null, 2))
    resp.message = JSON.stringify(err, null, 2);
    return resp
  }

    if (debugOn) console.log(" vendorPurchase findOneAndUpdate resp:", resp);
    if (resp ) {
          if (debugOn) console.log("vendorPurchase updated existing record");
          resp.message = "Updated VendorPurchase. \n" + JSON.stringify(resp , null, 2)
          return resp;
    } else {
          if (!order.po_no
            || !order.order_no
            || !order.order_date
            || !order.purchased_qty) {
            // cannot create
            resp = {}
            resp.message = "For new purchase I need po_no, order_no, order_date and purchased_qty"
            console.log("message[1]:",order.message)
            return resp;
          } else {
            if (debugOn) console.log("vendorPurchase - no existing match - create new one.")
            //add new order
             nextVal = await getNextSequenceValue('vendor_purahse'); //  sequence name is misspelled!

              var newDoc = order;
              newDoc._id = nextVal;

              newDoc.date_created = moment().toDate()
              newDoc.created_by = senderID ? senderID : 'admin'
              newDoc.last_updated = moment().toDate()
              newDoc.updated_by = senderID ? senderID : 'admin'
              newDoc.delivery_days_from = order.delivery_days_from ? order.delivery_days_from : 7
              newDoc.delivery_days_to = order.delivery_days_to ? order.delivery_days_to : 14
              newDoc.order_date = order.order_date ? order.order_date : moment().format('DD/MM/YYYY')
              newDoc.purchased_qty = order.purchased_qty ? order.purchased_qty : 1
              console.log('before create => newDoc:\n',newDoc)
              if (debugOn) console.log(" ************** Insert new purchaseOrder:");
               resp = {}
              try {
                 resp = await VendorPurchase.create(newDoc)
              } catch(err) {
                if (errorOn) console.log("vendorPurchase - Error inserting new VendorPurchase info err:", err);
                if (errorOn) console.log("vendorPurchase - Error inserting new VendorPurchase info newDoc:", newDoc);
                resp = {}
                resp.message = "Error updating vendorPurchase: " + JSON.stringify(err, null, 2);
                return resp
            }
                // assert.equal(err, null);
                if (debugOn) console.log("<><> vendorPurchase - After create")

                  if (debugOn) console.log("Inserted a document into the vendorPurchase table, result:", JSON.stringify(result));
                  if (debugOn) console.log("**** New purchase_orders");
                  resp.message = "New vendor purchase  created Successfully. \n" + JSON.stringify(newDoc, null, 2);
                  return resp;
          }
        }
    console.log("THIS SHOULD NOT BE REACHED !!")
}
export default updateOrInsert;
