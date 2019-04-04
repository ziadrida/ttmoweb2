var Xray = require('x-ray')
	x = Xray(),
	xDelay = Xray().delay('1s','10s'),
	URL = require('url-parse'),
	cheerio = require('cheerio')
	request = require('request'),
	probe = require('probe-image-size');

exports.images = function(url, callback, scope){
  console.log("in <images> <product-scraper>")
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
          console.log('images.length:',_images && _images.length)
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
			original_price: '',
			sale_price: '',
			price: '',
			image: '',
			brand: '',
			details: '',
		//	description: '',
      category:'',
      dimensions:'',
      package_dimensions:'',
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
    var pageURL = 'http://www.amazon.com' + product_id;

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
console.log("in <scraper> opts:",opts)
	var data, lookup, self = this;
 console.log("this.sites[opts.site]:",this.sites[opts.site])
	if(this.sites[opts.site])
	{
		lookup = this.sites[opts.site](opts.product_id);
    console.log("lookup:",lookup)

		x(lookup.page, lookup.selectors)
		(function(err, obj){
      if (err) {
        console.log("Err from xray:",err)
      }
      console.log("after call from x-ray:")
			var _obj = obj;
			_obj.url = lookup.page;

      // copy values
			if(_obj.details)
			{
          console.log("<product-scraper> in object details")
				var details = [];
				_obj.details.forEach(function(element, index, array){
					details.push(element.trim());
				});
				_obj.details = details;
			}
          console.log("<product-scraper> got title:",_obj.title)

        console.log("<product-scraper> got weight:",_obj.weight)
        console.log("<product-scraper> got dimensions:",_obj.dimensions)

        console.log("<product-scraper> got brand:",_obj.brand)
        console.log("<product-scraper> got category:",_obj.category)
      _obj.site = opts.site;

      var usePrice = _obj.deal_price || _obj.sale_price || _obj.price;

        console.log("<product-scraper> got price:",usePrice)

        console.log("<product-scraper> got price_fraction:",_obj.price_fraction)
      if(usePrice) {
        var mp = String(usePrice).match(/\d+(?:\.\d*)?/)
        console.log("match price:",mp)
        var price = mp && mp.length > 0? mp[0]:0;
        _obj.price = price;
      }
			if(_obj.title) {
        _obj.title = _obj.title.trim();

      }

      var useWeight = _obj.shipping_weight || _obj.weight || _obj.item_weight ;
      console.log("useWeight:",useWeight)
      if (useWeight) {

        var weight = 0;

          var m0  = String(useWeight).match(/\d+(?:\.\d*)?\s*?/i);
          console.log("match weight:",m0)
          weight = m0 && m0.length > 0? m0[0]:0;
          console.log("Extracted weight:", weight)
          if ( String(useWeight).match(/ounc/)) {
            weight = weight/16.0
          } else   if ( String(useWeight).match(/kg/)) {
              weight = useWeight*2.2
          }
          _obj.weight = weight;
          console.log("Final weight: ",weight)
      }
      var useDimensions = _obj.package_dimensions || _obj.dimensions || _obj.product_dimensions || _obj.item_dimensions
      if (useDimensions) {
         var dim = "0 x 0 x 0";
          var m1 =  String(useDimensions).match(/\d+(?:\.\d*)*\s*?[x|X]\s*\d+(?:\.\d*)*\s*[x|X]\s*\d+(?:\.\d*)*\s*?/i);
          console.log("match dimensions:",m1)
          dim = m1 && m1.length > 0? String(m1[0]).toLowerCase():"0 x 0 x 0";
          if (String(useDimensions).match("inches")) {
            console.log("in inches!")
          }
          _obj.dimensions = dim;
          console.log("Final dimensions:",dim)
      }

			if(_obj.brand) _obj.brand = _obj.brand.trim();
      console.log("obj.category:",_obj.category)
      var category ;
      if (_obj.category) {
         category = String(_obj.category).match(/[a-z][a-z\,\&\b\/\\ \(\)\[\]]+/i)
         console.log("matched category:",category)
        _obj.category = category && category.length>0? category[0].trim():"general accessories"
      }

			if(1==2 && lookup.images && self)
			{
          console.log("<product-scraper> handle images self:",self)
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
      console.log("<product-scraper> call amazon scraper")
		this.scraper({
			site: 'amazon',
			product_id: parse.pathname + parse.query
		}, function(obj) {
      console.log("<product-scraper> after callback fom scraper");

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
      console.log("<product-scraper> after callback fom scraper ");
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
  console.log("in <product-scraper> init")
	if(!url || !callback) return false;
	this.parseURL(url, function(obj) {
    console.log("<product-scraper> after callback from parseURL")
    return callback(obj);

  });
}
exports.asyncInit =  async function(url){
    console.log("in <product-scraper> asyncInit")
  return new Promise((resolve, reject) => {
    this.init(url,  function(obj) {
      console.log("<product-scraper> after callback from init - resolve:",obj)
      resolve(obj);
    });
  })
}


// pass through for parseURL in case architecture changes
