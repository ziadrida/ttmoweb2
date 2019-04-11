var Xray = require('x-ray')
	x = Xray(),
	xDelay = Xray().delay('1s','10s'),
	URL = require('url-parse'),
	cheerio = require('cheerio')
	request = require('request'),
	probe = require('probe-image-size');

exports.images = function(url, callback, scope){
  console.log("in <images> <product-scraper-lib>")
	request(url, function(err, resp, html){
    console.log(" exports.images <request> after callback html:")
		var $ = cheerio.load(html);
		var minThreshold = 400;
		var scope = (scope) ? scope : 'body';
    console.log('scope:')
		var _images = [], _index = 0, totalImages = $(scope).find('img[src]').length;

		$(scope).find('img[src]').each(function(){
			var src = $(this).attr('src');
			probe({ url: src, timeout: 2500 }, function(err, result){
				if(result && result.mime !== 'image/gif' && result.width > minThreshold)
				{
					_images.push({
						width: result.width,
						height: result.height,
						src: src
					});
				}

				_index++;
				if(_index == totalImages)
				{
					_images.sort(function(a,b){
						return b.width - a.width;
					});

					_images = _images.splice(0, 4);
          //console.log('images.length:',_images && _images.length)
					if(typeof callback == 'function') callback(_images);
				}
			});
		});

	});

}

