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

  //console.log("=> in <updateQuotation> args:", JSON.stringify(args, 2, null))
  if (debugOn) console.log("=> in updateQuotation:", JSON.stringify(args.input));
  //console.log('root:', root)
  //  console.log('args:', args)
  //console.log('context:', context)


   console.log("  context.user.profile.name:",context&& context.user&&JSON.stringify(context.user))

  var updated_by = context.user && context.user.profile && context.user.profile.name ?
    context.user.profile.name : 'wedadmin';
    console.log("sales_person:",context.user && context.user.sales_person)
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
  } else if (isNaN(args.input.last_updated)) {
      throw new Error("Internal error: Missing valid last_updated date. last_updated:",args.input.last_updated)
  }  else if (args.input.quotation.prices  == null  ) {
      console.log("no prices object")
    //  throw new Error("Internal error: Missing prices object")
  } else if (args.input.quotation.price_selection  == null ||args.input.quotation.price_selection =='' ) {
      console.log("no price selection ")
    //  throw new Error("Internal error: Invalid price selection ",args.input.quotation.price_selection?args.input.quotation.price_selection:'none!')
  } else if (args.input.quotation.prices[args.input.quotation.price_selection]  == null ||
      args.input.quotation.prices[args.input.quotation.price_selection] === undefined ) {
      console.log("no price_selection")
      // throw new Error("Internal error: No price found for price selection ",
      //   args.input.quotation.price_selection?args.input.quotation.price_selection:'none!')
  }

  console.log("<updateQuotation> validation complete. continue... ")
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

      console.log("existingQuote _id:",existingQuote._id)
      console.log("<updateQuotation> Found Quote#")
      console.log("existingQuote.last_updated:",moment(existingQuote.last_updated))
        console.log("moment(parseInt(args.input.last_updated)):",moment(parseInt(args.input.last_updated)))
      if (existingQuote.last_updated !=null && !moment(existingQuote.last_updated).isSame(moment(parseInt(args.input.last_updated)), 'second'))  {
          throw new Error("Quotation was modified by someone else." +
            (existingQuote.last_updated_by? " {"+ existingQuote.last_updated_by + "}":""))
      } else {
        console.log('Last updated is the same. No one changed it')
      }
    try {
      updateObj = {};
      queryStr = {
        quote_no: existingQuote.quote_no
      }
      updateObj.quote_no = args.input.quote_no;
      updateObj.last_updated_by = updated_by? updated_by:'webadmin';
      updateObj.last_updated = args.input.last_updated != null && moment(parseInt(args.input.last_updated)).isValid?
        moment(parseInt(args.input.last_updated)): moment().toDate();
      //updateObj._id = existingQuote._id;
      updateObj.senderId = args.input.senderId;

      updateObj.username =  args.input.userInfo.username;
      console.log("updateObj.username:",updateObj.username)
      //updateObj.phone_no = args.input.userInfo? args.input.userInfo.phone_no:null;
      updateObj.sales_person = context.user && context.user.sales_person;

      var inQuoteObj = args.input.quotation;
      if (inQuoteObj) {
        inQuoteObj.quote_date = moment().toDate();
          inQuoteObj.ownerId = args.input.userInfo.userId;

        //console.log('<updateQuotation> inQuoteObj:',inQuoteObj)
        updateObj.quotation = inQuoteObj;
        if (inQuoteObj.deleted!=null && inQuoteObj.deleted) {
          inQuoteObj.active = false;
        }
      } else {
        console.log("inQuoteObj is NULL")
      }
      console.log("arg deleted?:",args.input.quotation.deleted)
      console.log("updateObj deleted?:",updateObj.quotation.deleted)

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

          //  });
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
