import { APIRequestContext, expect, firefox } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class Rat_IntegrationsSetupPage {
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
    await page.goto(`${data.wordpress_site_data[0]}/admin.php?page=wpcf7/`, {
      waitUntil: "networkidle",
    });

    //Add new
    await page.click('//a[@class="page-title-action" and contains(text(),"Add New")]');
    await page.waitForLoadState("networkidle");
    //Enter name
    await page.fill('//input[@id="title"]', `[Rat-QA] ${contact_form_7_name}`);

    //Save
    await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');

    expect(page.isVisible('//input[@id="wpcf7-shortcode"]')).toBeTruthy();

    //Store Shortcode
    let shortcode = await page.locator("#wpcf7-shortcode").getAttribute("value");
    console.log(`Shortcode is: ${shortcode}`);

    if (shortcode !== null) {
      const idMatch = shortcode.match(/id="([^"]+)"/);
      const id = idMatch ? idMatch[1] : null;
      contact_form_7_id = id as string;
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
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator(".wp-heading-inline")).toHaveText("Add New Page");

    await page.locator("#title").fill(`[Rat-QA] ${form_name}`.toUpperCase());

    await page.locator('//button[text()="Text"]').click();
    await page.locator('//textarea[@id="content"]').click();
    await page.locator('//textarea[@id="content"]').fill(`[${form_name} id="${form_id}"]`);
    await page.waitForLoadState("domcontentloaded");

    await page.locator('//input[@id="publish"]').click();

    await page.waitForLoadState("domcontentloaded");

    if (await page.locator('//*[@id="message"]/p/a').isVisible()) {
      page_url = await page.locator('//*[@id="message"]/p/a').getAttribute("href");
    } else {
      page_url = "";
    }
    return page_url;
  }

  //Integration
  //Setup-contact-form-7
  //api
  async map_contact_form_7_api(list_id: string, contact_form_7_id: string) {
    let page_url: string = `${data.wordpress_site_data[0]}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`;
    const base = new BasePage(this.request);
    let header = await base.wordpress_nonce_cookie(page_url);

    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
    form_data.append("settings[0][id]", contact_form_7_id);
    form_data.append("settings[0][list_id]", list_id);
    form_data.append("settings[0][overwrite]", "true");
    form_data.append("settings[0][map][your-name]", "first_name");
    form_data.append("settings[0][map][your-email]", "email");

    const contact_form_7 = await this.request.post(
      `${data.rest_url}wemail/v1/forms/integrations/contact-form-7`,
      {
        headers: {
          "X-WP-Nonce": header[0],
          Cookie: header[1],
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form_data.toString(),
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

    return header;
  }

  //e2e
  async map_contact_form_7_e2e() {}

  //Remove Contact-form-7-forms
  async remove_all_contact_form_7_forms() {
    let contact_form_7_id: string = "";
    const base = new BasePage(this.request);
    //WP-site-login
    let page = await base.wordpress_site_login();

    //Create-contact-form-7
    await page.goto(`${data.wordpress_site_data[0]}/admin.php?page=wpcf7/`);

    const no_items_found: boolean = await page.isVisible('//td[text()="No items found."]');

    if (no_items_found === true) {
      console.log(`Contact-form-7: List is empty`);
    } else {
      await page.click('//input[@id="cb-select-all-1"]');
      await page.selectOption('//select[@id="bulk-action-selector-top"]', "Delete");
      await page.click('//input[@id="doaction"]');

      const successMessageElement: boolean = await page.isVisible('//p[text()="Contact form deleted."]');

      if (successMessageElement === true) {
        console.log(`Contact-form-7: All Forms List deleted`);
      } else {
        console.log(`An error occurred while deleting forms.`);
      }
    }
  }
}
