
import  PackageTracking  from '/app/entry-points/server/models/package-tracking';

const getPackageTracking = async (root, args, context) => {
  console.log('=>resolver  getPackageTracking args', args)
  //const { trackingOrder: usr } = context;

  // if (!usr || !usr._id) {
  //   return null;
  // }
  var queryStr = {}
  if (args.search) {
    // NOT USED
    queryStr = {
      "$or": [{
          "_id": {
            "$regex": args._id,
            "$options": "i"
          }
        }
      ]
    }
  } else {
    queryStr = {
      _id: args._id
    }
  }
  // Query current logged in trackingOrder
  try {
    console.log('PackageTracking queryStr:',queryStr)
    const result = await PackageTracking.findOne(queryStr).exec();
    console.log("result.length:",result && result.length)
    console.log("result:",JSON.stringify(result))
    return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getPackageTracking;
