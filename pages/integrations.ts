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
    data.affiliate_integration_data.rest_url = `${data.rest_url}/`;

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
    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });

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

    await page.click(
      '//a[@class="page-title-action" and contains(text(),"Add New")]'
    );
    await page.waitForLoadState("domcontentloaded");

    await page.fill('//input[@id="title"]', contact_form_7_name);
    await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');
    await page.waitForTimeout(3000);
    expect(
      await page.locator('//input[@id="wpcf7-shortcode"]').isVisible()
    ).toBeTruthy();
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
    await page.goto(
      `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`,
      { waitUntil: "networkidle" }
    );

    await page
      .locator(
        `//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]//input[@type="checkbox"]`
      )
      .click();

    await page
      .locator(
        `//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]`
      )
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
      .locator(
        `//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/../form//input[@type="checkbox"]`
      )
      .click();

    await page
      .locator(
        `(//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//select)[1]`
      )
      .selectOption("first_name");

    await page
      .locator(
        `(//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//select)[2]`
      )
      .selectOption("email");

    await page.locator(`//button[contains(text(),"Save Settings")]`).click();

    expect(
      await page.locator(`//p[@class="iziToast-message slideIn"]`).innerText()
    ).toEqual("Settings saved successfully");

    await browser.close();
  }

  async map_contact_form_7_API(list_id: string, contact_form_7_id: string) {
    let page_url: string = `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`;
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
      `${data.rest_url}/wemail/v1/forms/integrations/contact-form-7`,
      {
        headers: {
          "X-WP-Nonce": header.nonce,
          Cookie: header.cookie,
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
  }

  async contact_form_7_post_id(contact_form_7_name: string) {
    const contact_form_7_post_id = await this.request.get(
      `${config.use?.baseURL}/v1/forms/integrations/contact-form-7/forms`
    );

    let contact_form_7_post_id_response: {
      data: Array<{ id: number; title: string }>;
    };

    const base = new BasePage(this.request);
    contact_form_7_post_id_response = await base.response_checker(
      contact_form_7_post_id
    );
    let id: number = 0;

    if (contact_form_7_post_id_response.data.length > 0) {
      for (
        let i: number = 0;
        i < contact_form_7_post_id_response.data.length;
        i++
      ) {
        if (
          contact_form_7_post_id_response.data[i].title == contact_form_7_name
        ) {
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

    const submit_contact_form_7 = await this.request.post(
      `${data.rest_url}/contact-form-7/v1/contact-forms/${contact_form_7_id}/feedback`,
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
      expect(submit_contact_form_7_response.message).toEqual(
        "Thank you for your message. It has been sent."
      );
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

    await page
      .locator(
        `//a[text()="${contact_form_7_name}"]/../../..//input[@type="checkbox"]`
      )
      .click();

    await page.locator("#bulk-action-selector-top").selectOption("Delete");
    await page.locator("#doaction").click();
    await page.waitForLoadState("networkidle");
    expect(
      await page.locator('//p[text()="Contact form deleted."]').isVisible()
    ).toBeTruthy();
  }

  async woocom_integrations(list_id: string) {
    let page_url: string = `${data.wordpress_site_data.url}/admin.php?page=wemail#/e-commerce/woocommerce/setup`;
    const base = new BasePage(this.request);
    let header = await base.wordpress_nonce_cookie(page_url);

    const woocom_integrations = await this.request.post(
      `${data.rest_url}/wemail/v1/ecommerce/woocommerce/settings`,
      {
        headers: {
          "X-WP-Nonce": header.nonce,
          Cookie: header.cookie,
        },
        data: {
          list_id: list_id,
          enabled: true,
          syncing: true,
          platform: "woocommerce",
          access_token: header.api_key,
        },
      }
    );

    let woocom_integrations_response: { message: string };
    woocom_integrations_response = await base.response_checker(
      woocom_integrations
    );

    try {
      expect(woocom_integrations_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log(woocom_integrations_response);
      expect(woocom_integrations.ok()).toBeFalsy();
    }
  }

  async woocom_product_create(product_name: string) {
    const woocom_product_create = await this.request.post(
      `${data.rest_url}/wc/v3/products`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${data.woocom_rest_api.consumer_key}:${data.woocom_rest_api.consumer_secret}`
          ).toString("base64")}`,
        },
        data: {
          name: product_name,
          type: "simple",
          regular_price: "21.99",
        },
      }
    );

    let woocom_product_create_response: { id: number; name: string } = {
      id: 0,
      name: "",
    };
    let prod_id: number = 0;

    const base = new BasePage(this.request);
    woocom_product_create_response = await base.response_checker(
      woocom_product_create
    );

    try {
      expect(woocom_product_create_response.name).toEqual(product_name);
      prod_id = woocom_product_create_response.id;
    } catch (err) {
      console.log(woocom_product_create_response);
      expect(woocom_product_create.ok()).toBeFalsy();
    }
    return prod_id;
  }

  async woocom_order_create(order_data: {}) {
    const woocom_order_create = await this.request.post(
      `${data.rest_url}/wc/v3/orders`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${data.woocom_rest_api.consumer_key}:${data.woocom_rest_api.consumer_secret}`
          ).toString("base64")}`,
        },
        data: order_data,
      }
    );

    let woocom_order_create_response: {
      id: number;
      billing: { email: string };
    } = {
      id: 0,
      billing: { email: "" },
    };
    let order_id: number = 0;

    const base = new BasePage(this.request);
    woocom_order_create_response = await base.response_checker(
      woocom_order_create
    );

    try {
      expect(woocom_order_create_response.billing.email).toEqual(
        data.woocom_order_data.billing.email
      );
      order_id = woocom_order_create_response.id;
    } catch (err) {
      console.log(woocom_order_create_response);
      expect(woocom_order_create.ok()).toBeFalsy();
    }

    return order_id;
  }

  async woocom_order_complete(order_id: number) {
    const woocom_order_complete = await this.request.post(
      `${data.rest_url}/wc/v3/orders/${order_id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${data.woocom_rest_api.consumer_key}:${data.woocom_rest_api.consumer_secret}`
          ).toString("base64")}`,
        },
        data: {
          status: "completed",
        },
      }
    );

    let woocom_order_complete_response: {
      status: string;
    } = {
      status: "",
    };

    const base = new BasePage(this.request);
    woocom_order_complete_response = await base.response_checker(
      woocom_order_complete
    );

    try {
      expect(woocom_order_complete_response.status).toEqual("completed");
    } catch (err) {
      console.log(woocom_order_complete_response);
      expect(woocom_order_complete.ok()).toBeFalsy();
    }
  }

  async woocom_order_delete(order_id: number) {
    const woocom_order_delete = await this.request.delete(
      `${data.rest_url}/wc/v3/orders/${order_id}?force=true`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${data.woocom_rest_api.consumer_key}:${data.woocom_rest_api.consumer_secret}`
          ).toString("base64")}`,
        },
      }
    );

    let woocom_order_delete_response: {
      billing: { email: string };
    } = {
      billing: { email: "" },
    };

    const base = new BasePage(this.request);
    woocom_order_delete_response = await base.response_checker(
      woocom_order_delete
    );

    try {
      expect(woocom_order_delete_response.billing.email).toEqual(
        data.woocom_order_data.billing.email
      );
    } catch (err) {
      console.log(woocom_order_delete_response);
      expect(woocom_order_delete.ok()).toBeFalsy();
    }
  }

  async woocom_product_delete(product_id: number) {
    const woocom_product_delete = await this.request.delete(
      `${data.rest_url}/wc/v3/products/${product_id}?force=true`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${data.woocom_rest_api.consumer_key}:${data.woocom_rest_api.consumer_secret}`
          ).toString("base64")}`,
        },
      }
    );

    let woocom_product_delete_response: { id: number } = { id: 0 };

    const base = new BasePage(this.request);
    woocom_product_delete_response = await base.response_checker(
      woocom_product_delete
    );

    try {
      expect(woocom_product_delete_response.id).toEqual(product_id);
    } catch (err) {
      console.log(woocom_product_delete_response);
      expect(woocom_product_delete.ok()).toBeFalsy();
    }
  }
}
