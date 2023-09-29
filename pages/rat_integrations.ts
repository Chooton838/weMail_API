import { APIRequestContext, expect, firefox } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class RatIntegrationsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   *
   * Integrations
   * Contact_forms
   * @param contact_form_7
   *
   */
  async create_contact_forms_7(contact_form_7_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    // await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`, {
    //   waitUntil: "networkidle",
    // });

    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`);

    await page.click('//a[@class="page-title-action" and contains(text(),"Add New")]');
    await page.waitForLoadState("domcontentloaded");

    await page.fill('//input[@id="title"]', contact_form_7_name);
    await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');
    await page.waitForTimeout(3000);
    expect(await page.locator('//input[@id="wpcf7-shortcode"]').isVisible()).toBeTruthy();
    await browser.close();
  }

  async map_contact_form_7(list_name: string, contact_form_7_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`, {
      waitUntil: "networkidle",
    });

    await page.locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]//input[@type="checkbox"]`).click();

    await page
      .locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]`)
      .click();

    await page
      .locator(
        `//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`
      )
      .fill(list_name);

    await page
      .locator(
        `//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`
      )
      .press("Enter");

    await page
      .locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/../form//input[@type="checkbox"]`)
      .click();

    await page
      .locator(`(//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//select)[1]`)
      .selectOption("first_name");

    await page
      .locator(`(//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//select)[2]`)
      .selectOption("email");

    await page.locator(`//button[contains(text(),"Save Settings")]`).click();

    expect(await page.locator(`//p[@class="iziToast-message slideIn"]`).innerText()).toEqual("Settings saved successfully");

    await browser.close();
  }

  async map_contact_form_7_API(list_id: string, contact_form_7_id: string) {
    let page_url: string = `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`;
    let locator: string = `#wemail-vendor-js-extra`;
    const base = new BasePage(this.request);
    let header = await base.wordpress_nonce_cookie(page_url, locator, false, "");

    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
    form_data.append("settings[0][id]", contact_form_7_id);
    form_data.append("settings[0][list_id]", list_id);
    form_data.append("settings[0][overwrite]", "true");
    form_data.append("settings[0][map][your-name]", "first_name");
    form_data.append("settings[0][map][your-email]", "email");

    const contact_form_7 = await this.request.post(`${data.rest_url}/wemail/v1/forms/integrations/contact-form-7`, {
      headers: {
        "X-WP-Nonce": header.nonce,
        Cookie: header.cookie,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: form_data.toString(),
    });

    let contact_form_7_response: { message: string };
    contact_form_7_response = await base.response_checker(contact_form_7);

    try {
      expect(contact_form_7_response.message).toEqual("Settings saved successfully.");
    } catch (err) {
      console.log(contact_form_7_response);
      expect(contact_form_7.ok()).toBeFalsy();
    }
  }

  async contact_form_7_post_id(contact_form_7_name: string) {
    const contact_form_7_post_id = await this.request.get(`${config.use?.baseURL}/v1/forms/integrations/contact-form-7/forms`);

    let contact_form_7_post_id_response: {
      data: Array<{ id: number; title: string }>;
    };

    const base = new BasePage(this.request);
    contact_form_7_post_id_response = await base.response_checker(contact_form_7_post_id);
    let id: number = 0;

    if (contact_form_7_post_id_response.data.length > 0) {
      for (let i: number = 0; i < contact_form_7_post_id_response.data.length; i++) {
        if (contact_form_7_post_id_response.data[i].title == contact_form_7_name) {
          id = contact_form_7_post_id_response.data[i].id;
          break;
        }
      }
    }
    if (id == 0) {
      console.log("Created Contact form 7 Not Found");
      expect(contact_form_7_post_id.ok()).toBeFalsy();
    }
    return id;
  }

  async submit_contact_form_7(contact_form_7_id: string, subscriber_email: string, subscriber_name: string) {
    let payload: string = `------WebKitFormBoundary66t6AAYgRH37yFnA
Content-Disposition: form-data; name="your-name"

${subscriber_name}
------WebKitFormBoundary66t6AAYgRH37yFnA
Content-Disposition: form-data; name="your-email"

${subscriber_email}
------WebKitFormBoundary66t6AAYgRH37yFnA
Content-Disposition: form-data; name="your-subject"

subject
------WebKitFormBoundary66t6AAYgRH37yFnA
Content-Disposition: form-data; name="your-message"

message
------WebKitFormBoundary66t6AAYgRH37yFnA--`;

    const submit_contact_form_7 = await this.request.post(
      `${data.rest_url}/contact-form-7/v1/contact-forms/${contact_form_7_id}/feedback`,
      {
        headers: {
          "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary66t6AAYgRH37yFnA",
        },
        data: payload,
      }
    );

    let submit_contact_form_7_response: { message: string };

    const base = new BasePage(this.request);
    submit_contact_form_7_response = await base.response_checker(submit_contact_form_7);

    try {
      expect(submit_contact_form_7_response.message).toEqual("Thank you for your message. It has been sent.");
    } catch (err) {
      console.log(submit_contact_form_7_response);
      expect(submit_contact_form_7.ok()).toBeFalsy();
    }
  }

  async delete_contact_form_7(contact_form_7_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`, {
      waitUntil: "networkidle",
    });

    await page.locator(`//a[text()="${contact_form_7_name}"]/../../..//input[@type="checkbox"]`).click();

    await page.locator("#bulk-action-selector-top").selectOption("Delete");
    await page.locator("#doaction").click();
    await page.waitForLoadState("networkidle");
    expect(await page.locator('//p[text()="Contact form deleted."]').isVisible()).toBeTruthy();
  }

  /**
   *
   * Integrations
   * Contact_forms
   * @param wp_forms
   *
   */

  async create_wp_forms(contact_form_7_name: string) {
    const browser = await firefox.launch();
    
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    //Go to plugin_page
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`);

    await page.click('//a[@class="page-title-action" and contains(text(),"Add New")]');
    await page.waitForLoadState("domcontentloaded");

    await page.fill('//input[@id="title"]', contact_form_7_name);
    await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');
    await page.waitForTimeout(3000);
    expect(await page.locator('//input[@id="wpcf7-shortcode"]').isVisible()).toBeTruthy();
    await browser.close();
  }
}
