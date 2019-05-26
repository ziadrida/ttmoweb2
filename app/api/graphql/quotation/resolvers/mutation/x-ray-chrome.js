
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
   let pages = []
   let pageIdx =0;
   let inUsePageIdx =0;
   let maxPages = 5;

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
        reset,
        navigationOptions,
        ...launchOptions
    } = Object.assign({}, defaults, options);

    resetBrowser = async () => {
      console.log('in <resetBrowser')
        if(browser){
          await browser.close();
          browser= null;
        }
        pages = []
        pageIdx =0;
        inUsePageIdx =0
        if (typeof reset === 'function') {
            console.log("call reset function")
            await reset();
        }
        console.log('end of <resetBrowsere>')
      }

    return async (ctx, done) => {
      try {
        console.log('launchOptions:',launchOptions)
        if (!browser) browser = await Puppeteer.launch(launchOptions);
      } catch( err) {
        console.log("Error lunching puppeteer:",err)
        await resetBrowser();

        console.log('return error:',err)
        return done(err,null)
      }




     // pick a page to use
      inUsePageIdx = pageIdx++ % maxPages;
      console.log("inUsePageIdx:",inUsePageIdx)
      page = inUsePageIdx > pages.length-1 ? null: pages[inUsePageIdx]
      try {
        if (!page && browser) {
          console.log('browser.newPage')
            page = await browser.newPage();
            pages.push(page)
            await page.setViewport(viewPort);

          //await page.setExtraHTTPHeaders({'Cookie': 'language=en'});
          //  await page.setExtraHTTPHeaders({'x-update': '1'});
          console.log('set browser headers')
          //  await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
          //  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36');
        } else {
          console.log('use existing page inUsePageIdx:',inUsePageIdx)
        }
      } catch(err) {
        console.log("failed to create newPage");
        await resetBrowser();
        return done(err,null)
      }

        try {
          try {
              console.log('goto:',ctx.url, 'navigationOption:',navigationOptions)
              await page.goto(ctx.url, navigationOptions);
              console.log('after goto:',ctx.url)
          } catch(err) {
            console.log("error during page.goto. browser closed? relaunch browser and repeat newPage")

            // browser = await Puppeteer.launch(launchOptions);consol
             await resetBrowser();
             return done(err, null);

          }

          try {
              console.log("wait for page to load1")
              if (typeof cl === 'function') {

                  console.log("call cl function inUsePageIdx:",inUsePageIdx)
                  await cl(page, ctx);
                  console.log("after cl function call  inUsePageIdx:",inUsePageIdx)
              }
              await page.waitForNavigation({timeout: 1*1000,waitUntil: "networkidle2"})
              console.log("PAGE LOADED SUCCESFULLY1")
          } catch(err) {
              console.log('TIMEOUT WAITTING FOR PAGE LOAD ')
                console.log("assume page loaded1")
          }
          if (!ctx.body) {
                  ctx.body = await page.content();
                console.log("after page.content call  inUsePageIdx:",inUsePageIdx)
          }
          try {
              console.log("wait for page to load2")
              await page.waitForNavigation({timeout: 1*1000,waitUntil: "loaded"})
              console.log("PAGE LOADED SUCCESFULLY2")
          } catch(err) {
              console.log('TIMEOUT WAITTING FOR PAGE LOAD ')
          }
          console.log("assume page loaded2")
          return done(null, ctx);
        } catch (err) {
          console.log("catch error:",err)
          if (typeof reset === 'function') {
              console.log("call reset function")
              await reset();
          }
           return done(err, null);
        }
        // need to close browser! will do that later but now keep open
        //await browser.close();
    };

};

//export default xRayChrome;
