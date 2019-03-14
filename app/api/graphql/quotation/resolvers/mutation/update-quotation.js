import Quotation from '/app/entry-points/server/models/quotation';

import {
  removeEmpty,
  removeNull
} from '/app/api/graphql/utils'
import moment from 'moment';
const debugOn = true;

const errorOn = true;
// create or update purchase updateObj)
//

async function updateQuotation(root, args, context) {

  console.log("=> in <updateQuotation> args:", JSON.stringify(args, 2, null))
  //console.log('root:', root)
  //  console.log('args:', args)
  //console.log('context:', context)

  //if (debugOn) console.log("=> in updateQuotation:", JSON.stringify(args.input));
  //  console.log("  context.user.profile.name:",context&& context.user&&context.user.profile&&
  //        context.user.profile.name)
  var updated_by = context.user && context.user.profile && context.user.profile.name ?
    context.user.profile.name : 'wedadmin';

  // Peform a simple find and return one  documents
  var result = {}
  if (!args.input.quote_no || typeof args.input.quote_no == 'undefined') {

    console.log("<updateQuotation> error with quote_no")

    throw new Error("Quotation# is required")
  }

  if (args.input.userInfo== null) {
      throw new Error("Internal error: Missing user Information")
  } else if (args.input.userInfo.username == null) {
      throw new Error("Username is required")
  } else if (args.input.userInfo.userId == null) {
      throw new Error("userId is required")
  } else if (args.input.senderId == null ){
      throw new Error("senderId is required")
  }


  if (args.input.quotation == null) {
      throw new Error("Internal error: Missing quotation information")
  } else if (args.input.quotation.item == null) {
      throw new Error("Internal error: Missing item information")
  } else if (args.input.quotation.prices  == null) {
      throw new Error("Internal error: Missing prices information")
  } else if (args.input.quotation.price_selection  == null ||args.input.quotation.price_selection =='' ) {
      throw new Error("Internal error: Invalid price selection ",args.input.quotation.price_selection?args.input.quotation.price_selection:'none!')
  } else if (args.input.quotation.prices[args.input.quotation.price_selection]  == null ||
      args.input.quotation.prices[args.input.quotation.price_selection] === undefined ) {
      throw new Error("Internal error: No price found for price selection ",
        args.input.quotation.price_selection?args.input.quotation.price_selection:'none!')
  }

 console.log("<updateQuotation> validation complete. continue...")
  // set update fields
  var updateObj = {}


  var queryStr = ""
  queryStr = {
    quote_no: args.input.quote_no
  }
  console.log('<updateQuotation> queryStr:', queryStr)
  var existingQuote = await Quotation.findOne(queryStr);

  console.log("<updateQuotation> existingQuote:",existingQuote)
  if (!existingQuote) {
    throw new Error("Could not find quotation#"+ args.input.quote_no)
  } else {
    try {
      console.log("existingQuote _id:",existingQuote._id)
      updateObj = {};
      queryStr = {
        quote_no: existingQuote.quote_no
      }

      //delete updateObj._id
      //console.log("updateObj after delete _id => _id:",updateObj._id)
    //  updateObj._id = null;
      updateObj.quote_no = args.input.quote_no;

      console.log("<updateQuotation> Found Quote#")
      updateObj.last_updated_by = updated_by? updated_by:'webadmin';
      updateObj.last_updated = moment().toDate();
      //updateObj._id = existingQuote._id;
      updateObj.senderId = args.input.senderId;

      updateObj.username =  args.input.userInfo.username;
      //updateObj.phone_no = args.input.userInfo? args.input.userInfo.phone_no:null;
      updateObj.sales_person = args.input.sales_person;

      var inQuoteObj = args.input.quotation;
      inQuoteObj.quote_date = moment().toDate();
      // inQuoteObj.active = args.input.active!=null ?args.input.active:null;
      // inQuoteObj.final = args.input.final != null ?args.input.final:null;
      //console.log('<updateQuotation> inQuoteObj:',inQuoteObj)
      updateObj.quotation = inQuoteObj;

      removeNull(updateObj);
      console.log("<updateQuotation> set updateObj :", JSON.stringify(updateObj))
    } catch (err) {
      console.log("<updateQuotation> Error setting updateObj: ", err)
      throw new Error("Internal error while setting quotation informaiton")
    }


    updateStr = {
      $set: updateObj
    }
    console.log('<updateQuotation> queryStr:', queryStr)
    console.log('<updateQuotation> updateStr:', JSON.stringify(updateStr))

     var doc = await Quotation.findOneAndUpdate(
          queryStr,
          updateStr,
          {  new: true, upsert: false }
      ); //.then(doc => {

      if (debugOn) console.log("Quotation findOneAndUpdate doc:", JSON.stringify(doc));
      if (doc) {
            //result = doc;
            result = {}
            result.quote_no = doc.quote_no;
            // result._id = doc._id;
            result.message = "Quotation saved successfully"

            console.log("<updateQuotation> success result:", result)
            return result;
        } else {
            result = {}
            result.quote_no = doc.quote_no;
            result.message = "Severe Internal error trying to save quotation"
            //return result;
            throw new Error("Severe Internal error trying to save quotation")
          //  return  result

          }

      // }).catch(err => {
      //     console.log('err',err)
      //     console.log("Error after findOneAndUpdate ",err)
      //     result = {}
      //     result.quote_no = doc.quote_no;
      //     result.message = "Severe Internal error trying to save quotation. Error:"+err
      //     reject(result);
      //
      // })

  }
}
export default updateQuotation;
