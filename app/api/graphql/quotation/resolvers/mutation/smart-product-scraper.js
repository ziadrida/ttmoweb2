const  Xray = require('x-ray');
const {xRayChrome} = require('./x-ray-chrome');
//import URL from 'url-parse';
'use strict';
//import URL from 'url-parse';
var parse = require('url-parse')

//const puppeteer = require('puppeteer');
	const xDelay = Xray().delay('1s','10s')

	const site_map = {
		'www.ebay.com': 'ebay',
		'www.aliexpress.com': 'aliexpress',
		'ar.aliexpress.com': 'aliexpress',
		'www.amazon.com': 'amazon',
		'www.walmart.com': 'walmart',
	}

 const sites = {
	 ebay: {
		 initialized: false,
		 setup:async (page) => {
			 console.log("setup ebay")
				try {
				//await page.screenshot({ path: './star1.png' });
				console.log("step0")
				let bodyHTML1 = await page.evaluate(() => document.body.innerHTML);
				console.log("bodyHTML:",bodyHTML1)
				await page.waitFor(1000);
				await page.waitForSelector("#viTabs_1[href='#']")
					console.log("step1")
				await page.click("#viTabs_1[href='#']");
				await page.waitFor(2000);
				// await page.screenshot({ path: './star2.png' });
				await page.select('#shCountry', "1");
				console.log("step3")
				await page.waitFor(1000);
				await page.focus('#shZipCode')
				await page.waitFor(1000);
				await page.keyboard.type('97230')
					console.log("step5")
				await page.waitFor(1000);
				await page.click("#shGetRates");
				await page.screenshot({ path: './ebay.png' });
			//await page.screenshot({ path: './star3.png' });
			//	console.log('set zip code');

					// if not already starred will give a star to this repo :P
					// else will throw an error because cant find the button
				await page.waitFor(2000);
				 // await page.waitForNavigation({waitUntil: "load"});

			//	await page.screenshot({ path: './star4.png' });
				return true;
			} catch (err) {
					console.log('Error setting ebay');
					return false
			}
		 },
		 // eby selectors
		 selectors: {
			 	 title: '#itemTitle',
				 price: '#prcIsum',
				 shipping: '#fshippingCost > span',
				 shipping1: "#shSummary > div.fnfvar0.fnfadjust",
				 image: '#icImg@src',
				 category: "li.bc-w:first-child span",
				 category1: "li.bc-w:last-child span",
				 condition: '#vi-itm-cond',
				 item_number: '#descItemNumber',
		 }

	 },
	 amazon: {
		 initialized: false,
		 setup: async(page) => {
			 try {
				 	await page.screenshot({ path: './amazon1.png' });
			 }
			 catch(err) {
				 console.log("error taking screenshot");
			 }
			try {
				console.log("setup amazon")
				console.log("click1")
				let bodyHTML = await page.evaluate(() => document.body.innerHTML);
				console.log("bodyHTML:",bodyHTML)
			await page.waitFor(2000);
		//	await page.waitForSelector("#nav-main > div.nav-left > div.a-section.glow-toaster.glow-toaster-theme-default.glow-toaster-slot-default.nav-coreFlyout.nav-flyout > div > div.glow-toaster-footer > span.a-button.a-spacing-top-base.a-button-primary.glow-toaster-button.glow-toaster-button-submit")
			await page.click("#nav-main > div.nav-left > div.a-section.glow-toaster.glow-toaster-theme-default.glow-toaster-slot-default.nav-coreFlyout.nav-flyout > div > div.glow-toaster-footer > span.a-button.a-spacing-top-base.a-button-primary.glow-toaster-button.glow-toaster-button-submit > span > input")
		//  await page.waitForNavigation({waitUntil: "load"});
					console.log("click2")
			// await page.click("a-button-input")
			// await page.waitForNavigation({waitUntil: "load"});
			  console.log("click3")
			await page.waitFor(2000);

		//	await page.waitForSelector('#a-popover-header-6')

			await page.focus('#GLUXZipUpdateInput')
			await page.waitFor(1000);
			await page.click('#GLUXZipUpdateInput')
			await page.waitFor(1000);

			await page.keyboard.type('97230')

			console.log("click4")
			await page.waitFor(1000);
			await page.waitForSelector("#GLUXZipUpdate");
			console.log("click5")
			await page.focus("#GLUXZipUpdate");
			await page.waitFor(1000);

			await page.click("#GLUXZipUpdate");
				await page.screenshot({ path: './amazon2.png' });
			await page.waitFor(2000);
			console.log("click6")
		//	await page.waitForNavigation({waitUntil: "networkidle2"});
		//  await page.waitForSelector("#a-popover-6 > div > div.a-popover-footer > span")
		//	console.log("click7")
			await page.click('body')
					console.log("click8")
			await page.waitForSelector("#twotabsearchtextbox")
			await page.focus("#twotabsearchtextbox");
			console.log("click9")
			await page.waitFor(1000);
			await page.click("#twotabsearchtextbox")
			console.log("click10")
			await page.waitForNavigation({waitUntil: "load"});
			console.log("click11")
			return true;
			} catch(err) {
				console.log("Err:",err)
				return false;
			}
		},
		// amazon selectors
		 selectors: {
				title: '#productTitle',
			 original_price: '#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base.a-text-strike',

			 image: '#landingImage@data-old-hires', //@data-old-hires',
			 image1: "#landingImage@src",
			 image2: "#imgBlkFront@src",
		 	 image3: "#ivLargeImage > img@src",
			 sale_price: '#priceblock_saleprice',
			 deal_price: "#priceblock_dealprice",
			 price: '#priceblock_ourprice',

			 price1: '#posPromoPitchPrice > div > span.price-large',
			 price2: "#soldByThirdParty > span.a-color-price.price3P",
			 price3: "#priceblock_pospromoprice",
			 price4: "#buyNewSection",
			 price_fraction: "#posPromoPitchPrice > div > span:nth-child(3)",
			 shipping: "#priceBadging_feature_div > span > span",
			 shipping1: "#soldByThirdParty > span.a-size-small.a-color-secondary.shipping3P",
			 shipping2: "#price-shipping-message > b",
			 shipping3: "#buyNewInner > div.a-section.a-spacing-small.a-spacing-top-micro > div > span > span > a",
			 prime: "#priceBadging_feature_div > i.a-icon-prime",
		   //	brand: 'div#leftCol.a-section div.a-section div.a-section div.a-section a.a-link-normal',
			 //details: x(['#feature-bullets > ul > li']),
		   //	description: '#productDescription',
			 dimensions: "#detail-bullets .bucket > div.content >ul > li:contains('Product Dimensions')",
			 //dimensions1:"#detailBullets_feature_div > ul > li:nth-child(1) > span > span:contains('Product Dimensions')",
			 dimensions1: "#detailBullets_feature_div > ul > li:contains('Product Dimensions') > span",
			 package_dimensions: "tr:contains('Package Dimensions') > td.a-size-base",
			 product_dimensions: "tr:contains('Product Dimensions') > td.a-size-base",
			 item_dimensions: "tr:contains('Item Dimensions  L x W x H') td.a-size-base",
			 weight:"#detail-bullets .bucket > div.content >ul > li:contains('Shipping Weight')",
			 shipping_weight: "tr:contains('Shipping Weight') > td.a-size-base",
			 shipping_weight1: "#detail-bullets > table > tbody > tr > td > div.content > ul > li:contains('Shipping Weight:')",
			 shipping_weight2: "#detail-bullets > table > tbody > tr > td > div.content > ul > li:nth-child(1) > b",
			 shipping_weight3: "#detail-bullets > table > tbody > tr > td > div.content > ul > li:contains('Shipping Weight') > b",
			 item_weight: "tr:contains('Item Weight') > td.a-size-base",
			 shipping_weight4: '*[@id="detail-bullets"]/table/tbody/tr/td/div[2]/ul/li[1]/text()[1]',
			 shipping_weight5: "#detailBullets_feature_div > ul > li:contains('Shipping Weight')> span",
			 category: "#wayfinding-breadcrumbs_container > ul > li:last-child",
			 rank1: "#productDetails_detailBullets_sections1 > tbody > tr:contains('Best Seller') >td a",
			 rank2: "#SalesRank",
			 options: "#variation_size_name > div > span",
			 options1: "#shelf-label-size_name",
			 options2: "#productDetails_secondary_view_div > h3",
			 options3: "#quickPromoBucketContent > div.disclaim",
			 size: "#dropdown_selected_size_name > span > span > span",
			 color: "#variation_color_name > div > span",
			 condition: "#buyNewSection"

		 },
	 },
	 walmart: {
		 initialized: false,
		 setup: async(page) => {
			 console.log("setup walmart ")

				 //	console.log("click1")
				 try {
					 var url = page.url();
					 await page.waitFor(2000);

					 await page.waitForSelector("#header-bubble-links > div:nth-child(4) > a > span > span > span.e_a.y_c.y_f.e_g.e_b.e_p.v_a.v_h.v_j");
					 await page.waitFor(2000);
					 await page.click("#header-bubble-links > div:nth-child(4) > a > span > span > span.e_a.y_c.y_f.e_g.e_b.e_p.v_a.v_h.v_j")
					 await page.waitFor(2000);
					 await page.waitForSelector("#cart-root-container-content-skip > div > div > div.text-left.Grid > div.Grid-col.u-size-1.u-size-3-12-m.u-size-3-12-l > div > div > div:nth-child(1) > div > div.order-summary-tax.order-summary-line > div > span > div > span > button > span")
					 await page.click("#cart-root-container-content-skip > div > div > div.text-left.Grid > div.Grid-col.u-size-1.u-size-3-12-m.u-size-3-12-l > div > div > div:nth-child(1) > div > div.order-summary-tax.order-summary-line > div > span > div > span > button > span")
					 await page.waitFor(2000);
					 await page.focus("#zip-code");
					 await page.click("#zip-code");
					 await page.keyboard.down('Control');
					 await page.keyboard.press('KeyA');
					 await page.keyboard.up('Control');
					 await page.keyboard.press('Backspace');
					 // await page.evaluate(function() {
    		 		// 		document.querySelector('input#zip-code').value = '97230'
						// })

				//	 await page.keyboard.press(String.fromCharCode(1)) // cntl-A select all
					 await page.waitFor(2000);
					 await page.type("#zip-code",'97230')
					// 	await page.keyboard.type('97230');

					 await page.keyboard.press('Enter');

					 await page.waitFor(5000);
					 await page.waitForSelector("#cart-root-container-content-skip > div > div > div.text-left.Grid > div.Grid-col.u-size-1.u-size-3-12-m.u-size-3-12-l > div > div > div:nth-child(1) > div > div.order-summary-tax.order-summary-line > div > span > div > span > button > span")
					 	await page.screenshot({ path: './walmart.png' });
					 // page.keyboard.press(String.fromCharCode(13));// press enter
					 await page.goto(url)
					 await page.waitFor(2000);
					 return true;
				 } catch (err) {
					 console.log("walmart setup err: ",err)
					 return false;
				 }
		 },
		 // walmart selectors
		 selectors: {
				 title:'h1.prod-ProductTitle div',
				 price: 'span.hide-content span.price-characteristic',
				 price_fraction: 'span.hide-content span.price-mantissa',
				 currency: '#price span.price-currency',
				 brand: 'div.hide-content.display-inline-block-m.valign-middle.secondary-info-margin-right.copy-mini > a > span',
				 image:  'div.hover-zoom-hero-image-container > img@src',
				 shipping:  'span.free-shipping-msg',
				 shipping1: "body > div:nth-child(1) > div > div > div.js-body-content > div > div.atf-content > div > div:nth-child(1) > div > div > div > div > div.Grid > div.Grid > div:nth-child(2) > div:nth-child(1) > div > div > div > div.prod-OfferSection.prod-ShippingFulfillmentSection.hf-BotRow > div > div > div > div > div > span > div > div > div:nth-child(1) > div:nth-child(1) > span",
				 dimensions:  'div.Specification-container > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > div',
				 category: 'li.breadcrumb.active > a',
				// description: 'div.about-desc',
		 }
	 },
	 aliexpress: {
	   initialized: false,
	   setup: async(page) => {
			 try {
			     //await page.screenshot({ path: './star1.png' });
					 await page.waitFor(2000);
					//console.log("click1")
				  await page.waitForSelector("body > div.ui-window.ui-window-normal.ui-window-transition.ui-newuser-layer-dialog > div > div > a")
				  await page.click("body > div.ui-window.ui-window-normal.ui-window-transition.ui-newuser-layer-dialog > div > div > a")
				  await page.waitFor(1000);
				  await page.click("#switcher-info > span.ship-to");
			    await page.waitFor(1000);

			 		await page.click("#nav-global > div.ng-item.ng-switcher.active > div > div > div.switcher-shipto.item.util-clearfix > div > a:nth-child(1)")
			 		await page.waitFor(1000);
 		  		await page.focus("#nav-global > div.ng-item.ng-switcher.active > div > div > div.switcher-shipto.item.util-clearfix > div > div:nth-child(4) > div > input");
			 		await page.waitFor(1000);
			 		//console.log("click2")
			 		await page.keyboard.type("united states")
			 		await page.waitFor(1000);
					await page.click("#nav-global > div.ng-item.ng-switcher.active > div > div > div.switcher-shipto.item.util-clearfix > div > div:nth-child(4) > ul > li:nth-child(224) > span > span")
 					await page.waitFor(1000);
					//	await page.screenshot({ path: './star3.png' });
					// console.log("click3")
					await page.screenshot({ path: './aliexpress.png' });
			 		await page.click("#nav-global > div.ng-item.ng-switcher.active > div > div > div.switcher-btn.item.util-clearfix > button")
			 		await page.waitForSelector("#j-product-detail-bd > div.detail-main > div > h1")

		 			//await page.waitFor(5000);
	   			//  await page.screenshot({path: './star7.png'});
			 		return true;
		 } catch(err) {
			 console.log("err:",err)
			 return false;
		 }
	   },
	   selectors: {
	     title: '#j-product-detail-bd > div.detail-main > div > h1',
	     title1: "#j-product-detail-bd  h1.product-name",
	     title2: "h1.product-name",
	     price: '#j-sku-price',
	     high_price: '#j-sku-discount-price > span:nth-child(2)',
	     sale_price: "#j-sku-discount-price",
	     image: xDelay('#magnifier > div.ui-image-viewer-thumb-wrap > a > img@src'),
	     shipping: "#j-product-shipping span.logistics-cost",
	     category: "body > div.ui-breadcrumb > div > h2 > a",
	     category1: 'body > div.ui-breadcrumb > div > a:nth-child(7)',
	     dimensions: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('Package Size:') > span.packaging-des",
	     dimensions1: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('حجم الحمولة:') > span.packaging-des",
	     weight: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('Package Weight') > span.packaging-des",
	     weight1: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('وزن الحمولة:') > span.packaging-des",
	     options: "li.item-sku-image.active  > a@title",
	     options1: "div.product-desc li.packaging-item:contains('Unit Type') span.packaging-des",
	   }
	 }
 }