exports.sites = {
	base: function(){
		return {
			title: '',
			price: '',
			image: '',
      category:'',
      dimensions:'',

		};
	},
	amazon: function(product_id){

		var productSelector = this.base();

		productSelector.title = '#productTitle';
		productSelector.original_price = x('#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base.a-text-strike');
		productSelector.image = xDelay('#landingImage@data-old-hires');
		productSelector.sale_price = '#priceblock_saleprice';
    productSelector.deal_price = "#priceblock_dealprice";
		productSelector.price = '#priceblock_ourprice';
		productSelector.brand = 'div#leftCol.a-section div.a-section div.a-section div.a-section a.a-link-normal';
		productSelector.details = x(['#feature-bullets > ul > li']);
		productSelector.description = '#productDescription';
    productSelector.dimensions = "#detail-bullets .bucket > div.content >ul > li:contains('Product Dimensions')";
    productSelector.package_dimensions = "tr:contains('Package Dimensions') > td.a-size-base"
    productSelector.product_dimensions = "tr:contains('Product Dimensions') > td.a-size-base"
    productSelector.item_dimensions = "tr:contains('Item Dimensions  L x W x H') td.a-size-base"
    productSelector.weight ="#detail-bullets .bucket > div.content >ul > li:contains('Shipping Weight')"
    productSelector.shipping_weight = "tr:contains('Shipping Weight') > td.a-size-base";
    productSelector.item_weight = "tr:contains('Item Weight') > td.a-size-base";
    productSelector.category = "#wayfinding-breadcrumbs_container > ul > li:last-child"
    productSelector.rank1 = "#productDetails_detailBullets_sections1 > tbody > tr:contains('Best Seller') >td a"
    productSelector.rank2 = "#SalesRank"
    productSelector.options = "#variation_size_name > div > span";
		productSelector.options1 = "#shelf-label-size_name";
    var pageURL = 'http://www.amazon.com' + product_id;

		return {
			page: pageURL,
			selectors: productSelector,
			images: false
		};

	},
  ebay: function(product_id){
    console.log("ebay product_id:",product_id)
		var productSelector = this.base();


    productSelector.title = '#itemTitle'; // remove Details about
    productSelector.price = '#prcIsum';
      productSelector.image = xDelay('#icImg@src');
    productSelector.shipping = "#fshippingCost > span";
   productSelector.category = "li.bc-w:first-child span"
    productSelector.category1 = "li.bc-w:last-child span"
    productSelector.condition = '#vi-itm-cond'
    productSelector.item_number = '#descItemNumber'

      var pageURL = 'http://www.ebay.com' + product_id;

		return {
			page: pageURL,
			selectors: productSelector,
			images: false
		};

	},
  aliexpress: function(product_id) {
      console.log("aliexpress product_id:", product_id)
      var productSelector = this.base();


      productSelector.title = '#j-product-detail-bd > div.detail-main > div > h1';
      productSelector.title1 = "#j-product-detail-bd  h1.product-name"
      productSelector.title2 = "h1.product-name"
      productSelector.price = '#j-sku-price';
			productSelector.sale_price = "#j-sku-discount-price"


      productSelector.image = xDelay('#magnifier > div.ui-image-viewer-thumb-wrap > a > img@src');

      productSelector.shipping = "#j-product-shipping span.logistics-cost";

      productSelector.category = "body > div.ui-breadcrumb > div > h2 > a"
      productSelector.category1 = 'body > div.ui-breadcrumb > div > a:nth-child(7)';
      productSelector.dimensions = "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('Package Size:') > span.packaging-des"
      productSelector.weight = "#j-product-desc > div.ui-box.pnl-packaging-main > div.ui-box-body > ul > li:contains('Package Weight') > span.packaging-des"
      productSelector.options = "li.item-sku-image.active  > a@title"
			productSelector.options1 = "div.product-desc li.packaging-item:contains('Unit Type') span.packaging-des"
      //  productSelector.condition = '#vi-itm-cond'
      var pageURL = 'http://www.aliexpress.com' + product_id;

		return {
			page: pageURL,
			selectors: productSelector,
			images: false
		};

	},
	bestbuy: function(path) {

		var productSelector = this.base();

		productSelector.title = '#sku-title > h1';
		productSelector.price = '#priceblock-wrapper-wrapper > div.price-block.priceblock-large > div.pucks-and-price > div.item-price';
		productSelector.details = x(['#features .feature']);
		productSelector.description = '#long-description';
		productSelector.image = xDelay('meta[property="og:image"]@content');

		var pageURL = 'http://www.bestbuy.com/site/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

	},
	etsy: function(path){

		var productSelector = this.base();

		productSelector.title = '#listing-page-cart-inner > h1 > span';
		productSelector.price = '#listing-price > span > span.currency-value';
		productSelector.details = x(['#item-overview > ul > li']);
		productSelector.description = '#description-text';
		productSelector.image = xDelay('#image-0@data-large-image-href');

		var pageURL = 'https://www.etsy.com/listing/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

	},
	target: function(path){

		var productSelector = this.base();

		productSelector.title = x('#ProductDetailsTop > div:nth-child(6) > div.contentRight.primaryImgContainer > h2 > span');
		productSelector.image = xDelay('#heroImage@src');
		productSelector.price = '#price_main > div > span > span';
		productSelector.description = '#item-overview > div > div:nth-child(1) > div:nth-child(1) > div > p > span';
		productSelector.details = x(['#item-overview > div > div:nth-child(1) > div:nth-child(1) > ul li']);

		var pageURL = 'http://www.target.com/p/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

	},
	walmart: function(path){

		var productSelector = this.base();

	//	productSelector.title = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div.Grid.Grid--gutters.clearfix.prod-title-section > div > h1 > span';
  //                    body > div:nth-child(2) > div > div > div.js-body-content > div > div.atf-content > div > div.atf-content > div > div > div > div > div.Grid > div.Grid > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div > div.hide-content-max-m.prod-TitleSection.hf-BotRow > div:nth-child(1) > p > a
  //	productSelector.price = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div:nth-child(6) > div.Grid-col.u-size-6-12-m.u-size-5-12-l > div > div:nth-child(2) > div > div.product-buying-table-row.js-product-offers-row.product-buying-table-row-alt.product-buying-table-row-hero-price.bot-carousel-padding > div > div:nth-child(2) > div > div.js-price-display.price.price-display';
    productSelector.title ='h1.prod-ProductTitle div';//'body > div:nth-child(2) > div > div > div.js-body-content > div > div.atf-content > div > div.atf-content > div > div > div > div > div.Grid > div.Grid > div:nth-child(2) > div:nth-child(1) > div > div > div > div.hide-content-max-m.prod-TitleSection.hf-BotRow > div > h1 > div';
    productSelector.price = 'span.hide-content span.price-characteristic';//'span.hide-content span:nth-of-type(n+2)' //'#price > div > span.hide-content.display-inline-block-m > span > span > span.price-characteristic'
    productSelector.price_fraction = 'span.hide-content span.price-mantissa';//'#price > div > span.hide-content.display-inline-block-m > span > span > span.price-mantissa';
    productSelector.currency = '#price span.price-currency';

    productSelector.brand = 'div.hide-content.display-inline-block-m.valign-middle.secondary-info-margin-right.copy-mini > a > span'
    productSelector.image =  xDelay('div.hover-zoom-hero-image-container > img@src')

    productSelector.shipping =  'span.free-shipping-msg';
    productSelector.dimensions =  'div.Specification-container > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > div'
    productSelector.category = 'li.breadcrumb.active > a'
    productSelector.description = 'div.about-desc'
    var pageURL = 'http://www.walmart.com/ip/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};
      //productSelector.image =    xDelay('body > div.page-wrapper.js-header-content > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div:nth-child(6) > div.Grid-col.u-size-6-12-m.u-size-7-12-l.product-psuedo-half > div > div > div.js-product-media > div > div.Grid > div.Grid-col.u-size-10-12-l.js-hero-image-container.hero-image-container > div > div > div > img@src');

	}

};

