
import  Category  from '/app/entry-points/server/models/category';

  const getCategories = async (root, args, context) => {
  console.log('=>resolver  getCategories args', args)
  //const { Category: usr } = context;

  // if (!usr || !usr._id) {
  //   return null;
  // }
  var queryStr = {}
  if (args.search) {
    queryStr = {
      "$or": [{
          "category_name": {
            "$regex": args.search,
            "$options": "i"
          }
        },{
          "category_name_ar": {
            "$regex": args.search,
            "$options": "i"
          }
        },


      ]
    }
  } else {
    queryStr = {
      "category_name": {
        "$regex": args.category_name? args.category_name:"",
        "$options": "i"
      }
    }
  }
  // Query current logged in Category
  try {
    console.log('Category queryStr:',queryStr)
    const result = await Category.find(queryStr).sort({"category_name":-1}).limit(200).exec();

    console.log("result.length:",result && result.length)
   //console.log("result:",JSON.stringify(result))
    return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getCategories;
