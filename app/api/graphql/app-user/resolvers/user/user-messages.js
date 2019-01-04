// type resolution for types within Quotation

import {User}  from '/app/entry-points/server/models/user';
//import {Quotation}  from '../../../../models';

const user =    async(quotation,args, context ) => {
     if (quotation) console.log('quotation=>:',quotation)
     if (quotation) console.log('quotation===>>:',quotation.senderId)
     try {
       console.log('server user:',User)
     const result = await User.findOne({userId: quotation.senderId}).exec();

     console.log("query result:",result)
     return result
   } catch(exc) {
     console.log(exc)
     return null;
   }

     //  map() method creates a new array with the results of calling a function for every array element.
     // return result.map((x) => {
     //   // convert every array element's _id to string
     //   x._id = x._id.toString();
     //   return x;
     // });
   }

 export default user
