import { APIRequestContext, chromium, expect } from "@playwright/test";
import { data } from "./data";
import * as fs from "fs"; //Clear Cookie

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

  //Wordpress Login
  async wordpress_site_login() {
    /**
     * "userAgent" - Added on browser.newContext to send the request using custom userAgent
     */

    const browser = await chromium.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Clear Cookie
    fs.writeFile("state.json", '{"cookies":[],"origins": []}', function () {});

    await page.goto(data.wordpress_site_data[0], { waitUntil: "networkidle" });

    await page.locator('//*[@id="user_login"]').fill(data.wordpress_site_data[1]);
    await page.locator('//*[@id="user_pass"]').fill(data.wordpress_site_data[2]);
    await page.locator('//*[@id="wp-submit"]').click();
    await page.waitForLoadState("networkidle");

    //return page;

    //Save Cookie
    await page.context().storageState({ path: "state.json" });
  }

  async visitContactForm7() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(
      `${data.wordpress_site_data[0]}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`,
      {
        waitUntil: "networkidle",
      }
    );

    const selector = "#wemail-vendor-js-extra"; // CSS selector to target the script element by ID

    const nonceValue = await page.evaluate(selector, (element) => {
      // Ensure the element has text content before proceeding
      return element.textContent ? JSON.parse(element.textContent.trim()).nonce : null;
    });

    console.log("Nonce Value:", nonceValue);
  }

}
