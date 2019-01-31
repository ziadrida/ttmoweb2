
import  PurchaseOrder  from '/app/entry-points/server/models/purchase-order';

const getPurchaseOrder = async (root, args, context) => {
  console.log('=>resolver  getPurchaseOrder args', args)
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
      _id: args.poNo
    }
  }
  // Query current logged in purchaseOrder
  try {
    console.log('purchaseOrder queryStr:',queryStr)
    const result = await PurchaseOrder.findOne(queryStr).sort({"-id":-1}).limit(1).exec();

    console.log("result.length:",result && result.length)
   //console.log("result:",JSON.stringify(result))
    return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getPurchaseOrder;
