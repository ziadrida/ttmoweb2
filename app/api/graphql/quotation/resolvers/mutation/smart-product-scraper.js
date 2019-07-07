const  Xray = require('x-ray');
const {xRayChrome} = require('./x-ray-chrome');
//import URL from 'url-parse';
'use strict';
//import URL from 'url-parse';
var parse = require('url-parse')

//const puppeteer = require('puppeteer');
	const xDelay = Xray().delay('3s','10s')

	const site_map = {
		'www.ebay.com': 'ebay',
		'www.ebay.co.uk': 'ebay',
		'www.aliexpress.com': 'aliexpress',
		'ar.aliexpress.com': 'aliexpress',
		'www.amazon.com': 'amazon',
		'www.amazon.co.uk': 'amazon',
		'www.walmart.com': 'walmart',
			'www.newegg.com': 'newegg',
	}

 const sites = {
	 newegg: {
		 initialized: false,
		 initAttempts: 0,
		 setup:async (page) => {
			 if (!page) {
				 console.log("page is not defined!")
				 return false;
			 }
			 var url = page.url();
			 //console.log("setup ebay - url:",url)
			 await page.waitFor(1000);


				try {
				//await page.screenshot({ path: './star1.png' });
				//console.log("step0")
				// let bodyHTML1 = await page.evaluate(() => document.body.innerHTML);
				// //console.log("bodyHTML:",bodyHTML1)
				await page.waitFor(1000);
				try {
					// find shipping tab
					await page.waitForSelector("div.top-country-wrap > div.top-country-wrap-inner > div:nth-child(1) > div > ul > li:contains('North America')")

					//console.log("found country popup")
				} catch(err) {
					 //console.log('could not find country popup')

				 }
				 try {
					 await page.click("div.top-country-wrap > div.top-country-wrap-inner > div:nth-child(1) > div > ul > li:contains('North America')");
					 //console.log("clicked on North America")
				 } catch(err) {
					 //console.log("could not click on North America")
				 }

				 try {
					 await page.waitFor(1000);
					 await page.click(" div > div.top-country-wrap > div.top-country-wrap-inner > div:nth-child(2) > div > ul > li[data-countrycode='USA'] > div");
					  //console.log("clicked on USA")
				 } catch(err) {
					 //console.log("could not click on USA")
				 }
					//console.log("step1")

					try {
						//console.log("click on save preferences");
						await page.click("div > div.top-country-wrap > div.top-country-bottom > button.btn.btn-primary.nonchangecounrtypopup");
						//console.log("clicked on save preferences");

					} catch(err) {
						//console.log("could not click on save preferences")
						try {
							await page.click("#Change_Country_Content > div.top-country-wrap > div.top-country-bottom > button:nth-child(1)")

								//console.log("clicked on stay at US")
						} catch(err) {
								//console.log("could not find stay at united states")
								try {
							await page.click("div.centerPopup.is-current > div > div.top-country-wrap > div.top-country-bottom > button:nth-child(1)",{timeout: 1000})
							//console.log("OK -> clicked on stay on same country")
						} catch(err) {
								//console.log("err -> could not click on -> stay on same country")
						}
						}

					}

				await page.waitFor(1000);

				try {
					//console.log("wait for page to load")
					await page.waitForNavigation({timeout: 5*1000,waitUntil: "networkidle2"})
				} catch(err) {
					//console.log('Timeout WAITING ON PAGE LOAD ')
				}
				//console.log("assume page loaded")

				return true;
			} catch (err) {
					//console.log('Error setting newegg');

					let bodyHTML = await page.evaluate(() => document.body.innerHTML);
					//console.log("bodyHTML start:\n",bodyHTML)
					return false
			}
		 },
		 // newegg selectors
		 selectors: {
				 title: '#grpDescrip_h',
				// title1: "#mainContent > div.product-buy-container.product-buy-container-new-ui > div.product > div > div > h1",
				 price: '#landingpage-price  li.price-current',
				 price1: '#mm-saleDscPrc',
				 shipping: '#landingpage-price > div > div > div.premier-info > a',
				 shipping1: "#landingpage-price > div > div > ul > li.price-ship >",
				// shipping1: "#shSummary",
				 image: 'div.objImages > a > span > img@src',
				 category: "#baBreadcrumbTop",
				// category1: "li.bc-w:last-child span",
				// condition: '#vi-itm-cond',
				// item_number: '#descItemNumber',
				dimensions: "#Specs > fieldset:nth-child(2) > dl:contains('Dimensions') > dd",
			  dimensions1:	"#Specs > fieldset:contains('Dimensions') > dl:contains('Weight') > dd",
				shipping_weight: "#Specs > fieldset:nth-child(2) > dl:contains('Weight') > dd",
				shipping_weight1: "#Specs > fieldset:contains('Dimensions') > dl:contains('Weight') > dd",
				 ship_to_address: '#Change_Country > ins > span',
				 options: "#landingpage-property > div > div:nth-child(1) > div:nth-child(1) > span.value",
				 option1: "#landingpage-property > div > div:nth-child(2) > div:nth-child(1) > span.value",
				 options2:"#landingpage-property > div > div:nth-child(3) > div:nth-child(1) > span.value",
				 options3:"#landingpage-property > div > div:nth-child(4) > div:nth-child(1) > span.value",
				  options4:"#landingpage-property > div > div:nth-child(5) > div:nth-child(1) > span.value",
					 options5:"#landingpage-property > div > div:nth-child(6) > div:nth-child(1) > span.value"
		 }

	 },
	 ebay: {
		 initialized: false,
		 initAttempts: 0,
		 setup:async (page) => {
			 if (!page) {
				 console.log("page is not defined!")
				 return false;
			 }
			 var url = page.url();
			 //console.log("setup ebay - url:",url)
			 await page.waitFor(1000);


				try {
				//await page.screenshot({ path: './star1.png' });
				//console.log("step0")
				// let bodyHTML1 = await page.evaluate(() => document.body.innerHTML);
				// //console.log("bodyHTML:",bodyHTML1)
				await page.waitFor(1000);
				try {
					// find shipping tab
					await page.waitForSelector("#viTabs_1[href='#']")
				} catch(err) {
					 //console.log('#viTabs not found')

				 }
					//console.log("step1")
				await page.click("#viTabs_1[href='#']");
				//console.log("step2")
				await page.waitFor(2000);
				// await page.screenshot({ path: './star2.png' });
				await page.select('#shCountry', "1");
				//console.log("step3")
				await page.waitFor(1000);
				await page.focus('#shZipCode')
				await page.waitFor(1000);
				await page.keyboard.type('97230')
					//console.log("step5")
				await page.waitFor(1000);
				await page.click("#shGetRates","{timeout:2*1000}");
			//	await page.screenshot({ path: './ebay.png' });
			//await page.screenshot({ path: './star3.png' });
			//	//console.log('set zip code');

					// if not already starred will give a star to this repo :P
					// else will throw an error because cant find the button

				try {
					//console.log("wait for page to load")
					await page.waitForNavigation({timeout: 7*1000,waitUntil: "networkidle2"})
				} catch(err) {
					console.log('ebay Timeout WAITING ON PAGE LOAD ')
				}
				//console.log("assume page loaded")
				 // await page.waitForNavigation({waitUntil: "load"});

			//	await page.screenshot({ path: './star4.png' });
				return true;
			} catch (err) {
					//console.log('Error setting ebay');

					let bodyHTML = await page.evaluate(() => document.body.innerHTML);
					//console.log("bodyHTML start:\n",bodyHTML)
					return false
			}
		 },
		 // ebay selectors
		 selectors: {
			 	 title: '#itemTitle',
				 title1: "div.product > div > div > h1",
				 price: '#prcIsum',
				 price1: '#mm-saleDscPrc',
				 price2: 'span.item-price',
				 shipping: '#fshippingCost > span',
				 shipping1: "#shSummary",
				 shipping2: 'span.logistics-cost',
				 image: '#icImg@src',
				 image1: '#w5-w1 > div > ul > li:nth-child(1) > a > img@src',
				 category: "li.bc-w:first-child span",
				 category1: "li.bc-w:last-child span",
				 category2: 'div.breadcrumb.clearfix > ol > li:last-child > a > span',
				 condition: '#vi-itm-cond',
				 condition1: 'div.item-desc > div.item-content-wrapper > div.item-highlights-wrapper > ul:nth-child(2) > li:nth-child(1)',
				 item_number: '#descItemNumber',
				 ship_to_address: '#shippingSection > table > tbody > tr > td:nth-child(3) > div',
		 }

	 },
	 amazon: {
		 initialized: false,
		 initAttempts: 0,
		 setup: async(page) => {
			 try {
				 if (!page) {
					 console.log("page is not defined!")
					 return false;
				 }
				 var url = page.url();
				 //console.log("setup amazon - url:",url)
				 await page.waitFor(1000);
					//await page.goto(url)
				 //console.log("setup amazon")

				try {
						//console.log("wait for #nav-main")
						await page.waitForSelector("#nav-main", { timeout: 2000 });
						 //console.log("#nav-main found")
				} catch(err) {
					 //console.log("#nav-main not found - try again")
					 //console.log("wait again look for #nav-main")
					 try {
					 await page.waitForSelector("#nav-main", { timeout: 2000 });
						//console.log("#nav-main found")
					} catch(err) {
						//console.log("#nav-main not found ")
						//console.log("Error setting up Amazon")
						let bodyHTML = await page.evaluate(() => document.body.innerHTML);
						//console.log("bodyHTML start:\n",bodyHTML)
						return false;
					}
				}

				try {
					//console.log("wait for #nav-global-location-slot > span")

					await page.waitForSelector("#nav-global-location-slot > span", { timeout: 2000 });
					 //console.log("#nav-global-location-slot > span found")
				}
				catch (err) {
					//console.log("wait AGAIN for #nav-global-location-slot > span")

					try {
					await page.waitForSelector("#nav-global-location-slot > span", { timeout: 2000 });
					 //console.log("#nav-global-location-slot > span found")
				 } catch(err) {
					 	//console.log("could not find #nav-global-location-slot > span")
					 //console.log("Error setting up Amazon")
	 				 return false;
				 }
				}

				try {
					//console.log("open change location")
					await page.waitFor(1000);
					await page.evaluate(() => {
							document.querySelector("#nav-global-location-slot > span").click();
						});
					//console.log("clicked #nav-global-location-slot > span")
					//console.log("change location popover openned")
				}	catch(err) {
						try {
								//console.log("problem openning popup - try again with icon")
								await page.waitFor(1000);
								await page.evaluate(() => {
									document.querySelector('#nav-packard-glow-loc-icon').click();
								});
								//console.log("clicked #nav-global-location-slot > span")
								//console.log("change location popover openned")
						} catch(err) {
								//console.log("problem openning popup using icon")

							 //console.log("Error setting up Amazon")
							 return false;
						}
				}

				try {
					//console.log('wait for GLUXZipUpdateInput')
					await page.waitForSelector("#GLUXZipUpdateInput", { timeout: 2000 })
					//console.log("found selector GLUXZipUpdateInput")
				} catch( err3) {
					//console.log("waited and Could not find selector GLUXZipUpdateInput")
				}

				try {
					//console.log("evaluate GLUXZipUpdateInput click inside zipcode, enter zipcode, and apply")

					let zipInputSelector = '#GLUXZipUpdateInput';
					let zip='97230'
					let applyZipSelector = '#GLUXZipUpdate';
					await page.waitFor(1000);
					await page.evaluate((zip) => {
						document.querySelector('#GLUXZipUpdateInput').value = zip;
						document.querySelector('#GLUXZipUpdate > span > input').click();

					}, zip);
					await page.waitFor(1000);
					console.log("click on Continue")
					await page.evaluate(() => {
						document.querySelector("div.a-popover-footer > span > span > span > button").click();
					});

					//console.log("done enterring, applying  zipcode ")
					//console.log("wait after setting zipcode")
					await page.waitFor(2000);
			 } catch(err) {
					//console.log("error enterring, applying  zipcode ")
					//console.log("Error setting up Amazon")
					return false;
			 }

			 try {
	 		  //console.log("click search box to exit zipcode popup window  ")
				await page.waitFor(1000);
	 		  await page.evaluate(() => {
	 		    document.querySelector("body").focus();
	 		    document.querySelector("body").click();

	 		  });
					await page.waitFor(1000);
				await page.evaluate(() => {

				 document.querySelector("#twotabsearchtextbox").focus();
				 document.querySelector("#twotabsearchtextbox").click();
			 });
	 		  //console.log("done exiting popup window")
	 		} catch (err) {
	 		  //console.log("error exiting popup window")
	 		}

				try {
					//console.log("wait for page to load")
					await page.waitForNavigation({timeout: 5*1000,waitUntil: "networkidle0"})
				} catch(err) {
					//console.log('page not seem to load on time - no problem continue ... ')
				}
				//console.log("DONE Setting location")
			return true;
		} catch(err) {
				//console.log("!!! Error setting up Amazon")

				let bodyHTML = await page.evaluate(() => document.body.innerHTML);
				//console.log("bodyHTML start:\n",bodyHTML)
				return false;
		}
	  },
		// amazon selectors
		 selectors: {
				title: '#productTitle',
			 original_price: '#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base.a-text-strike',
			 ship_to_address: "#nav-global-location-slot > span > a",
			 image: "#landingImage@data-old-hires", //@data-old-hires',
			 image1: xDelay("#landingImage@src"),
			 image2: xDelay("#imgBlkFront@src"),
		 	 image3: xDelay("#ivLargeImage > img@src"),
			 image4: xDelay("#main-image[src]"), // src is an attribute of main-image
			 image5: xDelay("#altImages > ul > li:nth-child(3) > span > span > span > span> img@src"),
			 sale_price: '#priceblock_saleprice',
			 deal_price: "#priceblock_dealprice",
			 used_price: "#usedPitchPrice > div.a-section.a-spacing-none",
			 price: '#priceblock_ourprice',

			 price1: '#posPromoPitchPrice > div > span.price-large',
			 price2: "#soldByThirdParty > span.a-color-price.price3P",
			 price3: "#priceblock_pospromoprice",
			 price4: "#buyNewSection",
			 price5: '#newOfferAccordionRow > div > div.a-accordion-row-a11y > a > h5 > div > div.a-column.a-span4.a-text-right.a-span-last > span.a-size-medium.a-color-price.header-price',
			 price_fraction: "#posPromoPitchPrice > div > span:nth-child(3)",
			 shipping: "#priceBadging_feature_div > span > span",
			 shipping1: xDelay("#soldByThirdParty > span.a-size-small.a-color-secondary.shipping3P"),
			 shipping2: "#price-shipping-message > b",
			 shipping3: "#buyNewInner > div.a-section.a-spacing-small.a-spacing-top-micro > div > span > span > a",
			 shipping4: "#priceBadging_feature_div",
			 shipping5: "#ourprice_shippingmessage > i",
			 shipping6: "#ourprice_shippingmessage",
			 shipping7: "#usedPitchPrice > div.a-section.a-spacing-mini > div", // uk
			 prime: "#priceBadging_feature_div > i.a-icon-prime",
			 prime1: "#priceBadging_feature_div > i",
			 primt2: 'i[class^="a-icon a-icon-prime"]',
			 size: "#dropdown_selected_size_name > span > span > span",
			color: "#variation_color_name > div > span",
			condition: "#buyNewSection",
		   //	brand: 'div#leftCol.a-section div.a-section div.a-section div.a-section a.a-link-normal',
			 //details: x(['#feature-bullets > ul > li']),
		   //	description: '#productDescription',
			 dimensions: xDelay("#detail-bullets .bucket > div.content >ul > li:contains('Product Dimensions')"),
			 //dimensions1:"#detailBullets_feature_div > ul > li:nth-child(1) > span > span:contains('Product Dimensions')",
			 dimensions1: xDelay("#detailBullets_feature_div > ul > li:contains('Product Dimensions') > span"),
			 dimensions2: xDelay("#productDetails_detailBullets_sections1 > tbody > tr:contains('Product Dimensions')"),
			 package_dimensions: xDelay("tr:contains('Package Dimensions') > td.a-size-base"),
			 product_dimensions:xDelay( "tr:contains('Product Dimensions') > td.a-size-base"),
			 item_dimensions: xDelay("tr:contains('Item Dimensions  L x W x H') td.a-size-base"),
			 weight:xDelay("#detail-bullets .bucket > div.content >ul > li:contains('Shipping Weight')"),
			 item_weight: xDelay("tr:contains('Item Weight') > td.a-size-base"),
			 item_weight1: xDelay("#productDetails_detailBullets_sections1 > tbody > tr:contains('Item Weight')"),


			 shipping_weight: xDelay("li:contains('Shipping Weight')"),
			  shipping_weight1: xDelay("tr:contains('Shipping Weight')"),
			 shipping_weight2: xDelay("#detail-bullets > table > tbody > tr > td > div.content > ul > li:nth-child(1) > b"),
			 shipping_weight3: xDelay("#detail-bullets > table > tbody > tr > td > div.content > ul > li:contains('Shipping Weight') > b"),
			 shipping_weight4: xDelay('*[@id="detail-bullets"]/table/tbody/tr/td/div[2]/ul/li[1]/text()[1]'),
			 shipping_weight5: xDelay("#detailBullets_feature_div > ul > li:contains('Shipping Weight')> span"),
			 shipping_weight6: xDelay("#productDetails_detailBullets_sections1 > tbody > tr:contains('Shipping Weight')"),
			 category: xDelay("#wayfinding-breadcrumbs_feature_div"),
			 category1: xDelay("#wayfinding-breadcrumbs_container > ul > li:last-child"),

			// rank1: "#productDetails_detailBullets_sections1 > tbody > tr:contains('Best Sellers Rank')"),
			 rank1: "li:contains('Rank')",
			 rank2: xDelay("tr:contains('Rank')"),
			 rank3: "#SalesRank",

			 options: "#variation_size_name > div > span",
			 options1: "#shelf-label-size_name",
			 options2: "#productDetails_secondary_view_div > h3",
			 options3: "#quickPromoBucketContent > div.disclaim",


		 },
	 },
	 walmart: {
		 initialized: false,
		 initAttempts: 0,
		 setup: async(page) => {
			 //console.log("setup walmart ")

				 //	//console.log("click1")
				 try {
					 if (!page) {
						 console.log("page is not defined!")
						 return false;
					 }
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
					 //	await page.screenshot({ path: './walmart.png' });
					 // page.keyboard.press(String.fromCharCode(13));// press enter

					 await page.goto(url)
					 try {
						 //console.log("wait for page to load")
						 await page.waitForNavigation({timeout: 5*1000,waitUntil: "networkidle2"})
					 } catch(err) {
						 //console.log('Timeout WAITING ON PAGE LOAD ')
					 }
					 //console.log("assume page loaded")
					 return true;
				 } catch (err) {
					 //console.log("Error setting up walmart")
					 let bodyHTML = await page.evaluate(() => document.body.innerHTML);
 					//console.log("bodyHTML start:\n",bodyHTML)
					 return false;
				 }
		 },
		 // walmart selectors
		 selectors: {
				 title:'h1.prod-ProductTitle div',
				 price: 'span.hide-content span.price-characteristic',
				 price1: "#price > div > span.hide-content.display-inline-block-m",
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
		 initAttempts: 0,
	   setup: async(page) => {
			 try {
				 if (!page) {
					 console.log("page is not defined!")
					 return false;
				 }
				 var aurl =  page.url()
				 await page.goto("https://login.aliexpress.com/");
			     //await page.screenshot({ path: './star1.png' });
					 //console.log('wait for 3000')
					 await page.waitFor(5000);
					////console.log("click1")
					try {
						//	await page.screenshot({ path: './star3.png' });
						 await page.waitForSelector("#ws-xman-register-email","{timeout: 10000}");
						 console.log("found login page");

	 					let userId='techtown.mailorder@gmail.com'
						let password='admin@misd';

	 					await page.waitFor(1000);
						try {
								console.log("click on register")
							await page.click("#signInField > div > div > ul > li:first-child");
								await page.waitFor(2000);
							console.log("click on sign-in")

							await page.click("#signInField > div > div > ul > li:last-child");
								await page.waitFor(2000);
							console.log("focus on email")
							await page.focus("#ws-xman-register-email");
								await page.waitFor(1000);
								console.log('type email')
							await page.keyboard.type(userId)
						 	await page.waitFor(1000);
								console.log("focus on password")
		 					await page.focus('#ws-xman-register-password');
								await page.waitFor(1000);

									console.log('type password')
							await page.keyboard.type(password)
								await page.waitFor(1000);
									console.log("focus on submit")
							await page.focus('#ws-xman-register-submit');
							try {
								await page.focus('#ws-xman-register-submit');
								console.log("submit clicked")
							} catch(err) {
								console.log("Error during submit")
							}
								await page.waitFor(1000);
							//	console.log('click submit')
							//	await page.click("#login-form > div.fm-btn > button")
		 					//await page.click("#ws-xman-register-submit")


							 console.log("logged in as ",userId);
							 await page.waitFor(3000);

		 						try {
									console.log("switch to original URL")
									await page.goto(aurl)
									console.log("switched to original ulr:",aurl)
		 						//console.log("wait for page to load")
		 						await page.waitForNavigation({timeout: 5*1000,waitUntil: "networkidle2"})
		 					} catch(err) {
		 						console.log('Timeout WAITING ON PAGE LOAD ')
		 					}

						} catch(err) {
								console.log("Error attempting to login")
								let bodyHTML = await page.evaluate(() => document.body.innerHTML);
								console.log("bodyHTML start:\n",bodyHTML)
						}
					} catch(err) {
							console.log("******* No  login  page found. OK CONTINUE")
							let bodyHTML = await page.evaluate(() => document.body.innerHTML);
			 			  console.log("bodyHTML start:\n",bodyHTML)
					}
					 try {
						 // close ad popup
						 // check for login page

						  //console.log('wait for popup window (new-user)')
					  await page.waitForSelector("body > div.next-overlay-wrapper.opened > div.next-overlay-inner.next-dialog-container > div > a",{timeout:2000})
						await page.waitFor(1000);
						await page.evaluate(() => {
							document.querySelector("body > div.next-overlay-wrapper.opened > div.next-overlay-inner.next-dialog-container > div > a").click();
						});
						console.log("clicked of popup ")
						await page.waitFor(2000);
					} catch(err) {
						console.log("no popup found - 1st try")
						//console.log("could not find popup (new user) - try another way")
						try {
							await page.waitForSelector("body > div.ui-window.ui-window-normal.ui-window-transition.ui-newuser-layer-dialog > div > div > a",{timeout:2000})
							await page.click("body > div.ui-window.ui-window-normal.ui-window-transition.ui-newuser-layer-dialog > div > div > a")
							console.log("found popup - clicked on it")
						} catch(err) {
							//console.log("could not find popup (new user)")
							console.log('no popup found - 2nd try')
						}
				 }

					try {
						console.log('click  on change country')

						await page.evaluate(() => {
							document.querySelector("#switcher-info > span.ship-to").click();
						});
						console.log('click  on change country DONE')
					} catch(err) {
						console.log('Couuld not click on change country')
					}
			    await page.waitFor(2000);
					try {
						console.log('click on country')
				 		await page.click("div.switcher-shipto.item.util-clearfix > div > a:nth-child(1)")
				 		await page.waitFor(2000);
					} catch(err) {
						console.log('error clicking on country. Try another way')
						try {
						await page.click("div > a.address-select-trigger.address-select-trigger-active[href='#']")
						console.log('after click on country - 2nd try')
					} catch(err) {
						console.log('could not click on country')
					}
					}
					//console.log('focus div.switcher-shipto.item.util-clearfix > div > div:nth-child(4) > div > input')
 		  		await page.focus("div.switcher-shipto.item.util-clearfix > div > div:nth-child(4) > div > input");
			 		await page.waitFor(2000);
			 		////console.log("click2")
			 		await page.keyboard.type("united states")
			 		await page.waitFor(1000);
					//console.log('click div.switcher-shipto.item.util-clearfix > div > div:nth-child(4)')
					await page.click("div.switcher-shipto.item.util-clearfix > div > div:nth-child(4) > ul > li:nth-child(224) > span > span")
 					await page.waitFor(1000);
					//	await page.screenshot({ path: './star3.png' });
					// //console.log("click3")
				//	await page.screenshot({ path: './aliexpress1.png' });
					//console.log('click #nav-global > div.ng-item.ng-switcher')
			 		await page.click("div.switcher-btn.item.util-clearfix > button")
			 		//await page.waitForSelector("#j-product-detail-bd > div.detail-main > div > h1")
					//try {
						//console.log("wait for page to load")
					//	await page.waitForNavigation({timeout: 5*1000,waitUntil: "networkidle2"})
					//} catch(err) {
						//console.log("WAITING ON PAGE LOAD")
					//}
					//console.log("assume page loaded")
		 			//await page.waitFor(5000);
	   			//  await page.screenshot({path: './star7.png'});
					await page.goto(aurl)
					try {
						//console.log("wait for page to load")
						await page.waitForNavigation({timeout: 5*1000,waitUntil: "networkidle2"})
					} catch(err) {
						//console.log('Timeout WAITING ON PAGE LOAD ')
					}
			 		return true;
		  }catch(err) {
			   //console.log("Error setting up aliexpress")
			 //  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
			  // //console.log("bodyHTML start:\n",bodyHTML)
			   return false;
		   }
	   },
		 // aliexpress selectors
	   selectors: {
	     title: '#j-product-detail-bd > div.detail-main > div > h1',
	     title1: "#j-product-detail-bd  h1.product-name",
	     title2: "h1.product-name",
			 title3: "div.product-title",
			 title4: "div.product-info > div.product-title",
	     price: '#j-sku-price',
			 price1: "div.product-price",
			 price2: "div.product-price > div > span.product-price-value",
	     high_price: '#j-sku-discount-price > span:nth-child(2)',
	     sale_price: "#j-sku-discount-price",
	     image: xDelay('#magnifier > div.ui-image-viewer-thumb-wrap > a > img@src'),
			 image1: xDelay("div.image-view-magnifier-wrap > img@src"),
			 image2: "#j-image-thumb-list > li > span > img@src",
			 image3: "#poster@src",
	     shipping: "#j-product-shipping span.logistics-cost",
			 shipping1: "div.product-shipping",
			 shipping2: "div.product-info > div.product-shipping",
	     category: "body > div.ui-breadcrumb > div > h2 > a",
	     category1: 'body > div.ui-breadcrumb > div > a:nth-child(7)',
	     dimensions: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('Package Size:') > span.packaging-des",
	     dimensions1: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('حجم الحمولة:') > span.packaging-des",
	     weight: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('Package Weight') > span.packaging-des",
	     weight1: "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('وزن الحمولة:') > span.packaging-des",
	     options: "li.item-sku-image.active  > a@title",
	     options1: "div.product-desc li.packaging-item:contains('Unit Type') span.packaging-des",
			 ship_to_address: "#j-shipping-country",
	   }
	 }
 }

const x = Xray().driver(xRayChrome(	{
	viewPort:{ width:1280, height:800 },
		reset: async () => {
			console.log('in <x.reset>')
			try {
			Object.keys(sites).map(site => {
					sites[site].initialized = false;
					sites[site].initAttempts = 0;
				})
			} catch(err) {
				console.log("error during reset:",err)
			}
		},
    cl: async (page, ctx) => {
				console.log('in <x.cl> function:')
				console.log("<cl> ctx.url:",ctx.url)
				var urlinfo = parse(ctx.url, true);
				console.log('urlinfo:',urlinfo)
				var host= urlinfo ? urlinfo.host:null
				console.log('host:',host)
				// the following code can be replaced by a more concide loop (later!)
				//console.log("site map:",site_map[host])
				//console.log('initialized:',sites[site_map[host]].initialized)
			  //console.log('initAttempts:',sites[site_map[host]].initAttempts)
				if (sites[site_map[host]] && !sites[site_map[host]].initialized && sites[site_map[host]].initAttempts<3 ) {
						console.log("setup ",sites[site_map[host]])
						sites[site_map[host]].initialized = await sites[site_map[host]].setup(page);
						sites[site_map[host]].initAttempts++
						console.log("after setup  initialized:",sites[site_map[host]].initialized)
				}

      },
      navigationOptions: {
                timeout: 30000,
      },
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			headless:  true, 	// launch browser (false = show it)

		}
));

exports.scraper = async function(url) {
  console.log("in <scraper> ")
  var urlinfo = parse(url, true);
  console.log('<scraper> url:',url)
  var host= urlinfo ? urlinfo.host:null
  var site = site_map[host]? sites[site_map[host]]:null;

  ////console.log("sites:",site);
  if (!site) return null;
	if(site) {
		console.log("call xRay for url:",url)
		var result = await x(url,  site.selectors)
    console.log("xray result:",result)

    if (!result) return null;
		// cleanup results
		Object.keys(result).map(key => {
				result[key] = result[key].trim()
				result[key] = result[key].replace(/\s\s*/g, ' '); // remove whitespace and
			})
			//console.log("=>clean result:",result)

      //console.log("smart-product-scraper> after call from x-ray:")

			result.url = url;
      result.site = site_map[host]

      // copy values
			if(result.details)
			{
          //console.log("<smart-product-scraper> in object details")
				var details = [];
				result.details.forEach(function(element, index, array){
					details.push(element.trim());
				});
				result.details = details;
			}
			//console.log("result:",JSON.stringify(result))


        //console.log("<smart-product-scraper> got site:",result.site)
				//console.log("<smart-product-scraper> got ship_to_address:",result.ship_to_address);
        //console.log("<smart-product-scraper> got title:",result.title)
        //console.log("<smart-product-scraper> got shipping:",result.shipping)
				//console.log("<smart-product-scraper> got shipping1:",result.shipping1)
        //console.log("<smart-product-scraper> got condition:",result.condition)
        //console.log("<smart-product-scraper> got options:",result.options)
				//console.log("<smart-product-scraper> got options1:",result.options1)
				//console.log("<smart-product-scraper> got options2:",result.options2)
				//console.log("<smart-product-scraper> got options3:",result.options3)
        //console.log("<smart-product-scraper> got weight:",result.weight)
        //console.log("<smart-product-scraper> got dimensions:",result.dimensions)
        //console.log("<smart-product-scraper> got image:",result.image)
				  //console.log("<smart-product-scraper> got image1:",result.image1)
					  //console.log("<smart-product-scraper> got image2:",result.image2)
						 //console.log("<smart-product-scraper> got image3:",result.image3)
        //console.log("<smart-product-scraper> got brand:",result.brand)
        //console.log("<smart-product-scraper> got category:",result.category)
				//console.log("<smart-product-scraper> got category1:",result.category1)
        //console.log("<smart-product-scraper> got rank1:",result.rank1)
        //console.log("<smart-product-scraper> got rank2:",result.rank2)
				//console.log("<smart-product-scraper> got rank3:",result.rank3)
				//console.log("<smart-product-scraper> got price:",result.price)
				//console.log("<smart-product-scraper> got price1:",result.price1)
				//console.log("<smart-product-scraper> got price2:",result.price2)
					//console.log("<smart-product-scraper> got price3:",result.price3)
						//console.log("<smart-product-scraper> got price3:",result.price4)
  		  //console.log("<smart-product-scraper> got deal_price:",result.deal_price)
	   		//console.log("<smart-product-scraper> got sale_price:",result.sale_price)
  			//console.log("<smart-product-scraper> got price_fraction:",result.price_fraction)
				//console.log("<smart-product-scraper> got shipping:",result.shipping)
				//console.log("<smart-product-scraper> got shipping1:",result.shipping1)
				//console.log("<smart-product-scraper> got shipping2:",result.shipping2)
				//console.log("<smart-product-scraper> got shipping3:",result.shipping3)
				//console.log("<smart-product-scraper> got shipping4:",result.shipping4)
				//console.log("<smart-product-scraper> got shipping5:",result.shipping5)
				//console.log("<smart-product-scraper> got shipping6:",result.shipping6)
				//console.log("<smart-product-scraper> got prime:[",result.prime,"]")
				//console.log("<smart-product-scraper> got prime1:[",result.prime1,"]")
				//console.log("<smart-product-scraper> got prime2[:",result.prime2,"]")

       var usePrice = result.high_price || result.deal_price || result.sale_price ||
			 		result.price || result.price1 || result.price2  || result.price3 || result.price4 || result.price5 || result.used_price ;

      console.log("<smart-product-scraper> got usePrice:",usePrice)


      if(usePrice) {
        var mp = String(usePrice).match(/(?:^|\s)*(\$|USD|€|EUR|£)*(?:\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(\$|USD|€|EUR|£)*(?:\s|[a-z]|\/|;|-|\.)*(?!\S)/i)

				//	(?:^|\s)*(\$|USD|€|EUR|£)*(?:\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(\$|USD|€|EUR|£)*(?:[\(|\s|/])*(?:\s|\)|\s|\w|,|;)*(?:$)/i)

					// (?:\s|[a-z]|,|;)*(\$|USD|€|EUR|£)*(?:\s)*(\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?|\.\d+)(?:[\(|\s|/])*(?:\s|\)|\s|\w|,|;)*(?:$)/i)
        console.log("match price:",mp)
				var priceUnit = mp && mp.length>1? mp[1]? mp[1]:'':'';
				if (!priceUnit) priceUnit = mp && mp.length>3? mp[3]? mp[3]:'':'';
				//console.log("price Unit:",priceUnit)

        var price = mp && mp.length>2? mp[2]:'0';
				price = price.replace(/,/g, ''); // assume , is 1000 separator (later use Intl.NumberFormat)
				price = price && !isNaN(price)? parseFloat(price).toFixed(2):0;
				console.log("Extracted price:",price)
				switch(priceUnit) {
					case '':
					case '$':
					case 'USD':
						//console.log("price in USD or not specified");
						break;
					case '€':
					case "EUR":
					 //console.log("price in Euro");
					 price = parseFloat(price) * 1.14; // get conversion online
					 break;
					case '£':
					case 'GBP':
						//console.log("price in British pound")
						price = parseFloat(price) * 1.35; // get conversion online
						break;
					default:
					break;
				}
				price = parseFloat(price) + ((result.price_fraction && !isNaN(result.price_fraction)) ? parseFloat(result.price_fraction)/100.0 : 0);
				//console.log("final price:",price)
        result.price = price>0? parseFloat(price).toFixed(2):-1;
      } else {
				result.price = -1;
			}

		  const usePrime = 	result.prime == ''|| result.prime1 == '' || result.prime2 == '' ? "FREE":null;
			result.shipping5 = result.shipping5 != null? 'FREE':null;
			//console.log('usePime:',usePrime)
			var useShipping = result.shipping ||
			 	result.shipping1 || result.shipping2 ||
				result.shipping3 || result.shipping4 || result.shipping5	||result.shipping6 ||result.shipping7	|| usePrime;
			//console.log("useShipping:",useShipping)
      if(useShipping) {
				// look for FREE Shipping
        if (String(useShipping).match(/Free/i)) {
          result.shipping = 0;
        }  else {
					var ms = String(useShipping).match(/(?:\s|[a-z]|,|;)*(\$|USD|€|EUR|£)*(?:\s)*(\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?|\.\d+)(?:[\(|\s])*(?:\s|\)|\s|\w|,|;)*(?:$)/i)
					//console.log("match ship_price:",ms)
					var shipUnit = ms && ms.length>1? ms[1]? ms[1]:'':'';
					//console.log("Ship Unit:",shipUnit)

					var shipping = ms && ms.length>2? ms[2]:'0';
          //console.log("match shipping price:",shipping)
					switch(shipUnit) {
						case '':
						case '$':
						case 'USD':
							//console.log("shipUnit in USD or not specified");
							break;
						case '€':
						case "EUR":
						 //console.log("shipUnit in Euro");
						 shipping = parseFloat(shipping) * 1.14; // get conversion online
						 break;
						case '£':
						case 'GBP':
							//console.log("shipUnit in British pound")
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
			var useTitle = result.title || result.title1 || result.title2 || result.title3 || result.title4
			//console.log("useTitle:",useTitle)
			if(useTitle) {
        result.title = useTitle.replace(/Details about/i,'')

				result.title = result.title.trim();

      } else {
				result.title = "No Title!"
			}
      var hasOptions =
			 	[result.options ,
				result.options1,
				result.options2,
				result.options3,
				result.options4,
				result.options5,
				result.color,
				 result.size,
				 result.item_number].filter(Boolean).join('; ')
      if (hasOptions) {
				hasOptions = hasOptions.replace(/\s\s*/g, ' ');
        result.options =hasOptions
      }

      var useWeight = result.shipping_weight || result.shipping_weight1 ||
						result.shipping_weight2 ||result.shipping_weight3 || result.shipping_weight4
						|| result.shipping_weight5 || result.shipping_weight6 ||result.weight || result.weight1 || result.item_weight || result.item_weight1 ;
      //console.log("useWeight:",useWeight)
      if (useWeight) {

        var weight = 0;
					var m0 = String(useWeight).match	(/((?:\d{1,3})(?:,\d{1,3})*(?:\.\d{1,})?)(?:[\(|\s|\(])*(kg|lb|pound|ounces|ounce)?/i)
				//var m0 = String(useWeight).match(/((?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?|\.\d+)(?:[\(|\s|\(])*(kg|lb|pound|ounce)?/);
				// var m0 = String(useWeight).match(/^(?:\s)*(((?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?|\.\d+)(?:[\(|\s|\(])*(kg|lb|pound|ounce))?(?:\s|\))*(?:.)*/i);
	        //  var m0  = String(useWeight).match(/^(?:\s)*((?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?|\.\d+)(?:[\(|\s])*(kg|lb|pound|ounce)?(?:\s|\))*(?:$)/i)
					// (?:^|\s)*(\d*\.?\d+|\d	{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(kg|lb|pound|ounce)?(?:\s*)/i);
          //console.log("match weight:",m0)
          weight = m0 && m0.length > 0? m0[1]:0;
					var wUnit = m0 && m0.length > 1? m0[2]:'lb';
          //console.log("Extracted weight:", weight)
					//console.log("Extracted weight Unit:", wUnit)
					// convert to pound
        	switch(wUnit) {
						case 'kg':
						weight = parseFloat(weight)* 2.2
						break;
						case 'lb':
						case 'pound':
						 // no change
						 //console.log("already in pounds")
						break;
						case 'ounces':
						case 'ounce':
							weight = parseFloat(weight) / 16.0
						break;
						default:

					}
          result.weight = parseFloat(weight).toFixed(2);
          //console.log("Final weight: ",result.weight)
      }
      var useDimensions = result.package_dimensions || result.dimensions ||result.dimensions1
			||result.dimensions2 || result.product_dimensions || result.item_dimensions
			const package_dimensions = result.package_dimensions
      if (useDimensions) {
         var dim ;
        //  var m1 =  String(useDimensions).match(/\d+(?:\.\d*)*\s*?[x|X]\s*\d+(?:\.\d*)*\s*[x|X]\s*\d+(?:\.\d*)*\s*?/i);
				 var dim =  String(useDimensions).match(/(?:^|\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(inches|inch|in|cm|'|")?(?:\s)*[x|X](?:\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(inches|inch|in|cm|'|")?(?:\s)*[x|X](?:\s)*(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s)*(inches|inch|in|cm|'|")?(?:\s)*/i);
				 // match number with comma (optional) and fraction \b[0-9]{1,3}(,?[0-9]{3})*(\.[0-9]+)?\b|\.[0-9]+\b
				  //console.log("match dimensions:",dim)

          //
					if (dim && dim.length > 5) {
						var l = dim[1];
						var w = dim[3];
						var h = dim[5];
						var useUnit = dim && dim.length>6? dim[6] || dim[4] || dim[2]:'inch'
						//console.log("unit is:",useUnit);
						switch(useUnit) { // contains unit

							case 'cm':
								l = parseFloat(l) / 2.54;
							 	w= parseFloat(w) / 2.54;
								h = parseFloat(h) / 2.54;
								break;
							case 'in':
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
								break;

						}

						// adjust dimensions by max of 1inch or 10%
						// don't do this because we already do it again in DoCallculate
						result.shipping_box_dimensions_given = package_dimensions? true: false
						if (!package_dimensions) {
								l = Math.max(parseFloat(l)*1.1, parseFloat(l)+1.5)
								w = Math.max(parseFloat(w)*1.1, parseFloat(w)+1.5)
								h = Math.max(parseFloat(h)*1.15, parseFloat(h)+2)
						}
          	result.dimensions =parseFloat(l).toFixed(2) + ' x ' + parseFloat(w).toFixed(2) + ' x ' + parseFloat(h).toFixed(2);

					} else if (dim && dim.length>0){
						result.dimensions = dim && dim.length>0 ? dim[0]:''
					} else {
						result.dimensions = '0 x 0 x 0';
					}
         	//console.log('final dimensions:',result.dimensions)
      }

			if(result.brand) result.brand = result.brand.trim();
      var rankCatg = '';
			useRank = result.rank1 || result.rank2 || result.rank3
			if (useRank) {
				const rank_regex = /(?:in\s*)([a-z|\d| |&]*)/ig;
				let m;

					while ((m = rank_regex.exec(useRank)) !== null) {
					    // This is necessary to avoid infinite loops with zero-width matches
					    if (m.index === rank_regex.lastIndex) {
					        rank_regex.lastIndex++;
					    }
							//console.log('match:',m)

					    // The result can be accessed through the `m`-variable.
					    m.forEach((match, groupIndex) => {
					        //console.log(`Found match, group ${groupIndex}: ${match}`);
									if ( groupIndex % 2){  // IF ODD THEN USE THE GROUP
										rankCatg = rankCatg + " " + match;
									}
					    });
					}
			}


      var useCategory =[result.category , result.category1, result.category2, rankCatg].filter(Boolean).join(' ')  ;
			//console.log('useCategory:',useCategory)
			useCategory = useCategory? useCategory.replace(/\s\s+/g, ' '):''
			useCategory = useCategory? useCategory.replace(/Accessories|Acccessory/ig, ' '):''

      if (useCategory) {


         useCategory = useCategory.replace(/\/\&\.\[\]/,' ')
         //console.log("=>Final CATEGORY after cleanup:", useCategory)
         //category = String(useCategory).match(/[a-z][a-z\,\&\b\/\\ \(\)\[\]]+/i)
				  result.category = useCategory? useCategory:"general accessories"
      }
			var useImage = result.image || result.image1 || result.image2 || result.image3|| result.image4 || result.image5
			result.image = useImage;

			if (result.condition) {
				if (result.condition.match(/New without tags/i)) {
					result.condition = 'New No Box/Tags';
				}  else if (result.condition.match(/New/i)) {
						result.condition = 'New';
				}
				result.options = result.options + "; "+result.condition
				//console.log("final condition:",result.condition)
					//console.log("final options:",result.options)
			}
			//console.log("return result:",result)
      return result;

    }


	}
