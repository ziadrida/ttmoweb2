import {Counter} from '/app/entry-points/server/models/counter';

const debugOn = true;

removeEmpty = (obj) => {
  //  if (debugOn) console.log("removeEmpty in: ",obj)
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key]==undefined) && delete obj[key]);
  if (debugOn) console.log("removeEmpty out: ",obj)
     return obj;

 }
function removeNull(obj){
  var isArray = obj instanceof Array;
  for (var k in obj){

  //  console.log("k=",k, '=>' ,"obj[k]=",obj[k])
    if (obj[k]===null || obj[k]=== undefined) isArray ? obj.splice(k,1) : delete obj[k];
    else if (typeof obj[k]=="object") removeNull(obj[k]);
    //else   console.log("Nothing! typeof", typeof obj[k]);
  }
}
//  removeEmpty = (o) =>  {
//   for (var k in o) {
//     if (!o[k] || typeof o[k] !== "object") {
//       continue // If null or not an object, skip to the next iteration
//     }
//
//     // The property is an object
//     removeEmpty(o[k]); // <-- Make a recursive call on the nested object
//     if (Object.keys(o[k]).length === 0) {
//       delete o[k]; // The object had no properties, so delete that property
//     }
//   }
// }

 // async function getNextSeqVal(name) {
 //   console.log('==>getNextSeqVal:',name)
 //   // find the Sequence and timestamp
 //   // then loop until able to update
 //   result = await Counter.find({_id:name});
 //   console.log('counter result:',result)
 //   updated = await Counter.update({_id:name, lastUpdated: result.lastUpdated},
 //      {_id: name,
 //      lastUpdated: new Date(),
 //      sequence: result.sequence + 1
 //     }  );
 //     console.log('updated:',updated)
 //     return updated.sequence;
 //   }



 async function getNextSequenceValue (name) {
   console.log('==>getNextSequenceValue[2]:',name)

   result = await Counter.findOneAndUpdate(
     {  '_id': name},
     { $inc: {sequence: 1}},
     {
      new: true,
      upsert: true
    })
    //console.log("after findOneAndUpdate=====> sequence :", result)
    console.log("after findOneAndUpdate=====> sequence:[3]", result.value.sequence)
    return result && result.value? result.value.sequence: -1;

  }

  export {
    getNextSequenceValue,
    removeEmpty,
    removeNull,
//getNextSeqVal,
  }
