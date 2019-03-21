import Quotation from '/app/entry-points/server/models/quotation';
import axios from 'axios';

import {
  removeEmpty,
  removeNull
} from '/app/api/graphql/utils'
import moment from 'moment';
const debugOn = true;

const errorOn = true;
// create or update purchase updateObj)
//

async function sendFBQuoteAction(root, args, context) {

  console.log("=> in <sendFBQuoteAction> args:", JSON.stringify(args))
  //console.log('root:', root)
  //  console.log('args:', args)
  //console.log('context:', context)

  //if (debugOn) console.log("=> in sendFBQuoteAction:", JSON.stringify(args.input));
  //  console.log("  context.user.profile.name:",context&& context.user&&context.user.profile&&
  //        context.user.profile.name)
  var updated_by = context.user && context.user.profile && context.user.profile.name ?
    context.user.profile.name : 'wedadmin';

  // Peform a simple find and return one  documents
  var result = {}
  if (!args.action) {
    throw new Error("Internal error. Action required")
  }

  if (!args.input.quote_no || typeof args.input.quote_no == 'undefined') {

    console.log("<sendFBQuoteAction> error with quote_no")

    throw new Error("Quotation# is required")
  } else if (!args.input.senderId || typeof args.input.senderId == 'undefined') {

    console.log("<sendFBQuoteAction> error with senderId")

    throw new Error("User Id  is required")
  }
  var quoteMsgPayload;
  if (args.action == "sendQuotation") {
    quoteMsgPayload = {
      "object": "page",
      "entry": [{
        "id": "",
        "time": new Date().getTime(),
        "messaging": [{
          "sender": {
            "id": "1669687099731063"
          },
          "recipient": {
            "id": "243919968953836"
          },
          "timestamp": 0,
          "message": {
            "mid": "-",
            "seq": 0,
            "text": "{ \"action\": \"*quote\", \"quote_no\":" + args.input.quote_no + ", \"userId\": \"" + args.input.senderId + "\" }",
            "nlp": {
              "entities": {}
            }
          }
        }]
      }]
    }
  } // sendQuotation
  else if (args.action == 'sendMessage') {

    var payload = {
              action: "forward",
              userId:args.input.senderId,
              text: args.input.text,
              quote_no: args.input.quote_no?args.input.quote_no:null
            } //,quotation: payloadMsg.quotation}
    payloadStr = JSON.stringify(payload)
    quoteMsgPayload = {
      "object": "page",
      "entry": [{
        "id": "",
        "time": new Date().getTime(),
        "messaging": [{
          "recipient": {
            "id": "243919968953836"
          },
          "timestamp": new Date().getTime(),
          "sender": {
            "id": args.input.senderId
          },
          "postback": {
            "payload": payloadStr
          }
        }]
      }]
    }

  }


  console.log("'<handleSendQuotation> <QuoteForm> quoteMsgPayload:", JSON.stringify(quoteMsgPayload))
  try {
    const res = axios.post('https://protected-thicket-49120.herokuapp.com/webhook', quoteMsgPayload)
    //.then(res => {
    if (res) {
      console.log("Result from call to axios.post")
      // console.log("<handleSendQuotation> <QuoteForm> res:",res);
      console.log("<handleSendQuotation> <QuoteForm> success from axios.post => res.status:", res);
      result.status = 200
      result.message = "Action complete"
      return result;
    } else {
      //  .catch(function (error) {
      // handle error

      console.log("no res After call to axios.post")
      result.status = -1
      result.message = "Internal Error during send request"
      return result;
    }
  } catch (err) {
    console.log("Err", err);
    console.log("error After call to axios.post")
    result.status = -1
    result.message = "Internal Error during send request. " + err
    return result;
  }



}
export default sendFBQuoteAction;
/*

 {"object":"page","entry":[{"id":"243919968953836",
 "time":1553067705574,
 "messaging":[{"recipient":{"id":"243919968953836"},"timestamp":1553067705574,
 "sender":{"id":"1669687099731063"},
 "postback":{"payload":"{\"action\":\"showCart\"}","title":"Show Cart🛒"}}]}]}

 {"object":"page","entry":[{"id":"243919968953836",
 "time":1553068056746,
 "messaging":
 [{"sender":{"id":"1669687099731063"},"recipient":{"id":"243919968953836"},"timestamp":1553068055766,
"message":{"mid":"wHBCFpIqNWexzb5QifsO8MZ-5V5yo7LgwWR474_6cQ-ULhVXqdsKAtSLaKPbS_OjclRCzaJjUkRTpz2_Q07NQg",
"seq":141072,"text":"hello there",
"nlp":{"entities":
 {"greetings_ar":[{"suggested":true,"confidence":0.41031232418062,"value":"hello there","type":"value"}]}}}}]}]}
 */
