import { APIRequestContext, expect, firefox } from "@playwright/test";
import * as fs from "fs";
import { data } from "./data";

export class BasePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Response-checker
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

  //Wordpress-login
  async wordpress_site_login() {
    /**
     * "userAgent" - Added on browser.newContext to send the request using custom userAgent
     */

    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data[0], { waitUntil: "networkidle" });

    await page.locator('//*[@id="user_login"]').fill(data.wordpress_site_data[1]);
    await page.locator('//*[@id="user_pass"]').fill(data.wordpress_site_data[2]);
    await page.locator('//*[@id="wp-submit"]').click();
    await page.waitForLoadState("networkidle");

    fs.writeFile("state.json", '{"cookies":[],"origins": []}', function () {});
    await page.context().storageState({ path: "state.json" });

    return page;
  }

  //Store-wordpress-nonce-cookie
  async wordpress_nonce_cookie() {
    let header: string[] = [];
    let page = await this.wordpress_site_login();

    await page.goto(
      `${data.wordpress_site_data[0]}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`,
      {
        waitUntil: "networkidle",
      }
    );

    const weMailObject = await page.evaluate(() => {
      const scriptElement = document.getElementById("wemail-vendor-js-extra");
      if (scriptElement) {
        const scriptContent = scriptElement.textContent;
        const startPos = scriptContent!.indexOf("{");
        const endPos = scriptContent!.lastIndexOf("}");
        const weMailData = scriptContent!.slice(startPos, endPos + 1);
        return JSON.parse(weMailData);
      } else {
        return null;
      }
    });

    if (weMailObject) {
      header.push(weMailObject.nonce);
    } else {
      console.log("Script element not found or object not present.");
    }

    let cookieData = fs.readFileSync("state.json", "utf8");
    let parsedData = JSON.parse(cookieData);
    let cookie: string = "";

    for (let i: number = 0; i < parsedData.cookies.length; i++) {
      if (parsedData.cookies[i].name.includes("wordpress_logged_in")) {
        cookie = `${parsedData.cookies[i].name}=${parsedData.cookies[i].value}`;
        break;
      }
    }
    header.push(cookie);
    return header;
  }

  



}
