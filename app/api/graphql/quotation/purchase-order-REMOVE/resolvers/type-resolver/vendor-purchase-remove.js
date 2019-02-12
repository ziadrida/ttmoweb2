// type resolution for types within Quotation

import VendorPurchase  from '/app/entry-points/server/models/vendor-purchase';
//import {Quotation}  from '../../../../models';

//
const vendorPurchase =    async(purchaseOrder, // parent
                                 args, context ) => {
     if (purchaseOrder) console.log('in ==> vendorPurchase')
     if (purchaseOrder) console.log('parent:\n',purchaseOrder)
     try {

     const result = await VendorPurchase.find({po_no: purchaseOrder._id}).exec();

     console.log("vendorPurchase query result:",result.length)
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

 export default vendorPurchase
