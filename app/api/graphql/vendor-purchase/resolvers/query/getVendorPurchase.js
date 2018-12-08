
import  VendorPurchase  from '/app/entry-points/server/models/vendor-purchase';

const getVendorPurchase = async (root, args, context) => {
  console.log('=>resolver  getVendorPurchase args', args)
  //const { purchaseOrder: usr } = context;

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
          "username": {
            "$regex": args.search,
            "$options": "i"
          }
        },{
          "phone_no": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
            "link": {
              "$regex": args.search,
              "$options": "i"
            }
          },
        {
          "title": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "item.category": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "category": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "status": {
            "$regex": args.search,
            "$options": "i"
          }
        }

      ]
    }
  } else {
    queryStr = {
      _id: args.po_no
    }
  }
  // Query current logged in purchaseOrder
  try {
    console.log('purchaseOrder queryStr:',queryStr)
    const result = await VendorPurchase.findOne(queryStr).sort({"-id":-1}).limit(1).exec();
    console.log("result.length:",result.length)
   //console.log("result:",JSON.stringify(result))
    return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getVendorPurchase;