const x = Xray().driver(xRayChrome(	{
	viewPort:{ width:1280, height:800 },

    cl: async (page, ctx) => {
				console.log('in cl function:')
				var urlinfo = parse(ctx.url, true);
				//	console.log('url:',url)
				var host= urlinfo ? urlinfo.host:null
				console.log('host:',host)
				// the following code can be replaced by a more concide loop (later!)
				console.log("site map:",site_map[host])
				if (sites[site_map[host]] && !sites[site_map[host]].initialized ) {
					//	console.log("setup ",sites[site_map[host]])
						sites[site_map[host]].initialized = await sites[site_map[host]].setup(page);
						console.log("after setup  initialized:",sites[site_map[host]].initialized)
				}

      },
      navigationOptions: {
                timeout: 20000,
      },
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		//	headless:  true, 	// launch browser (false = show it)

		}
));

exports.scraper = async function(url) {
console.log("in <scraper> ")

  var urlinfo = parse(url, true);
  //	console.log('url:',url)
  var host= urlinfo ? urlinfo.host:null
  var site = site_map[host]? sites[site_map[host]]:null;

  //console.log("sites:",site);
  if (!site) return null;
	if(site) {
		var result = await x(url,  site.selectors)
    console.log("result:",result)

    if (!result) return null;

      console.log("smart-product-scraper> after call from x-ray:")

			result.url = url;
      result.site = site_map[host]

      // copy values
			if(result.details)
			{
          console.log("<smart-product-scraper> in object details")
				var details = [];
				result.details.forEach(function(element, index, array){
					details.push(element.trim());
				});
				result.details = details;
			}
			console.log("result:",JSON.stringify(result))


        console.log("<smart-product-scraper> got site:",result.site)
        console.log("<smart-product-scraper> got title:",result.title)
        console.log("<smart-product-scraper> got shipping:",result.shipping)
				console.log("<smart-product-scraper> got shipping1:",result.shipping1)
        console.log("<smart-product-scraper> got condition:",result.condition)
        console.log("<smart-product-scraper> got options:",result.options)
				console.log("<smart-product-scraper> got options1:",result.options1)
				console.log("<smart-product-scraper> got options2:",result.options2)
				console.log("<smart-product-scraper> got options3:",result.options3)
        console.log("<smart-product-scraper> got weight:",result.weight)
        console.log("<smart-product-scraper> got dimensions:",result.dimensions)
        console.log("<smart-product-scraper> got image:",result.image)
				  console.log("<smart-product-scraper> got image1:",result.image1)
					  console.log("<smart-product-scraper> got image2:",result.image2)
						 console.log("<smart-product-scraper> got image3:",result.image3)
        console.log("<smart-product-scraper> got brand:",result.brand)
        console.log("<smart-product-scraper> got category:",result.category)
        console.log("<smart-product-scraper> got rank1:",result.rank1)
        console.log("<smart-product-scraper> got rank2:",result.rank2)
				console.log("<smart-product-scraper> got price:",result.price)
				console.log("<smart-product-scraper> got price1:",result.price1)
				console.log("<smart-product-scraper> got price2:",result.price2)
					console.log("<smart-product-scraper> got price3:",result.price3)
						console.log("<smart-product-scraper> got price3:",result.price4)
  		  console.log("<smart-product-scraper> got deal_price:",result.deal_price)
	   		console.log("<smart-product-scraper> got sale_price:",result.sale_price)
  			console.log("<smart-product-scraper> got price_fraction:",result.price_fraction)
       var usePrice = result.high_price || result.deal_price || result.sale_price || result.price || result.price1 || result.price2  || result.price3 || result.price4 ;

      console.log("<smart-product-scraper> got usePrice:",usePrice)


      if(usePrice) {
        var mp = String(usePrice).match(/(?:\s|[a-z]|,|;)*(\$|USD|€|EUR|£)*(?:\s)*(\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?|\.\d+)(?:[\(|\s])*(?:\s|\)|\s|\w|,|;)*(?:$)/i)
        console.log("match price:",mp)
				var priceUnit = mp && mp.length>1? mp[1]? mp[1]:'':'';
				console.log("price Unit:",priceUnit)

        var price = mp && mp.length>2? mp[2]:'0';
				price = price.replace(/,/g, ''); // assume , is 1000 separator (later use Intl.NumberFormat)
				price = price && !isNaN(price)? parseFloat(price).toFixed(2):0;
				console.log("Extracted price:",price)
				switch(priceUnit) {
					case '':
					case '$':
					case 'USD':
						console.log("price in USD or not specified");
						break;
					case '€':
					case "EUR":
					 console.log("price in Euro");
					 price = parseFloat(price) * 1.14; // get conversion online
					 break;
					case '£':
					case 'GBP':
						console.log("price in British pound")
						price = parseFloat(price) * 1.35; // get conversion online
						break;
					default:
					break;
				}
				price = parseFloat(price) + ((result.price_fraction && !isNaN(result.price_fraction)) ? parseFloat(result.price_fraction) : 0);
				console.log("final price:",price)
        result.price = price>0? parseFloat(price).toFixed(2):-1;
      } else {
				result.price = -1;
			}
			if (result.prime) result.prime="FREE";
			var useShipping = result.shipping || result.shipping1 || result.shipping2 || result.shipping3 || result.prime;
			console.log("useShipping:",useShipping)
      if(useShipping) {
				// look for FREE Shipping
        if (String(useShipping).match(/Free/i)) {
          result.shipping = 0;
        }  else {
					var ms = String(useShipping).match(/(?:\s|[a-z]|,|;)*(\$|USD|€|EUR|£)*(?:\s)*(\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?|\.\d+)(?:[\(|\s])*(?:\s|\)|\s|\w|,|;)*(?:$)/i)
					console.log("match ship_price:",ms)
					var shipUnit = ms && ms.length>1? ms[1]? ms[1]:'':'';
					console.log("Ship Unit:",shipUnit)

					var shipping = ms && ms.length>2? ms[2]:'0';
          console.log("match shipping price:",shipping)
					switch(shipUnit) {
						case '':
						case '$':
						case 'USD':
							console.log("shipUnit in USD or not specified");
							break;
						case '€':
						case "EUR":
						 console.log("shipUnit in Euro");
						 shipping = parseFloat(shipping) * 1.14; // get conversion online
						 break;
						case '£':
						case 'GBP':
							console.log("shipUnit in British pound")
							shipping = parseFloat(shipping) * 1.35; // get conversion online
							break;
						default:
						break;
					}
          result.shipping = shipping;
        }

      } else {
				  result.shipping = -1;
			}
			var useTitle = result.title || result.title1 || result.title2
			console.log("useTitle:",useTitle)
			if(useTitle) {
        if (result.site == 'ebay')    result.title = useTitle.replace('Details about','')

				result.title = useTitle.trim();

      } else {
				result.title = "No Title!"
			}
      var hasOptions =
			 	[result.options ,
				result.options1,
				result.options2,
				result.options3,
				result.color,
				 result.size,
				 result.item_number].filter(Boolean).join('; ')
      if (hasOptions) {
				hasOptions = hasOptions.replace(/\s\s+/g, ' ');
        result.options =hasOptions
      }

      var useWeight = result.shipping_weight || result.shipping_weight1 ||
						result.shipping_weight2 ||result.shipping_weight3 || result.shipping_weight4
						|| result.shipping_weight5 ||result.weight || result.weight1 || result.item_weight ;
      console.log("useWeight:",useWeight)
      if (useWeight) {

        var weight = 0;
					var m0 = String(useWeight).match	(/((?:\d{1,3})(?:,\d{1,3})*(?:\.\d{1,})?)(?:[\(|\s|\(])*(kg|lb|pound|ounce)?/i)
				//var m0 = String(useWeight).match(/((?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?|\.\d+)(?:[\(|\s|\(])*(kg|lb|pound|ounce)?/);
				// var m0 = String(useWeight).match(/^(?:\s)*(((?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?|\.\d+)(?:[\(|\s|\(])*(kg|lb|pound|ounce))?(?:\s|\))*(?:.)*/i);
	        //  var m0  = String(useWeight).match(/^(?:\s)*((?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?|\.\d+)(?:[\(|\s])*(kg|lb|pound|ounce)?(?:\s|\))*(?:$)/i)
					// (?:^|\s)*(\d*\.?\d+|\d	{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(kg|lb|pound|ounce)?(?:\s*)/i);
          console.log("match weight:",m0)
          weight = m0 && m0.length > 0? m0[1]:0;
					var wUnit = m0 && m0.length > 1? m0[2]:'lb';
          console.log("Extracted weight:", weight)
					console.log("Extracted weight Unit:", wUnit)
					// convert to pound
        	switch(wUnit) {
						case 'kg':
						weight = parseFloat(weight)* 2.2
						break;
						case 'lb':
						case 'pound':
						 // no change
						 console.log("already in pounds")
						break;
						case 'ounce':
							weight = parseFloat(weight) / 16.0
						break;
						default:

					}
          result.weight = parseFloat(weight).toFixed(2);
          console.log("Final weight: ",result.weight)
      }
      var useDimensions = result.package_dimensions || result.dimensions ||result.dimensions1 || result.product_dimensions || result.item_dimensions
      if (useDimensions) {
         var dim ;
        //  var m1 =  String(useDimensions).match(/\d+(?:\.\d*)*\s*?[x|X]\s*\d+(?:\.\d*)*\s*[x|X]\s*\d+(?:\.\d*)*\s*?/i);
				 var dim =  String(useDimensions).match(/(?:^|\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(in|inch|inches|cm|'|")?(?:\s)*[x|X](?:\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(in|inch|cm|'|")?(?:\s)*[x|X](?:\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(in|inch|cm|'|")?(?:\s)*/i);
				 // match number with comma (optional) and fraction \b[0-9]{1,3}(,?[0-9]{3})*(\.[0-9]+)?\b|\.[0-9]+\b
				  console.log("match dimensions:",dim)

          //
					if (dim && dim.length > 5) {
						var l = dim[1];
						var w = dim[3];
						var h = dim[5];
						var useUnit = dim && dim.length>6? dim[6] || dim[4] || dim[2]:'inch'
						console.log("unit is:",useUnit);
						switch(useUnit) { // contains unit

							case 'cm':
								l = parseFloat(l) / 2.54;
							 	w= parseFloat(w) / 2.54;
								h = parseFloat(h) / 2.54;
								break;
							case 'inch':
							case 'inches':
							case '\"':
							break;
							case '\'':
							l = parseFloat(l) *12
							w = parseFloat(w)  * 12
							h = parseFloat(h) * 12
							break;
							default:

						}

          	result.dimensions =parseFloat(l).toFixed(2) + ' x ' + parseFloat(w).toFixed(2) + ' x ' + parseFloat(h).toFixed(2);

					} else if (dim && dim.length>0){
						result.dimensions = dim && dim.length>0 ? dim[0]:''
					} else {
						result.dimensions = '0 x 0 x 0';
					}
         	console.log('final dimensions:',result.dimensions)
      }

			if(result.brand) result.brand = result.brand.trim();
      console.log("obj.category:",result.category)
      var useCategory =[result.category , result.category1, result.rank1 , result.rank2].filter(Boolean).join(' ')  ;

      if (useCategory) {
				var words = useCategory.split(' in ');

				console.log("words:",words);
				if (words && words.length> 1 ) {
				  console.log(words[1]);

					var words = String(words[1]).split('(');
					console.log(words[0].trim())
				  useCategory = words[0].trim();
				}


         useCategory = useCategory.replace(/\/\&\.\[\]/,' ')
         console.log("category after cleanup:", useCategory)
         //category = String(useCategory).match(/[a-z][a-z\,\&\b\/\\ \(\)\[\]]+/i)

				 useImage = result.image || result.image1 || result.image2 || result.image3
				 result.image = useImage;
         result.category = useCategory? useCategory:"general accessories"
      }

      return result;

    }


	}
