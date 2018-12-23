import PurchaseOrder from '/app/entry-points/server/models/purchase-order';

import moment from 'moment';

import {
  getNextSequenceValue
} from '/app/api/graphql/utils'
import updateOrInsert from './helper';
const debugOn = true;

const errorOn = true;
// create or update purchase order)
//

async function cancelPurchaseOrder(root, args, context) {
  console.log('root:', root)
  console.log('args:', args)
  console.log('context:', context)
  var order = args.input;

  if (debugOn) console.log("=====>   in purchaseOrder - update or insert a new purchaseOrder:", JSON.stringify(order));

  var senderID = 'webadmin'

  // Peform a simple find and return one  documents

  if (!order._id || order._id != undefined)
    return null;

  order.last_updated = moment().toDate();
  order.updated_by = senderID ? senderID : 'admin'
  order.status = "cancelled";
  order.notes = order.notes? order.notes: "cancelled by "+senderID

  updateFlds = module.exports.removeEmpty(order)
  updateStr = { $set: updateFlds }
  var queryStr = ""
  queryStr = {
    _id: order._id
  }

  const doc = await PurchaseOrder.findOneAndUpdate(
    queryStr,
    updateStr,
   {
      sort: {
        _id: 1
      },
      returnOriginal: false,
      upsert: false
     });

  if (debugOn) console.log("purchaseOrder findOneAndUpdate doc:", doc);

    return doc;

}
