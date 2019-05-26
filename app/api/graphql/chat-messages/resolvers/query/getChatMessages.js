
import  {ChatMessages}  from '/app/entry-points/server/models/chat-messages';
//import {User} from '/app/entry-points/server/models/user'
import moment from 'moment';
const getChatMessages = async (root, args, context) => {
  //console.log('=>resolver  getChatMessages args', args)
  //const { quotation: usr } = context;

  // if (!usr || !usr._id) {
  //   return null;
  // }


  matchArray = []

  andOr = "$and"
  var searchField =  args.searchField;
  var searchTrim
  if (args.search &&  searchField && searchField!= '' && searchField != 'days_back' ) {

      searchTrim = args.search.trim()

     if (searchField == 'some-numeric-field') {
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
            "messageText": {
                "$regex": searchTrim,
                "$options": "i"
              }
            },
            {
              "messageAttachments": {
                "$regex": searchTrim,
                "$options": "i"
              }
            },
            {
              "phone_no": {
              "$regex": searchTrim,
              "$options": "i"
            }},
            {
              "name": {
              "$regex": searchTrim,
              "$option  s": "i"
            }
          },
            {
              "userId": searchTrim
            }


        ]
      })
    }
    if (args.userId)   matchArray.push (  {userId: args.userId })
    if (args.username)   matchArray.push (  {name: { $regex: args.username, $options: 'i' }  })
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
      dateFrom = moment().add(-7, 'days').toDate()
      dateTo = moment().add(1,'days').toDate()
    }
    //console.log("moment:", moment())
    //console.log("moment toDate:", moment().toDate())
    if (!dateFrom) dateFrom = moment(dateTo).add(-1, 'days').toDate()
    if (!dateTo) dateTo = moment(dateFrom).add(1, 'days').toDate()
  }
  //console.log("dateFrom:", dateFrom)
  //console.log("dateTo:", dateTo)
  matchArray.push({
    "dateCreated": {
      "$gte": dateFrom,
      "$lt": dateTo
    }
  })
  // end of duplicate code with all get query
        //   matchArray.push({
        //     "dateCreated.": {
        //       "$lt":  dateTo
        //     }
        // })

    andOr =andOr.toLowerCase()
    var queryStr ={}

    queryStr[andOr] = matchArray.length == 0? [{ _id : { $exists: true } }]:matchArray
  // Query current logged in quotation
  try {
    //console.log('getChatMessages queryStr:',JSON.stringify(queryStr))
    const curChatMessages = await ChatMessages.aggregate([
     {
       $lookup: {
         from: "users",
           localField:  "userId",
           foreignField: "userId",
         as: "users"
       }
     },
     {
       $unwind: { "path": "$users", "preserveNullAndEmptyArrays": true }
     },
     {
         $project: {
            _id:"$_id",
            userId:"$users.userId",
            is_echo:"$is_echo",
            senderId: "$senderId",

            recipientId: "recipientId",
            seq:"$seq",
            name:"$users.name",
            first_name: "$users.first_name",
            last_name:"$users.last_name",
            phone_no: "$user.phone_no",
            gender:"$users.gender",
            city:"$users.city",
            userDateCreated:"$users.dateCreated",
            messageText: "$messageText",
            messageAttachments: "$messageAttachments",
            timestamp: "$timestamp",
            dateCreated: "$dateCreated"
         }
     },
     {
         $match: queryStr
     },

     { $sort :    { dateCreated :  -1 } }
    ]).limit(200).exec()

   result = curChatMessages.map(row=> {
     // check shipping price
     row._id = row._id.toString();
     if (row.messageAttachments=="") row.messageAttachments = null
     else row.messageAttachments = JSON.stringify(row.messageAttachments,null,2)

        ////console.log('po_date:',row.po_date)
          return row
    })
    //console.log("result.length:",result.length)
////console.log("curChatMessages:",JSON.stringify(result))
    return result;
  } catch (exc) {
    //console.log(exc);
    return null;
  }
};

export default getChatMessages;
