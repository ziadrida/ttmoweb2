const {scraper} = require('./smart-product-scraper');

const debugOn = true;
const errorOn = true;

async function productScraper(root, args, context) {

  console.log("=> in <productScraper> args:", JSON.stringify(args))
//  console.log("Location:",location , " location.search:", location && location.search);
  //console.log('root:', root)
  //  console.log('args:', args)
  //console.log('context:', context)

  //if (debugOn) console.log("=> in productScraper:", JSON.stringify(args.input));
  //  console.log("  context.user.profile.name:",context&& context.user&&context.user.profile&&
  //        context.user.profile.name)
  var updated_by = context.user && context.user.profile && context.user.profile.name ?
    context.user.profile.name : 'wedadmin';

  // Peform a simple find and return one  documents
  var result = {}
  if (!args.url || typeof args.url == 'undefined') {
    console.log("<productScraper> error with url")
    throw new Error("URL is required")
  }

  console.log("<productScraper> URL:",  args.url)
  try {
      console.log("<productScraper> Call scraper:")
     var res = await scraper(args.url.trim());//, function(data) {
        console.log("*** <update-quote> After callback from scraper.init")
        console.log("<update-quote> scrapped data :",res);

//        r={ title: 'Universal Perforated Edge Writing Pad, Legal Ruled, Letter, White, 50 Sheet, Dozen',
// price: '9',
// image: 'https://i5.walmartimages.com/asr/bc368ed5-c1cf-4156-b331-e30ed35d3ff7_1.222f7bd63443d4081658d2e1593bb8f4.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
// brand: 'Universal',
// price_fraction: '89',
// priceUSD: '$',
// url: 'http://www.walmart.com/ip/Universal-Perforated-Edge-Writing-Pad-Legal-Ruled-Letter-White-50-Sheet-Dozen/15066119'
// }
  //.then(res => {
    if (res) {
      if (res.title) {
        result.title = res.title;
      }
      if (res.image) {
        result.thumbnailImage = res.image;
      }
      // var price=-1;
      // var sale_price=-1;
      //
      //
      //
      // if (res.price || res.sale_price) {
      //    price =  res.price? res.price.match(/\d+(?:\.\d+)?/):9999999999;
      //    sale_price  =  res.sale_price? res.sale_price.match(/\d+(?:\.\d+)?/):9999999999;
      //    price = Math.min(price,sale_price)
      //   console.log("price:",price)
      //   result.price = parseFloat(price) +
      //     parseFloat(res.price_fraction? res.price.match(/\d+(?:\.\d+)?/):0)/100;
      // }
      if (res.price) {
        result.price = res.price
      } else result.price = -1;
      if (res.site) {
        result.domain = res.site;
      }

      result.shipping = 0;
      if (res.shipping  ) {
        console.log("shipping:",res.shipping)
        if (String(res.shipping).match('/Free shipping/gi')) {
          result.shipping = 0;
        } else {
          result.shipping = res.shipping;
        }
      }
      if (res.category ) {
          result.category = res.category ;
      }

      if (res.dimensions ) {
          result.dimensions = res.dimensions ;
      }
      if (res.weight && !isNaN(res.weight)) {
          result.weight = parseFloat(res.weight) ;
      }
      result.options = res.options;
      result.condition = res.condition;

      result.message = "Got product data"
      return result;
    } else {
      result.message = "Could not get product data"

      console.log("Could not get product data")

      return result;
    }
  } catch (err) {
    console.log("Err", err);
    console.log("error After call to scraper")

    result.message = "Internal Error in scraper. " + err
    return result;
  }
}

export default productScraper;
