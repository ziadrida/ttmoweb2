import Quotation from '/app/entry-points/server/models/quotation';
import moment from 'moment';

const getQuotation = async(root, args, context) => {
  console.log('=>resolver  getQuotation args', args)
  matchArray = []
  andOr = "$and"

  try {

  if (args.search) {
    var searchTrim = args.search.trim()
    matchArray.push({
      "$or": [{
          "quotation.sales_person": {
            "$regex": args.search,
            "$options": "i"
          }
        }, {
          "quotation.item.username": {
            "$regex": args.search,
            "$options": "i"
          }
        }, {
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
    })
  }
  console.log("check other args")
  if (args.quote_no && args.quote_no != 0) matchArray.push({
    quote_no: {
      $regex: args.quote_no,
      $options: 'i'
    }
  })
  console.log("matchArray1:",matchArray)
  var dateFrom = null;
  var dateTo = null;
  if (args.dateFrom) dateFrom = moment(args.dateFrom).toDate()
  if (args.dateTo) dateTo = moment(args.dateTo).toDate()

  if (!dateFrom && !dateTo) {
    //  const today = moment().startOf('day')
    dateFrom = moment().add(-1, 'days').toDate()
    dateTo = moment().toDate()
  }
  console.log("moment:", moment())
  console.log("moment toDate:", moment().toDate())
  if (!dateFrom) dateFrom = moment(dateTo).add(-1, 'days').toDate()
  if (!dateTo) dateTo = moment(dateFrom).add(1, 'days').toDate()

  console.log("dateFrom:", dateFrom)
  console.log("new Date(dateFrom):", new Date(dateFrom))
  matchArray.push({
    "date_created": {
      "$gte": dateFrom,
      "$lt": dateTo
    }
  })
  // Query current logged in quotation
  andOr = andOr.toLowerCase()

  var queryStr ={}
  queryStr[andOr] = matchArray.length == 0 ? [{
    _id: {
      $exists: true
    }
  }] : matchArray
}
 catch(err) {
   console.log("error setting query err:",err)
 }
  try {
    console.log('getQuotation queryStr:', JSON.stringify(queryStr))

    const curQuotation = await Quotation.find(queryStr, {
      'quotation.price': 0
    }).sort({
      "quote_no": -1
    }).limit(200).exec();
    console.log("curQuotation.length:", curQuotation.length)
    console.log("curQuotation:", JSON.stringify(curQuotation))
    return curQuotation;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getQuotation;
