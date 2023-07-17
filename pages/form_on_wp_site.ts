import { Page, expect } from "@playwright/test";
import { data } from "../utils/data";

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async form_sync_with_frontend() {
    await this.page.goto(data.wordpress_site_data[0]);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(5000);
    await this.page
      .locator('//*[@id="user_login"]')
      .fill(data.wordpress_site_data[1]);
    // await this.page
    //   .locator('//*[@id="user_pass"]')
    //   .fill(data.wordpress_site_data[2]);
    // await this.page.locator('//*[@id="wp-submit"]').click();
    // await this.page.waitForLoadState("networkidle");

    // await this.page
    //   .locator('//div[@class="wp-menu-name" and contains(text(),"weMail")]')
    //   .click();
    // await this.page.waitForLoadState("domcontentloaded");
    // await this.page.waitForLoadState("networkidle");

    // await this.page.locator('//a[contains(text(),"Forms")]').click();
    // await this.page.waitForLoadState("networkidle");

    // await this.page
    //   .locator('//button[@title="Sync forms with your website."]')
    //   .click();
    // await this.page.waitForLoadState("networkidle");

    // await this.page.waitForSelector('//p[@class="iziToast-message slideIn"]');
  }

  async form_publish(form_id: string) {
    let page_url;
    await this.page.goto(data.wordpress_site_data[0]);
    await this.page.waitForLoadState("networkidle");
    await this.page
      .locator('//*[@id="user_login"]')
      .fill(data.wordpress_site_data[1]);
    await this.page
      .locator('//*[@id="user_pass"]')
      .fill(data.wordpress_site_data[2]);
    await this.page.locator('//*[@id="wp-submit"]').click();
    await this.page.waitForLoadState("networkidle");

    await this.page.goto(
      `${data.wordpress_site_data[0]}/post-new.php?post_type=page`
    );
    await this.page.waitForLoadState("networkidle");

    await expect(this.page.locator(".wp-heading-inline")).toHaveText(
      "Add New Page"
    );

    await this.page.locator("#title").fill(`Automated Forms`);

    await this.page.locator('//button[text()="Text"]').click();
    await this.page.locator('//textarea[@id="content"]').click();
    await this.page
      .locator('//textarea[@id="content"]')
      .fill(`[wemail_form id="${form_id}"]`);
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState("networkidle");

    await this.page.locator('//input[@id="publish"]').click();

    await this.page.waitForLoadState("networkidle");

    if (await this.page.locator('//*[@id="message"]/p/a').isVisible()) {
      page_url = await this.page
        .locator('//*[@id="message"]/p/a')
        .getAttribute("href");
    } else {
      page_url = "";
    }

    return page_url;
  }

  async form_submit(form_page_url: string, subscriber_email: string) {
    await this.page.goto(form_page_url);
    await this.page.waitForLoadState("networkidle");
    // await this.page.waitForLoadState("domcontentloaded");

    await this.page.locator("#wemail-form-field-3").fill("dummy user");
    await this.page.locator("#wemail-form-field-4").fill(subscriber_email);
    await this.page.waitForTimeout(5000);
    await this.page
      .locator(
        '//button[@class="submit-button" and contains(text(), "Join Today")]'
      )
      .click();
    // await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(5000);
    await expect(this.page.locator('//div[@class="swal-title"]')).toContainText(
      "Success!"
    );
    await this.page
      .locator('//button[@class="swal-button swal-button--confirm"]')
      .click();
  }
}
