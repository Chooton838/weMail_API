import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class IntegrationsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async integrate_affiliatewp() {
    data.affiliate_integration_data.rest_url =
      data.wordpress_site_data[0].substring(
        0,
        data.wordpress_site_data[0].lastIndexOf("/wp-admin")
      ) + "/wp-json/";

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
    const base = new BasePage(this.request);
    let page = await base.wordpress_site_login();

    await page
      .locator('//div[@class="wp-menu-name" and contains(text(),"Affiliates")]')
      .click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");

    await page.locator('//a[contains(text(),"Affiliates")]').click();
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(5000);
  }

  async create_contact_form_7() {
    let contact_form_id: string = "";
    const base = new BasePage(this.request);
    let page = await base.wordpress_site_login();

    await page.goto("");

    return contact_form_id;
  }

  async contact_form_7(contact_form_id: string, list_id: string) {
    const base = new BasePage(this.request);
    let header = await base.wordpress_nonce_cookie();

    data.integrations.contact_form_7.settings[0].list_id = contact_form_id;
    data.integrations.contact_form_7.settings[0].list_id = list_id;

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
      expect(contact_form_7_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log(contact_form_7_response);
      expect(contact_form_7.ok()).toBeFalsy();
    }
  }
}
