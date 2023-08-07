import { APIRequestContext, expect, firefox } from "@playwright/test";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class AdminPage {
  /**
   * "userAgent" - Added on browser.newContext to open the  using this userAgent (needed for e2e)
   */

  async form_sync_with_frontend(request: APIRequestContext) {
    const base = new BasePage(request);
    let page = await base.wordpress_site_login();

    await page
      .locator('//div[@class="wp-menu-name" and contains(text(),"weMail")]')
      .click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");

    await page.locator('//a[contains(text(),"Forms")]').click();
    await page.waitForLoadState("networkidle");

    await page
      .locator('//button[@title="Sync forms with your website."]')
      .click();
    await page.waitForLoadState("networkidle");

    await page.waitForSelector('//p[@class="iziToast-message slideIn"]');
    await page.close();
  }

  async form_publish(request: APIRequestContext, form_id: string) {
    const base = new BasePage(request);
    let page = await base.wordpress_site_login();

    await page.goto(
      `${data.wordpress_site_data[0]}/post-new.php?post_type=page`
    );
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".wp-heading-inline")).toHaveText("Add New Page");

    await page.locator("#title").fill(`Automated Forms`);
    await page.locator('//button[text()="Text"]').click();
    await page.locator('//textarea[@id="content"]').click();
    await page
      .locator('//textarea[@id="content"]')
      .fill(`[wemail_form id="${form_id}"]`);

    await page.locator('//input[@id="publish"]').click();
    await page.waitForLoadState("networkidle");

    let page_url;
    if (await page.locator('//*[@id="message"]/p/a').isVisible()) {
      page_url = await page
        .locator('//*[@id="message"]/p/a')
        .getAttribute("href");
    } else {
      page_url = "";
    }
    await page.close();
    return page_url;
  }

  async form_submit(form_page_url: string, subscriber_email: string) {
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

    await page.goto(form_page_url);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");

    await page.locator("#wemail-form-field-3").fill("dummy user");
    await page.locator("#wemail-form-field-4").fill(subscriber_email);
    // await page.waitForTimeout(5000);
    await page
      .locator(
        '//button[@class="submit-button" and contains(text(), "Join Today")]'
      )
      .click();
    // await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5000);
    await expect(page.locator('//div[@class="swal-title"]')).toContainText(
      "Success!"
    );
    await page
      .locator('//button[@class="swal-button swal-button--confirm"]')
      .click();
    await browser.close();
  }
}
