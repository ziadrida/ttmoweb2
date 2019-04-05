/* global __meteor_runtime_config__ */
/* eslint no-undef: "error" */
import { BrowserPolicy } from 'meteor/browser-policy';

// Disallow all rules
BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.disallowConnect();

// Google fonts

BrowserPolicy.content.allowEval('http://fonts.googleapis.com');
BrowserPolicy.content.allowFontDataUrl('http://fonts.googleapis.com');

// Facebook login
BrowserPolicy.content.allowScriptOrigin('https://connect.facebook.net');
BrowserPolicy.content.allowFrameOrigin('https://staticxx.facebook.com');
BrowserPolicy.content.allowFrameOrigin('https://www.facebook.com');
BrowserPolicy.content.allowConnectOrigin('https://graph.facebook.com');
BrowserPolicy.content.allowImageOrigin('https://www.facebook.com');
BrowserPolicy.content.allowImageOrigin('https://www.amazon.com');
BrowserPolicy.content.allowImageOrigin('https://www.ebay.com');
BrowserPolicy.content.allowImageOrigin('https://www.walmart.com');
BrowserPolicy.content.allowImageOrigin('https://www.bestbuy.com');
BrowserPolicy.content.allowImageOrigin('https://www.aliexpress.com');
BrowserPolicy.content.allowImageOrigin('https://i5.walmartimages.com');
BrowserPolicy.content.allowImageOrigin('https://images-na.ssl-images-amazon.com');
BrowserPolicy.content.allowImageOrigin('https://images-na');
BrowserPolicy.content.allowImageOrigin('https://i.ebayimg.com');
BrowserPolicy.content.allowImageOrigin('https://ae01.alicdn.com');
BrowserPolicy.content.allowImageOrigin('https://ae01');

BrowserPolicy.content.allowImageOrigin('https://i5');
BrowserPolicy.content.allowImageOrigin('https://i5.wal.co');
// Allow Meteor DDP Connections
const rootUrl = __meteor_runtime_config__.ROOT_URL;
console.log(`ROOT_URL: ${rootUrl}`);

BrowserPolicy.content.allowConnectOrigin(rootUrl);
BrowserPolicy.content.allowConnectOrigin(rootUrl.replace(/http(s?)/, 'ws$1'));
BrowserPolicy.content.allowConnectOrigin('https://protected-thicket-49120.herokuapp.com/webhook');
