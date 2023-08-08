import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class Rat_IntegrationsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Create-contact-form-7
  async create_contact_forms_7(contact_form_7_name) {
    let contact_form_7_id: string = "";
    const base = new BasePage(this.request);
    //WP-site-login
    let page = await base.wordpress_site_login();

    //Create-contact-form-7
    await page.goto(`${data.wordpress_site_data[0]}/admin.php?page=wpcf7/`);

    await page.click('//a[@class="page-title-action" and contains(text(),"Add New")]');
    await page.fill('//input[@id="title"]', `[Rat-QA] ${contact_form_7_name}`);

    await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');

    expect(page.isVisible('//input[@id="wpcf7-shortcode"]')).toBeTruthy();

    let shortcode = await page.locator("#wpcf7-shortcode").getAttribute("value");
    console.log(`Shortcode is: ${shortcode}`);

    if (shortcode !== null) {
      const idMatch = shortcode.match(/id="(\d+)"/);
      const id = idMatch ? idMatch[1] : null;

      contact_form_7_id = id as string;
      console.log(`ID is: ${id}`);
    } else {
      console.log("Code attribute is null");
    }

    console.log(`Return ID: ${contact_form_7_id}`);

    return contact_form_7_id;
  }

  //
  async publish_form(form_name: string, form_id: string) {
    let page_url;
    const base = new BasePage(this.request);
    //WP-site-login
    let page = await base.wordpress_site_login();

    //Create-new-page
    await page.goto(`${data.wordpress_site_data[0]}/post-new.php?post_type=page`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".wp-heading-inline")).toHaveText("Add New Page");

    await page.locator("#title").fill(`${form_name}`.toUpperCase());

    await page.locator('//button[text()="Text"]').click();
    await page.locator('//textarea[@id="content"]').click();
    await page.locator('//textarea[@id="content"]').fill(`[${form_name} id="${form_id}"]`);
    await page.waitForTimeout(3000);
    await page.waitForLoadState("networkidle");

    await page.locator('//input[@id="publish"]').click();

    await page.waitForLoadState("networkidle");

    if (await page.locator('//*[@id="message"]/p/a').isVisible()) {
      page_url = await page.locator('//*[@id="message"]/p/a').getAttribute("href");
    } else {
      page_url = "";
    }
    return page_url;
  }

  //Integration
  //Setup-contact-form-7
  async setup_contact_form_7(form_id: string, list_id: string) {
    const base = new BasePage(this.request);
    let header = await base.wordpress_nonce_cookie();

    const contact_form_7 = await this.request.post(
      `${data.rest_url}/wemail/v1/forms/integrations/contact-form-7`,
      {
        headers: { "X-WP-Nonce": header[0], Cookie: header[1] },
        data: data.integrations.contact_form_7,
      }
    );

    let contact_form_7_response: { message: string };
    contact_form_7_response = await base.response_checker(contact_form_7);

    try {
      expect(contact_form_7_response.message).toEqual("Settings saved successfully.");
    } catch (err) {
      console.log(contact_form_7_response);
      expect(contact_form_7.ok()).toBeFalsy();
    }
  }
}