exports.scraper = function(opts, callback){
console.log("in <scraper> ")
	var data, lookup, self = this;
 console.log("this.sites:",this.sites);
 console.log("opts.site:",opts.site)
	if(this.sites &&this.sites[opts.site])
	{
		lookup = this.sites[opts.site](opts.product_id);
    console.log("lookup:",lookup)

		x(lookup.page, lookup.selectors)
		(function(err, obj){
      if (err) {
        console.log("Err from xray:",err)
      } else {

      console.log("after call from x-ray:")
			var _obj = obj;
			_obj.url = lookup.page;

      // copy values
			if(_obj.details)
			{
          console.log("<product-scraper-lib> in object details")
				var details = [];
				_obj.details.forEach(function(element, index, array){
					details.push(element.trim());
				});
				_obj.details = details;
			}
        console.log("<product-scraper-lib> got site:",_obj.site)
        console.log("<product-scraper-lib> got title:",_obj.title)
        console.log("<product-scraper-lib> got shipping:",_obj.shipping)
        console.log("<product-scraper-lib> got condition:",_obj.condition)
        console.log("<product-scraper-lib> got options:",_obj.options)
        console.log("<product-scraper-lib> got weight:",_obj.weight)
        console.log("<product-scraper-lib> got dimensions:",_obj.dimensions)
        console.log("<product-scraper-lib> got image:",_obj.image)
        console.log("<product-scraper-lib> got brand:",_obj.brand)
        console.log("<product-scraper-lib> got category:",_obj.category)
        console.log("<product-scraper-lib> got rank1:",_obj.rank1)
        console.log("<product-scraper-lib> got rank2:",_obj.rank2)
        _obj.site = opts.site;
  		  console.log("<product-scraper-lib> got deal_price:",_obj.deal_price)
	   		console.log("<product-scraper-lib> got sale_price:",_obj.sale_price)
		    console.log("<product-scraper-lib> got price:",_obj.price)
       var usePrice = _obj.deal_price || _obj.sale_price || _obj.price;

      console.log("<product-scraper-lib> got usePrice:",usePrice)

      console.log("<product-scraper-lib> got price_fraction:",_obj.price_fraction)
      if(usePrice) {
        var mp = String(usePrice).match(/^(?:\s|[a-z]|,|;)*(\$|USD|€|EUR|£)*(?:\s)*(\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?|\.\d+)(?:[\(|\s])*(?:\s|\)|\s|\w|,|;)*(?:$)/i)
        console.log("match price:",mp)
				var priceUnit = mp && mp.length>1? mp[1]? mp[1]:'':'';
				console.log("price Unit:",priceUnit)

        var price = mp && mp.length>2? mp[2]:0;
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
				price = parseFloat(price) + ((_obj.price_fraction && !isNaN(_obj.price_fraction)) ? parseFloat(_obj.price_fraction) : 0);
				console.log("final price:",price)
        _obj.price = price>0? parseFloat(price).toFixed(2):-1;
      } else {
				_obj.price = -1;
			}


      if(_obj.shipping) {

        if (String(_obj.shipping).match('/Free/i')) {
          _obj.shipping = 0;
        }  else {
          var ship_price = String(_obj.shipping).match(/\d+(?:[.,]\d*)?/)
          console.log("match ship_price:",ship_price)
          var s_price = ship_price && ship_price.length > 0? ship_price[0]:0;
          _obj.shipping = s_price;
        }

      } else {
				  _obj.shipping = -1;
			}
			var useTitle = _obj.title || _obj.title1 || _obj.title2
			console.log("useTitle:",useTitle)
			if(useTitle) {
        if (_obj.site == 'ebay')    _obj.title = useTitle.replace('Details about','')

				_obj.title = useTitle.trim();

      } else {
				_obj.title = "No Title!"
			}
      var hasOptions = [_obj.options ,_obj.options1 , _obj.color, _obj.size, _obj.item_number].filter(Boolean).join('; ')
      if (hasOptions) {

        _obj.options =hasOptions
      }

      var useWeight = _obj.shipping_weight || _obj.weight || _obj.item_weight ;
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
          _obj.weight = parseFloat(weight).toFixed(2);
          console.log("Final weight: ",_obj.weight)
      }
      var useDimensions = _obj.package_dimensions || _obj.dimensions || _obj.product_dimensions || _obj.item_dimensions
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

          	_obj.dimensions =parseFloat(l).toFixed(2) + ' x ' + parseFloat(w).toFixed(2) + ' x ' + parseFloat(h).toFixed(2);

					} else if (dim && dim.length>0){
						_obj.dimensions = dim && dim.length>0 ? dim[0]:''
					} else {
						_obj.dimensions = '0 x 0 x 0';
					}
         	console.log('final dimensions:',_obj.dimensions)
      }

			if(_obj.brand) _obj.brand = _obj.brand.trim();
      console.log("obj.category:",_obj.category)
      var useCategory =[_obj.category , _obj.category1, _obj.rank1 , _obj.rank2].filter(Boolean).join(' ')  ;

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

         _obj.category = useCategory? useCategory:"general accessories"
      }


			if(1==2 && lookup.images && self)
			{
          console.log("<product-scraper-lib> handle images self:",self)
				  self.images(_obj.url, function(images){
  					_obj.images = images;
            console.log("*** return _obj")
  					callback(_obj);
				});
			}
			else
			{
        console.log("*** return _obj no images")
				callback(_obj);
			}
    }
		});

	}
	else
	{
		var selectors = {
			brand: '[itemprop="brand"]',
			description: '[itemprop="description"]',
			title: 'meta[property="og:title"]@content',
			image: xDelay('[itemprop="image"]@src'),
			price: '[itemprop="price"]'
		};

		x(opts.url, selectors)
		(function(err, obj){

			self.images(opts.url, function(images){
				obj.images = images;
				callback(obj);
			});

		});
	}
}

