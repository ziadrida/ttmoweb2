import  {Driver}  from 'x-ray-crawler';
import { Context } from 'http-context';
import * as Puppeteer from 'puppeteer';


/**
 * Usage
 *
 * [[include:usage.md]]
 */


export interface XRayChromeOptions extends Puppeteer.LaunchOptions {
    /**
     * The view port of the page
     */
    viewPort?: {
        /**
         * @default 1280
         */
        width: number;
        /**
         * @default 800
         */
        height: number;
    };
    /**
     * A function that will be called after the page load and before the page content will be return giving the power to interact
     * with the current page using puppeteer methods like page.click([selector]).
     */
    cl?: (page: Puppeteer.Page, ctx: Context) => void;
    /**
     * The options to set to page.goTo method.
     */
    navigationOptions?: Puppeteer.NavigationOptions;
}


export const xRayChrome = (options: XRayChromeOptions = {}): Driver => {

   let page, browser;
   let setup = false;
    const defaults: XRayChromeOptions = {
        viewPort: { width: 1280, height: 800 }
    };
    const {
        viewPort,
        cl,
        navigationOptions,
        ...launchOptions
    } = Object.assign({}, defaults, options);

    return async (ctx, done) => {

        if (!browser) browser = await Puppeteer.launch(launchOptions);

        if (!page) {
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

export default xRayChrome;
