
import  {User}  from '/app/entry-points/server/models/user';

const getUsers = async (root, args, context) => {
  console.log('=>resolver  getUsers args', args)
  //const { getUsers: usr } = context;

  // if (!usr || !usr._id) {
  //   return null;
  // }
  var queryStr = {}
  if (args.search) {
    queryStr = {
      "$or": [{
          "first_name": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
            "last_name": {
              "$regex": args.search,
              "$options": "i"
            }
          },
        {
          "name": {
            "$regex": args.search,
            "$options": "i"
          }
        }

      ]
    }
  } else {
    queryStr = {
      userId: args.userId
    }
  }
  // Query current logged in getUsers
  try {
    console.log('getUsers queryStr:',queryStr)
    const result = await User.find(queryStr).sort({"name":-1}).limit(50).exec();
    console.log("result.length:",result.length)
   //console.log("result:",JSON.stringify(result))
    return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getUsers;
