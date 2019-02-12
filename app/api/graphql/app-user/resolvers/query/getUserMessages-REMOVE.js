
import  Quotation  from '/app/entry-points/server/models/quotation';

const getQuotation = async (root, args, context) => {
  console.log('=>resolver  getQuotation args', args)
  //const { quotation: usr } = context;

  // if (!usr || !usr._id) {
  //   return null;
  // }
  var queryStr = {}
  if (args.search) {
    queryStr = {
      "$or": [{
          "quotation.sales_person": {
            "$regex": args.search,
            "$options": "i"
          }
        },{
          "quotation.item.username": {
            "$regex": args.search,
            "$options": "i"
          }
        },{
          "quotation.item.MPN": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
            "quotation.item.asin": {
              "$regex": args.search,
              "$options": "i"
            }
          },
        {
          "quotation.item.title": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "quotation.item.category": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "quotation.po_no": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "quotation.item.source": {
            "$regex": args.search,
            "$options": "i"
          }
        }

      ]
    }
  } else {
    queryStr = {
      quote_no: args.quote_no
    }
  }
  // Query current logged in quotation
  try {
    console.log('getQuotation queryStr:',queryStr)
    const curQuotation = await Quotation.find(queryStr,{'quotation.price':0}).sort({"quote_no":-1}).limit(100).exec();
    console.log("curQuotation.length:",curQuotation.length)
   //console.log("curQuotation:",JSON.stringify(curQuotation))
    return curQuotation;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getQuotation;
