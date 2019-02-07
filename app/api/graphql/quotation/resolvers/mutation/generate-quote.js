import Quotation from '/app/entry-points/server/models/quotation';

import {
  removeEmpty
} from '/app/api/graphql/utils'
import moment from 'moment';
const debugOn = true;

const errorOn = true;
// create or update purchase order)
//

async function genQuote(root, args, context) {

  console.log("=> in genQuote args:",args)
  return null;
}
export default genQuote;
