
// update or insert a new arrivedAtOrigin
  function arrivedAtOrigin(senderID, order, callback) {
    if (debugOn) console.log('['+eventCount+']'+"=====>   in arrivedAtOrigin - update or insert a new arrivedAtOrigin:", JSON.stringify(order));
    order.message = undefined
    // Peform a simple find and return one  documents


      if (err) {
        order.message = "Error connecting to DB:"+JSON.stringify(err,null,2)
        return callback(order);
      } else {
      if ( (order._id && order._id != undefined )  // only  id for update
            ) { // these are required for creation

          updateOrInsert(order,function(resp) {
            if (debugOn) console.log('['+eventCount+']'+">>>>>>>>>>>>> after updateOrInsert arrivedAtOrigin resp: ",resp)

              return callback(order);
          });

      } else {
        order.message = "For arriving shipment, you need po_no and tracking_no. For updates, at least ship_id is required "
          return callback(order);
      }
    }


  updateOrInsert = function(order,callback)   {
    if (debugOn) console.log('['+eventCount+']'+">>>>>>>>>>>>> in arrivedAtOrigin->updateOrInsert  ")

    order.last_updated = moment().toDate();
    order.updated_by =  senderID? senderID: 'admin'
    updateFlds = module.exports.removeEmpty(order)
  var queryStr = ""
    updateStr = { $set: updateFlds }
    queryStr = order._id?  { _id: order._id }: { _id: "" }
      if (debugOn) console.log('['+eventCount+']'+"queryStr:",queryStr)
//{ $or: [ {_id: order.ship_id}, {order_no: order.po_no, tracking: order.tracking_no} ]},
    _db.collection('package_tracking').findOneAndUpdate(
       queryStr,
       updateStr
    //, {  $set: {status: order.status, status_updated: statusChangeDate} }
    , {
          //  projection: { _id:1, tracking:1,date_received:1,weight:1}
           sort: {_id:1}
          , returnOriginal: false
        }
    , function(err, docs) {
      if (err) {
        if (errorOn) console.log('['+eventCount+']'+" +++++==== findOneAndUpdate ERROR! err:",JSON.stringify(err,null,2))
        order.message = JSON.stringify(err,null,2);
        return callback(null)
      } else {
        if (debugOn) console.log('['+eventCount+']'+"&&&& arrivedAtOrigin findOneAndUpdate __docs found and updated:", docs);
     if (docs.lastErrorObject && docs.lastErrorObject.n >0 ) {
       if (debugOn) console.log('['+eventCount+']'+"arrivedAtOrigin updated existing record");
         order.message = "facility_tracking updated \n:"+JSON.stringify(docs.value,null,2)
       return callback(docs)
     } else {
          if (debugOn) console.log('['+eventCount+']'+"arrivedAtOrigin doscs NOT found.")
         order.message = "tracking_no supplied is not valid. Verify tracking_no and try again "
         return callback(docs);


  /*
        //add new TRACKING AND BOX_ID map (noooo)

            var newDoc = order;
        newDoc.date_created =  moment().toDate()
        newDoc.created_by =  senderID? senderID: 'admin'
        newDoc.last_updated = moment().toDate()
        newDoc.updated_by =  senderID? senderID: 'admin'
        //newDoc.closed = false
        //newDoc.status = order.status? order.status:"NEW"


         if (debugOn) console.log('['+eventCount+']'+" ************** Insert new arrival info:");
        _db.collection('package_tracking').insertOne(newDoc, function(err, result) {
          // assert.equal(err, null);
          if (debugOn) console.log('['+eventCount+']'+"<><> arrivedAtOrigin - After insertOne tracking")
          if (err) {
              if (debugOn) console.log('['+eventCount+']'+"arrivedAtOrigin - Error inserting new tracking info err:",err);
            if (debugOn) console.log('['+eventCount+']'+"arrivedAtOrigin - Error inserting new tracking info newDoc:",newDoc);
              order.message = "error updating arrivedAtOrigin: " + JSON.stringify(err,null,2);
            return callback(null)
          } else {
          if (debugOn) console.log('['+eventCount+']'+"Inserted a document into the arrivedAtOrigin table, result:",JSON.stringify(result));
          if (debugOn) console.log('['+eventCount+']'+"**** New facility_tracking");
          order.message = "new facility_tracking  created. \n" + JSON.stringify(newDoc,null,2);
          return callback(newDoc);
        }
        });
*/
   }
   }
    });
  }
} // arrivedAtOrigin
export default updateTracking
