import { APIResponse, expect, firefox } from "@playwright/test";
import * as fs from "fs";
import * as selector from "../utils/selectors";

export class BasePage {
  async response_checker(request: APIResponse) {
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

  async wordpress_site_login(login_data: {
    login_page_url: string;
    username: string;
    password: string;
  }) {
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

    await page.goto(login_data.login_page_url, {
      waitUntil: "networkidle",
    });

    await page.locator(selector.wp_admin.username).fill(login_data.username);
    await page.locator(selector.wp_admin.password).fill(login_data.password);
    await page.locator(selector.wp_admin.submit).click();
    await page.waitForLoadState("networkidle");

    await page.context().storageState({ path: "state.json" });

    await browser.close();
  }
}
