import { APIRequestContext, expect, firefox } from "@playwright/test";
import * as fs from "fs";
import { data } from "./data";

export class BasePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async response_checker(request) {
    try {
      expect(request.ok()).toBeTruthy();
      return await request.json();
    } catch (err) {
      console.log(
        `Response status code is: ${request.status()}, & status text is: ${request.statusText()}, & text is: ${await request.text()}`
      );
      expect(request.ok()).toBeTruthy();
    }
  }

  async wordpress_site_login() {
    /**
     * "userAgent" - Added on browser.newContext to send the request using custom userAgent
     */

    fs.writeFile("state.json", '{"cookies":[],"origins": []}', function () {});

    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });

    await page.locator('//*[@id="user_login"]').fill(data.wordpress_site_data.username);
    await page.locator('//*[@id="user_pass"]').fill(data.wordpress_site_data.password);
    await page.locator('//*[@id="wp-submit"]').click();
    await page.waitForLoadState("networkidle");

    await page.context().storageState({ path: "state.json" });

    await browser.close();
  }

  /**
   * This below wordpress_nonce_cookie(page_url: string, locator: string, popup: boolean, popup_locator: string) function can be usable
   * to get wp-nonce value, login cookie and WooCommerce API Key for WordPress site.
   * Parameters:
   *  page_url: string = Provide the webpage url containing the wp-nonce
   *  locator: string = Provide the script id locator that contains the wp-nonce value
   *  popup: string = If wp-nonce exists on a pop-up of the given page, value is true else false
   *  popup_locator: string = Provide the locator for the pop-up to click and extract the wp-nonce value
   */
  async wordpress_nonce_cookie(page_url: string, locator: string, popup: boolean, popup_locator: string) {
    let header: { nonce: string; cookie: string; api_key: string } = {
      nonce: "",
      cookie: "",
      api_key: "",
    };

    // Get Cookie value
    let cookie_data = fs.readFileSync("state.json", "utf8");
    let parsed_data = JSON.parse(cookie_data);
    let cookie: string = "";
    let flag: boolean = false;

    for (let i: number = 0; i < parsed_data.cookies.length; i++) {
      if (parsed_data.cookies[i].name.includes("wordpress_logged_in")) {
        cookie = `${parsed_data.cookies[i].name}=${parsed_data.cookies[i].value}`;
        flag = true;
        break;
      }
    }

    if (flag == true) {
      header.cookie = cookie;
    } else {
      console.log("Cookie Not Found");
    }

    // Get Nonce & API Key
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(page_url, {
      waitUntil: "networkidle",
    });

    if (popup == true) {
      let nonce_value: string | null;
      await page.locator(popup_locator).click();
      nonce_value = await page.locator(locator).getAttribute("value");
      if (typeof nonce_value == "string") {
        header.nonce = nonce_value;
      }
    } else {
      let object_text = await page.locator(locator).innerText();
      let object_value = object_text.substring(object_text.indexOf("{"), object_text.lastIndexOf("}") + 1);

      let parsed_value: Record<string, any> = {};

      try {
        parsed_value = JSON.parse(object_value);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      if (parsed_value.hasOwnProperty("nonce")) {
        header.nonce = parsed_value.nonce;
      }
      if (parsed_value.hasOwnProperty("api")) {
        header.api_key = parsed_value.api.api_key;
      }
    }

    await browser.close();
    return header;
  }

  //Activate_plugin
  async activate_plugin(plugin_name: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    const activationLinkSelector = `//a[@id="activate-${plugin_name}"]`;
    //Go to Plugins page
    await page.goto(`${data.wordpress_site_data.url}/plugins.php`);

    const plugin_activate_showing = await page.isVisible(activationLinkSelector);

    if (plugin_activate_showing === true) {
      // Plugin needs to be activated
      await page.click(activationLinkSelector);
      await page.waitForLoadState('domcontentloaded');
      // Validate plugin activated
      expect(await page.isVisible(`//a[@id="deactivate-${plugin_name}"]`)).toBeTruthy();
      console.log(`${plugin_name}: Activated plugin`);
    } else {
      expect(await page.isVisible(`//a[@id="deactivate-${plugin_name}"]`)).toBeTruthy();
      console.log(`${plugin_name}: Plugin is already Activated`);
    }
  }

  //Deactivate_plugin
  async deactivate_plugin(plugin_name: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    const activationLinkSelector = `//a[@id="deactivate-${plugin_name}"]`;
    //Go to Plugins page
    await page.goto(`${data.wordpress_site_data.url}/plugins.php`);

    const plugin_activate_showing = await page.isVisible(activationLinkSelector);

    if (plugin_activate_showing === true) {
      // Plugin needs to be activated
      await page.click(activationLinkSelector);
      await page.waitForLoadState('domcontentloaded');
      // Validate plugin activated
      expect(await page.isVisible(`//a[@id="activate-${plugin_name}"]`)).toBeTruthy();
      console.log(`${plugin_name}: Deactivated plugin`);
    } else {
      expect(await page.isVisible(`//a[@id="activate-${plugin_name}"]`)).toBeTruthy();
      console.log(`${plugin_name}: Plugin is already Deactivated`);
    }
  }
}
