import VendorPurchase from '/app/entry-points/server/models/vendor-purchase';
import PurchaseOrder from '/app/entry-points/server/models/purchase-order';

import moment from 'moment';

import {removeEmpty} from '/app/api/graphql/utils'
import {getNextSequenceValue} from '/app/api/graphql/utils'

const debugOn = true;

const errorOn = true;
  // resolver - createVendorPurchase (SEE BELOW!)
  //
  // updateOrInsert helper function
  updateOrInsert = async function(order) {
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
        { sort: {  _id: 1  },  returnOriginal: false,   upsert: false })
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
               nextVal = await getNextSequenceValue('vendor_purahse');

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

async function createVendorPurchase(root, args, context) {
  console.log('root:', root)
  console.log('args:', args)
  console.log('context:', context)
  var order = args.input;
  var result = {};
  //vendorPurchase: function(senderID, order, callback) {
  if (debugOn) console.log(" in vendorPurchase - update or insert a new vendorPurchase:", JSON.stringify(order));
   senderID = 'web-ziad'
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
              resp = await updateOrInsert(order)

              if (debugOn) console.log(">>>>>>>>>>>>> after updateOrInsert vendorPurchase resp: ", resp)
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
}

export default createVendorPurchase;
