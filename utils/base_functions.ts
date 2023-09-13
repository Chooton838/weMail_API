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

    await page
      .locator('//*[@id="user_login"]')
      .fill(data.wordpress_site_data.username);
    await page
      .locator('//*[@id="user_pass"]')
      .fill(data.wordpress_site_data.password);
    await page.locator('//*[@id="wp-submit"]').click();
    await page.waitForLoadState("networkidle");

    await page.context().storageState({ path: "state.json" });

    await browser.close();
  }

  /**
   * This below wordpress_nonce_cookie(page_url: string) function can be usable to get wp-nonce and login cookie for evry plugin.
   * Only need to provide the page url (page contains the nonce) as parameter and change the script locator value
   */
  async wordpress_nonce_cookie(page_url: string) {
    let header: { nonce: string; cookie: string; api_key: string } = {
      nonce: "",
      cookie: "",
      api_key: "",
    };
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

    // here change the locator value according to your script locator that contains nonce
    let wemail_text = await page.locator("#wemail-vendor-js-extra").innerText();
    let wemail_value = wemail_text.substring(
      wemail_text.indexOf("{"),
      wemail_text.lastIndexOf("}") + 1
    );

    try {
      var parsed_value = JSON.parse(wemail_value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    if (parsed_value) {
      header.nonce = parsed_value.nonce;
    } else {
      console.log("Nonce Not Found");
    }

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

    if (parsed_value.api.api_key) {
      header.api_key = parsed_value.api.api_key;
    } else {
      console.log("API Key Not Found");
    }

    await browser.close();
    return header;
  }
}
