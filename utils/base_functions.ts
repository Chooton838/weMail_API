import { APIRequestContext, expect, firefox } from "@playwright/test";
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

    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data[0], { waitUntil: "networkidle" });

    await page
      .locator('//*[@id="user_login"]')
      .fill(data.wordpress_site_data[1]);
    await page
      .locator('//*[@id="user_pass"]')
      .fill(data.wordpress_site_data[2]);
    await page.locator('//*[@id="wp-submit"]').click();
    await page.waitForLoadState("networkidle");

    return page;
  }
}
