
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
        },
        {
          "userId": {
            "$regex": args.search,
            "$options": "i"
          }
        },
        {
          "phone_no": {
            "$regex": args.search,
            "$options": "i"
          }
        }

      ]
    }
  } else if (args.userId !=null ) {

      queryStr = {
      "userId": {
        "$regex": args.userId,
        "$options": "i"
      }
    }
  } else if  (args.username !=null ) {

      queryStr = {
      "name": {
        "$regex": args.username,
        "$options": "i"
      }
    }
  }
  // Query current logged in getUsers
  var resp;
  try {
    console.log('getUsers queryStr:',queryStr)
    const result = await User.find(queryStr).sort({name:1}).limit(10).exec();
    console.log("result.length:",result.length)
   //console.log("result:",JSON.stringify(result))
   resp = result.map(u=> {
     if (u.userId == null) u.userId="-99"
     if (u.name == null) u.name="unkown"
     return u;
   })
    return resp;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getUsers;
