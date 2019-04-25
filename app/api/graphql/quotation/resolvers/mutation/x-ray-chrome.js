
// import { Context } from 'http-context';
// import * as Puppeteer from 'puppeteer';
// import  {Driver}  from 'x-ray-crawler';
const Context = require('http-context')
const Puppeteer = require('puppeteer')
const Driver = require('x-ray-crawler')
/**
 * Usage
 *
 * [[include:usage.md]]
 */

//
// export interface XRayChromeOptions extends Puppeteer.LaunchOptions {
//     /**
//      * The view port of the page
//      */
//     viewPort?: {
//         /**
//          * @default 1280
//          */
//         width: number;
//         /**
//          * @default 800
//          */
//         height: number;
//     };
//     /**
//      * A function that will be called after the page load and before the page content will be return giving the power to interact
//      * with the current page using puppeteer methods like page.click([selector]).
//      */
//     cl?: (page: Puppeteer.Page, ctx: Context) => void;
//     /**
//      * The options to set to page.goTo method.
//      */
//     navigationOptions?: Puppeteer.NavigationOptions;
// }


exports.xRayChrome = (options) => {

   let page, browser;
   let setup = false;
  // const defaults: XRayChromeOptions = {
  //       viewPort: { width: 1280, height: 800 }
  //   };
    var defaults = {
        viewPort: { width: 1280, height: 800 },
        args: ['--no-sandbox']
    };
    const {
        viewPort,
        cl,
        navigationOptions,
        ...launchOptions
    } = Object.assign({}, defaults, options);

    return async (ctx, done) => {
      try {
        console.log('launchOptions:',launchOptions)
        if (!browser) browser = await Puppeteer.launch(launchOptions);
      } catch( err) {
        console.log("Error lunching puppeteer:",err)
        done(err,null)
      }
        if (!page && browser) {
          page = await browser.newPage();
          await page.setViewport(viewPort);
        }

        try {

            await page.goto(ctx.url, navigationOptions);
            if (typeof cl === 'function' && !setup) {
              console.log("call cl function")
              await cl(page, ctx);
            }
            //console.log("after call to cl function call done?",setup)

            if (!ctx.body) {
                ctx.body = await page.content();
            }
            done(null, ctx);
        } catch (err) {
           done(err, null);
        }
        // need to close browser! will do that later but now keep open
        //await browser.close();
    };
};

//export default xRayChrome;