exports.parseURL = function(url, callback){
console.log('in <parseURL>')
	var parse = new URL(url);

	if(parse.host == 'www.amazon.com')
	{
      console.log("<product-scraper-lib> call amazon scraper")
		this.scraper({
			site: 'amazon',
			product_id: parse.pathname + parse.query
		}, function(obj) {
      console.log("<product-scraper-lib> after callback fom scraper");

      return callback(obj);
    });
	} else if (parse.host == 'www.ebay.com')
  	{
        console.log("<product-scraper-lib> call ebay scraper parse:",parse)
  		this.scraper({
  			site: 'ebay',
  			product_id: parse.pathname + parse.query
  		}, function(obj) {
        console.log("<product-scraper-lib> after callback fom scraper");

        return callback(obj);
      });
  	} else if (parse.host == 'www.aliexpress.com')
    	{
          console.log("<product-scraper-lib> call ebay scraper parse:",parse)
    		this.scraper({
    			site: 'aliexpress',
    			product_id: parse.pathname + parse.query
    		}, function(obj) {
          console.log("<product-scraper-lib> after callback fom scraper");

          return callback(obj);
        });
    	}
	else if(parse.host == 'www.bestbuy.com')
	{
		this.scraper({
			site: 'bestbuy',
			product_id: parse.pathname.replace('/site/','') + parse.query
		}, callback);
	}
	else if(parse.host == 'www.etsy.com')
	{
		this.scraper({
			site: 'etsy',
			product_id: parse.pathname.replace('/listing/','')
		}, callback);
	}
	else if(parse.host == 'www.target.com')
	{
		var matches = parse.pathname.match(/\/p\/(.*)/);
		var path = (matches[1]) ? matches[1] : false;

		this.scraper({
			site: 'target',
			product_id: path
		}, callback);
	}
	else if(parse.host == 'www.walmart.com')
	{
    console.log("product_id:",parse.pathname.replace('/ip/',''))
		this.scraper({
			site: 'walmart',
			product_id: parse.pathname.replace('/ip/','')
		}, function(obj) {
      console.log("<product-scraper-lib> after callback fom scraper ");
      return callback(obj);
    });

	}
	else
	{
		this.scraper({
			site: false,
			url: url
		}, callback);
	}

}

exports.init =  function(url, callback){
  console.log("in <product-scraper-lib> init")
	if(!url || !callback) return false;
	this.parseURL(url, function(obj) {
    console.log("<product-scraper-lib> after callback from parseURL")
    return callback(obj);

  });
}
exports.asyncInit =  async function(url){
    console.log("in <product-scraper-lib> asyncInit")
  return new Promise((resolve, reject) => {
    this.init(url,  function(obj) {
      console.log("<product-scraper-lib> after callback from init - resolve:",obj)
      resolve(obj);
    });
  })
}


// pass through for parseURL in case architecture changes
