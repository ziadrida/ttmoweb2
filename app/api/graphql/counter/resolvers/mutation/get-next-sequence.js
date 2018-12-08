import {Counter} from '/app/entry-points/server/models/counter';
//import {getNextSeqVal} from '/app/api/graphql/utils'
import {getNextSequenceValue} from '/app/api/graphql/utils'
const debugOn = true;

async function getNextSeq(root, args, context) {
  console.log("==> getNextSeq [1]", args)

//  console.log('context:', context)

  var name = args.counter.name
  return await getNextSequenceValue(name);

}

export default getNextSeq;
