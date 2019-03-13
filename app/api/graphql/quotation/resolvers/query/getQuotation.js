import Quotation from '/app/entry-points/server/models/quotation';
import moment from 'moment';

const getQuotation = async(root, args, context) => {
  console.log('=>resolver  <getQuotation> args', args)
  matchArray = []
  andOr = "$and"
    var searchField;
     searchField=  args.searchField
    var searchTrim
  try {
    if (args.search && searchField && searchField!= '' && searchField != 'days_back' ) {

        searchTrim = args.search.trim()

       if (searchField == 'quote_no') {
         matchArray.push({
           "$or": [{
               [searchField]: parseInt(searchTrim)
             }]
           })
       } else {
       matchArray.push({
         "$or": [{
             [searchField]: {
               "$regex": searchTrim,
               "$options": "i"
             }
           }]
         })
       }
    }
  if (args.search && (searchField == null || searchField == '' || searchField == 'all')) {
     searchTrim = args.search.trim()
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
    quote_no:  args.quote_no
  })
  console.log("matchArray1:",matchArray)
  // start of duplicate code with all get query
  var dateTo = null;
    var dateFrom = null;
  if (args.searchField == 'days_back' && args.search != null  ) {
    searchTrim = args.search.trim();
    days_back = isNaN(searchTrim)? 1:parseFloat(searchTrim);
    dateFrom = moment().add(-1*days_back,'day').toDate()
    dateTo = moment().add(1,'day').toDate();
  } else {

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
}
console.log("dateFrom:", dateFrom)
console.log("dateTo:", dateTo)
matchArray.push({
  "date_created": {
    "$gte": dateFrom,
    "$lt": dateTo
  }
})
  // end of duplicate code with all get query
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
    //if (curQuotation &&   curQuotation.length>0) console.log("curQuotation:", JSON.stringify(curQuotation[0]))
    return curQuotation;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getQuotation;
