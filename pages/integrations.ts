import { APIRequestContext, expect, firefox } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class IntegrationsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async integrate_affiliatewp() {
    data.affiliate_integration_data.rest_url = data.rest_url;

    const integrate_affiliatewp = await this.request.post(
      `${config.use?.baseURL}/v1/affiliates/settings/affiliate-wp`,
      {
        data: data.affiliate_integration_data,
      }
    );

    let integrate_affiliatewp_response: { success: boolean };

    const base = new BasePage(this.request);
    integrate_affiliatewp_response = await base.response_checker(
      integrate_affiliatewp
    );

    try {
      expect(integrate_affiliatewp_response.success).toEqual(true);
    } catch (err) {
      console.log(integrate_affiliatewp_response);
      expect(integrate_affiliatewp.ok()).toBeFalsy();
    }
  }

  async create_affiliate(affiliate_username: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();
    await page.goto(data.wordpress_site_data[0], { waitUntil: "networkidle" });

    await page
      .locator('//div[@class="wp-menu-name" and contains(text(),"Affiliates")]')
      .click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");

    await page.locator('//a[contains(text(),"Affiliates")]').click();
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(5000);
  }

  async create_contact_forms_7(contact_form_7_name: string) {
    let contact_form_7_id: string = "";
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    // await page.goto(`${data.wordpress_site_data[0]}/admin.php?page=wpcf7`, {
    //   waitUntil: "networkidle",
    // });

    await page.goto(`${data.wordpress_site_data[0]}/admin.php?page=wpcf7`);

    await page.click(
      '//a[@class="page-title-action" and contains(text(),"Add New")]'
    );
    await page.waitForLoadState("domcontentloaded");

    await page.fill('//input[@id="title"]', contact_form_7_name);
    await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');
    expect(page.isVisible('//input[@id="wpcf7-shortcode"]')).toBeTruthy();

    let shortcode = await page
      .locator("#wpcf7-shortcode")
      .getAttribute("value");

    if (shortcode !== null) {
      const idMatch = shortcode.match(/id="([^"]+)"/);
      const id = idMatch ? idMatch[1] : null;
      contact_form_7_id = id as string;
    } else {
      console.log("Code attribute is null");
    }

    await browser.close();
    return contact_form_7_id;
  }

  async map_contact_form_7(list_id: string, contact_form_7_id: string) {
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
      expect(contact_form_7_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log(contact_form_7_response);
      expect(contact_form_7.ok()).toBeFalsy();
    }

    return header;
  }

  async submit_contact_form_7(
    contact_form_7_id: string,
    subscriber_email: string,
    subscriber_name: string
  ) {
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

    console.log(
      `${data.rest_url}contact-form-7/v1/contact-forms/${contact_form_7_id}/feedback`
    );

    const submit_contact_form_7 = await this.request.post(
      `${data.rest_url}contact-form-7/v1/contact-forms/${contact_form_7_id}/feedback`,
      {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary66t6AAYgRH37yFnA",
        },
        data: payload,
      }
    );

    let submit_contact_form_7_response: { message: string };

    const base = new BasePage(this.request);
    submit_contact_form_7_response = await base.response_checker(
      submit_contact_form_7
    );

    try {
      expect(submit_contact_form_7_response.message).toEqual("");
    } catch (err) {
      console.log(submit_contact_form_7_response);
      expect(submit_contact_form_7.ok()).toBeFalsy();
    }
  }
}
