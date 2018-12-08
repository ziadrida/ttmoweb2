import {Counter} from '/app/entry-points/server/models/counter';

const debugOn = true;

removeEmpty = (obj) => {
    if (debugOn) console.log("removeEmpty in: ",obj)
    Object.keys(obj).forEach((key) => (obj[key] == null || obj[key]==undefined) && delete obj[key]);
     if (debugOn) console.log("removeEmpty out: ",obj)
     return obj;

 }

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
//getNextSeqVal,
  }
