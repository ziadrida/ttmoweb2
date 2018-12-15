
import  VendorTracking  from '/app/entry-points/server/models/vendor-tracking';

const getVendorTracking = async (root, args, context) => {
  console.log('=>resolver  getVendorTracking args', args)
  //const { trackingOrder: usr } = context;

  // if (!usr || !usr._id) {
  //   return null;
  // }
  var queryStr = {}
  if (args.search) {
    queryStr = {
      "$or": [{
          "_id": {
            "$regex": args.search,
            "$options": "i"
          }
        },{
          "order_no": {
            "$regex": args.search,
            "$options": "i"
          }
        },{
          "tracking_no": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
            "box_id": {
              "$regex": args.search,
              "$options": "i"
            }
          },


      ]
    }
  } else {
    queryStr = {
      _id: args.po_no
    }
  }
  // Query current logged in trackingOrder
  try {
    console.log('vendorTracking queryStr:',queryStr)
    const result = await VendorTracking.findOne(queryStr).sort({"-id":-1}).limit(1).exec();
    console.log("result.length:",result.length)
   //console.log("result:",JSON.stringify(result))
    return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getVendorTracking;
