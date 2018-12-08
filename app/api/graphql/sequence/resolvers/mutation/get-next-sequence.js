import Sequence from '/app/entry-points/server/models/counters';
import {getNextSequenceValue} from '/app/api/graphql/utils'

const debugOn = true;

async function getNextSeq(root, args, context) {
  console.log("==> getNextSeq ", args)


  name = args.counter.name
  return await getNextSeq(name);
}

export default getNextSeq;
