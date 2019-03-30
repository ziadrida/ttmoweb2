var Xray = require('x-ray')
	x = Xray(),
	xDelay = Xray().delay('1s','3s'),
	URL = require('url-parse'),
	cheerio = require('cheerio')
	request = require('request'),
	probe = require('probe-image-size');

exports.images = function(url, callback, scope){

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
			description: ''
		};
	},
	amazon: function(product_id){

		var productSelector = this.base();

		productSelector.title = '#productTitle';
		productSelector.original_price = x('#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base.a-text-strike');
		productSelector.image = xDelay('#landingImage@data-old-hires');
		productSelector.sale_price = '#priceblock_saleprice';
		productSelector.price = '#priceblock_ourprice';
		productSelector.brand = '#brand';
		productSelector.details = x(['#feature-bullets > ul > li']);
		productSelector.description = '#productDescription';

		var pageURL = 'http://www.amazon.com' + product_id;

		return {
			page: pageURL,
			selectors: productSelector,
			images: true
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

		productSelector.title = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div.Grid.Grid--gutters.clearfix.prod-title-section > div > h1 > span';
  //                    body > div:nth-child(2) > div > div > div.js-body-content > div > div.atf-content > div > div.atf-content > div > div > div > div > div.Grid > div.Grid > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div > div.hide-content-max-m.prod-TitleSection.hf-BotRow > div:nth-child(1) > p > a
  //	productSelector.price = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div:nth-child(6) > div.Grid-col.u-size-6-12-m.u-size-5-12-l > div > div:nth-child(2) > div > div.product-buying-table-row.js-product-offers-row.product-buying-table-row-alt.product-buying-table-row-hero-price.bot-carousel-padding > div > div:nth-child(2) > div > div.js-price-display.price.price-display';
    productSelector.price = '#price > div > span.hide-content.display-inline-block-m > span > span > span.price-characteristic'
		productSelector.brand = '#WMItemBrandLnk > span';
		productSelector.image = xDelay('body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div:nth-child(6) > div.Grid-col.u-size-6-12-m.u-size-7-12-l.product-psuedo-half > div > div > div.js-product-media > div > div.Grid > div.Grid-col.u-size-10-12-l.js-hero-image-container.hero-image-container > div > div > div > img@src');
		productSelector.description = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.ResponsiveContainer.about-container > div.Grid.Grid--gutters > div.Grid-col.u-size-8-12-m > div > div.about-item-complete.js-slide-panel-content.hide-content.display-block-m > section > div > p:nth-child(2)';

		var pageURL = 'http://www.walmart.com/ip/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

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
      console.log("<product-scraper> call x-ray")
		x(lookup.page, lookup.selectors)
		(function(err, obj){
      if (err) {
        console.log("Err from xray:",err)
      }
      console.log("after call from x-ray:")
			var _obj = obj;
			_obj.url = lookup.page;

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
        console.log("<product-scraper> got price:",_obj.price)
          console.log("<product-scraper> got brand:",_obj.brand)
			if(_obj.title) {
        _obj.title = _obj.title.trim();

        }
			if(_obj.price) _obj.price = _obj.price.trim();
			if(_obj.brand) _obj.brand = _obj.brand.trim();

			if(lookup.images)
			{
          console.log("<product-scraper> handle images")
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
    console.log("AFTER CALLBACK!")
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
