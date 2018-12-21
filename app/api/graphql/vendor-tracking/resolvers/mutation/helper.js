import VendorTracking from '/app/entry-points/server/models/vendor-tracking';
import PackageTracking from '/app/entry-points/server/models/package-tracking';
import {removeEmpty} from '/app/api/graphql/utils'
import {getNextSequenceValue} from '/app/api/graphql/utils'


import moment from 'moment';
const debugOn = true;
const errorOn = true;

updateOrInsert =  async function(order,senderID)  {

  if (debugOn) console.log(">>>>>>>>>>>>> in VendorTracking->updateOrInsert  ")
  var resp = {};

  trackResp = await findOrCreatePackageTracking(order,senderID);
   if (trackResp && trackResp.value ) {
     console.log("Found tracking record for ", order.tracking_no)
        if (debugOn) console.log("time_in_transit_from:", trackResp.value.time_in_transit_from)
        if (debugOn) console.log("time_in_transit_to:", trackResp.value.time_in_transit_to)

          order.time_in_transit_from =  trackResp.value.time_in_transit_from? trackResp.value.time_in_transit_from:undefined
          order.time_in_transit_to =  trackResp.value.time_in_transit_to? trackResp.value.time_in_transit_to:undefined
    }


  order.last_updated = moment().toDate();
  order.updated_by = senderID? senderID: 'admin'
  updateFlds = removeEmpty(order)
  var queryStr = ""
  updateStr = { $set: updateFlds }
  queryStr = order._id?  { _id: order._id }:
        {po_no: order.po_no,
         tracking_no: order.tracking_no,
         order_no: order.order_no}

  if (debugOn) console.log("queryStr:",queryStr)
//{ $or: [ {_id: order.ship_id}, {order_no: order.po_no, tracking: order.tracking_no} ]},
try {
    resp = await VendorTracking.findOneAndUpdate(
     queryStr,
     updateStr
  //, {  $set: {status: order.status, status_updated: statusChangeDate} }
  , {
        //  projection: { _id:1} ,//,po_no:1, tracking:1,order_no:1,ship_date:1,qty_shipped:1}
         sort: {_id:1}
        , returnOriginal: false
        , upsert: false
      });
  } catch(err) {
      if (errorOn) console.log("findOneAndUpdate ERROR! err:", JSON.stringify(err, null, 2))
      resp.message = JSON.stringify(err, null, 2);
      return resp
  }

    if (resp ) {
     if (debugOn) console.log("VendorTracking updated existing record");
       resp.message = "vendor_order_tracking updated.  order:"+
        JSON.stringify(resp,null,2)
      return resp;
   } else {
        if (debugOn) console.log("VendorTracking doscs NOT found.")
      //add new order
      nextVal = await getNextSequenceValue('vendor_shipment');

      var newDoc = order;
      newDoc._id = nextVal;

      newDoc.date_created =  moment().toDate()
      newDoc.created_by = senderID? senderID: 'admin'
      newDoc.last_updated = moment().toDate()
      newDoc.updated_by = senderID? senderID: 'admin'
      //newDoc.closed = false
      //newDoc.status = order.status? order.status:"NEW"
      // trackResp = await findOrCreatePackageTracking(order,senderID);
      //  if (trackResp && trackResp.value ) {
      //       if (debugOn) console.log("time_in_transit_from:", trackResp.value.time_in_transit_from)
      //       if (debugOn) console.log("time_in_transit_to:", trackResp.value.time_in_transit_to)
      //
      //         newDoc.time_in_transit_from =  trackResp.value.time_in_transit_from? trackResp.value.time_in_transit_from:undefined
      //         newDoc.time_in_transit_to =  trackResp.value.time_in_transit_to? trackResp.value.time_in_transit_to:undefined
      //   }
        newDoc =removeEmpty(newDoc)
         resp = {}
          try {
        resp = await VendorTracking.create(newDoc);
          // assert.equal(err, null);
        } catch(err) {
          if (errorOn) console.log("VendorTracking - Error inserting new VendorTracking info err:", err);
          if (errorOn) console.log("VendorTracking - Error inserting new VendorTracking info newDoc:", newDoc);
          resp = {}
          resp.message = "Error updating VendorTracking: " + JSON.stringify(err, null, 2);
          return resp
      }
          if (debugOn) console.log("Inserted a document into the VendorTracking table, result:",JSON.stringify(result));
          if (debugOn) console.log("**** New VendorTracking");
          resp.message = "new vendor_order_tracking  created. \n" + JSON.stringify(newDoc,null,2);
          return resp;
      }
  }

  async function findOrCreatePackageTracking(order,senderID) {
    var packageObj =
    { //_id: order.tracking_no,
      last_updated: moment().format("DD/MM/YYYY"),
      updated_by: senderID? senderID: 'admin',
      carrier: order.carrier?order.carrier:undefined,
      ship_date: order.ship_date? order.ship_date:undefined,
      time_in_transit_from: order.time_in_transit_from? order.time_in_transit_from:undefined,
      time_in_transit_to: order.time_in_transit_to? order.time_in_transit_to:undefined
    }

    updateFlds = removeEmpty(packageObj)
    updateStr = { $set: updateFlds }
    var resp = await PackageTracking.findOneAndUpdate(
          { _id: order.tracking_no},
          {
            $setOnInsert: { // only on insert
              date_created: moment().toDate(),
              created_by: senderID? senderID: 'admin'
            },
              $set: { // insert and update
                last_updated: moment().toDate(),
                updated_by: senderID? senderID: 'admin',
                carrier: order.carrier?order.carrier:undefined,
                ship_date: order.ship_date? order.ship_date:undefined,
                time_in_transit_from: order.time_in_transit_from? order.time_in_transit_from:undefined,
                time_in_transit_to: order.time_in_transit_to? order.time_in_transit_to:undefined,
                notes:order.notes? order.notes:undefined,
              }
          },
          {
            returnOriginal: false,
            new: true,
            upsert: true
        });

     if (debugOn) console.log(" ************** After update with upsert true package-tracking resp:",
     JSON.stringify(resp,null,2)
   );
     return resp;
  }
  export default updateOrInsert;
