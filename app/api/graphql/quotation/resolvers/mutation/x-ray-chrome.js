
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
          console.log('browser.newPage')
          page = await browser.newPage();
          await page.setViewport(viewPort);
          //await page.setExtraHTTPHeaders({'Cookie': 'language=en'});
        //  await page.setExtraHTTPHeaders({'x-update': '1'});
          console.log('set browser headers')
        //  await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
        //  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36');

        }


        try {
          try {
              console.log('goto:',ctx.url, 'navigationOption:',navigationOptions)
              await page.goto(ctx.url, navigationOptions);
          } catch(err) {
            console.log("error during page.goto. browser closed? relaunch browser and repeat newPage")

              browser = await Puppeteer.launch(launchOptions);
              if (!page && browser) {
                page = await browser.newPage();
                await page.goto(ctx.url, navigationOptions);
              }

          }

          if (typeof cl === 'function' && !setup) {
              console.log("call cl function")
              await cl(page, ctx);
          }
            //console.log("after call to cl function call done?",setup)

          if (!ctx.body) {
                ctx.body = await page.content();
          }
          try {
              console.log("wait for page to load")
              await page.waitForNavigation({timeout: 4*1000,waitUntil: "networkidle2"})
              console.log("PAGE LOADED SUCCESFULLY")
          } catch(err) {
              console.log('TIMEOUT WAITTING FOR PAGE LOAD ')
          }
          console.log("assume page loaded")
          done(null, ctx);
        } catch (err) {
           done(err, null);
        }
        // need to close browser! will do that later but now keep open
        //await browser.close();
    };
};

//export default xRayChrome;
