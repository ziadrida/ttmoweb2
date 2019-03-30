
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
      "userId": args.userId
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
   var i=0;
   resp = result.map(u=> {
     i++
     if (i<3) console.log('user:',JSON.stringify(u))
     if (u.userId == null) u.userId="-99"

     if (u.name == null) u.name="unkown"
     console.log('u.profile:',u.profile)
      console.log('u.emails:',u.emails)
      console.log('u.emails $:',u.emails['$'])

      console.log('u.roles:',u.roles)

      console.log('u.subscriptions:',u.subscriptions)
      console.log('u.subscriptions $:',u.subscriptions.$ && Object.keys(u.subscriptions.$.keys)  )
     if (u.profile == null || !Object.keys(u.profile).length) {
       console.log("profile is null")
       u.profile = {
         name: u.name,
         avatar: '',
      }
    } else {
      console.log('u.profile exists and not null')
    }
    if (u.username == null) u.username = u.profile.name;
    
      if (u.emails ==null || (u.emails.$ && !Object.keys(u.emails.$).length )) {
        u.emails = []
        if (u.email)  u.emails.push(u.email)
      }
      if (u.roles == null ||!Object.keys(u.roles).length) {
        u.roles = []
        if (u.role)  u.roles.push(u.role)
      }
      if (u.subscriptions==null || (u.subscriptions.$ && !Object.keys(u.subscriptions.$.keys).length)) {
        u.subscriptions = []
      }

     if (i<3)console.log('out user:',JSON.stringify(u))
     return u;
   })
    return resp;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getUsers;
