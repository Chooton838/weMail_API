import { APIRequestContext, expect, Page } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import * as data from "../utils/data";
import * as selector from "../utils/selectors";
import { WPSitePage } from "../utils/wp_site";

export class IntegrationsPage {
  readonly request: APIRequestContext;
  readonly page: Page;

  constructor(request: APIRequestContext, page: Page) {
    this.request = request;
    this.page = page;
  }

  async integrate_affiliatewp(affiliate_integration_data: {}) {
    const integrate_affiliatewp = await this.request.post(
      `${config.use?.baseURL}/v1/affiliates/settings/affiliate-wp`,
      {
        data: affiliate_integration_data,
      }
    );

    let integrate_affiliatewp_response: { success: boolean };

    const base = new BasePage();
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
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(selector.integration_create_affiliate.page_url, {
      waitUntil: "networkidle",
    });

    await this.page
      .locator(selector.integration_create_affiliate.username)
      .fill(affiliate_username);
    await this.page.waitForTimeout(2000);

    await this.page
      .locator(
        selector.integration_create_affiliate.select_affiliate(
          affiliate_username
        )
      )
      .click();

    await this.page
      .locator(selector.integration_create_affiliate.affiliate_status)
      .selectOption("Pending");
    await this.page
      .locator(selector.integration_create_affiliate.affiliate_rate_type)
      .click();
    await this.page
      .locator(selector.integration_create_affiliate.affiliate_rate)
      .fill("5");
    await this.page
      .locator(selector.integration_create_affiliate.affiliate_submit)
      .click();

    await this.page.waitForLoadState("networkidle");
  }

  async approve_affiliate(affiliate_username: string) {
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(
      selector.integration_affiliate_actions.affiliates_list_page_url,
      { waitUntil: "networkidle" }
    );

    await this.page
      .locator(
        selector.integration_affiliate_actions.select_affiliate(
          affiliate_username
        )
      )
      .click();

    await this.page
      .locator(selector.integration_affiliate_actions.select_bulk_action)
      .selectOption("Accept");
    await this.page
      .locator(selector.integration_affiliate_actions.do_action)
      .click();

    await this.page.waitForLoadState("networkidle");
  }

  async delete_affiliate(affiliate_username: string) {
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(
      selector.integration_affiliate_actions.affiliates_list_page_url,
      { waitUntil: "networkidle" }
    );

    await this.page
      .locator(
        selector.integration_affiliate_actions.select_affiliate(
          affiliate_username
        )
      )
      .click();

    await this.page
      .locator(selector.integration_affiliate_actions.select_bulk_action)
      .selectOption("Delete");
    await this.page
      .locator(selector.integration_affiliate_actions.do_action)
      .click();
    await this.page.waitForLoadState("networkidle");

    await this.page
      .locator(selector.integration_create_affiliate.affiliate_submit)
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async create_contact_forms_7(contact_form_7_name: string) {
    await this.page.goto(selector.integration_create_cf7.page_url);

    await this.page.locator(selector.integration_create_cf7.add_new).click();
    await this.page.waitForLoadState("domcontentloaded");

    await this.page
      .locator(selector.integration_create_cf7.title)
      .fill(contact_form_7_name);
    await this.page.locator(selector.integration_create_cf7.save).click();
    await this.page.waitForTimeout(3000);
    expect(
      await this.page
        .locator(selector.integration_create_cf7.shortcode)
        .isVisible()
    ).toBeTruthy();
  }

  async map_contact_form_7(list_name: string, contact_form_7_name: string) {
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(selector.integration_map_cf7.page_url, {
      waitUntil: "networkidle",
    });

    await this.page
      .locator(selector.integration_map_cf7.check_cf7(contact_form_7_name))
      .click();

    await this.page
      .locator(selector.integration_map_cf7.select_cf7(contact_form_7_name))
      .click();

    await this.page
      .locator(selector.integration_map_cf7.select_list(contact_form_7_name))
      .fill(list_name);

    await this.page
      .locator(selector.integration_map_cf7.select_list(contact_form_7_name))
      .press("Enter");

    await this.page
      .locator(selector.integration_map_cf7.override(contact_form_7_name))
      .click();

    await this.page
      .locator(selector.integration_map_cf7.select_name(contact_form_7_name))
      .selectOption("first_name");

    await this.page
      .locator(selector.integration_map_cf7.select_email(contact_form_7_name))
      .selectOption("email");

    await this.page.locator(selector.integration_map_cf7.save_settings).click();

    expect(
      await this.page
        .locator(selector.integration_map_cf7.success_toast)
        .innerText()
    ).toEqual("Settings saved successfully");
  }

  async map_contact_form_7_API(list_id: string, contact_form_7_id: string) {
    let page_url: string = selector.integration_map_cf7.page_url;
    let locator: string = selector.wemail_forms_selectors.forms_nonce_locator;

    const wpsite = new WPSitePage(this.page);
    let header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      false,
      ""
    );

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

    const base = new BasePage();
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

    const base = new BasePage();
    contact_form_7_post_id_response = await base.response_checker(
      contact_form_7_post_id
    );
    let id: number = 0;

    try {
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
    } catch (err) {
      console.log(contact_form_7_post_id_response);
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

    const base = new BasePage();
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
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(selector.integration_create_cf7.page_url, {
      waitUntil: "networkidle",
    });

    await this.page
      .locator(selector.integration_delete_cf7.select_cf7(contact_form_7_name))
      .click();

    await this.page
      .locator(selector.integration_affiliate_actions.select_bulk_action)
      .selectOption("Delete");
    await this.page
      .locator(selector.integration_affiliate_actions.do_action)
      .click();
    await this.page.waitForLoadState("networkidle");
    expect(
      await this.page
        .locator(selector.integration_delete_cf7.delete_toast)
        .isVisible()
    ).toBeTruthy();
  }

  async woocom_integrations(list_id: string) {
    let page_url: string = selector.integration_woocom.page_url;
    let locator: string = selector.wemail_forms_selectors.forms_nonce_locator;

    const wpsite = new WPSitePage(this.page);
    let header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      false,
      ""
    );

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

    const base = new BasePage();
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

    const base = new BasePage();
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

    const base = new BasePage();
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

    const base = new BasePage();
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

    const base = new BasePage();
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

    const base = new BasePage();
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

  async wperp_integrations(list_id: string) {
    let page_url: string = selector.integration_wperp.page_url;
    let locator: string = selector.integration_wperp.nonce_locator;
    const wpsite = new WPSitePage(this.page);
    let header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      false,
      ""
    );

    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
    form_data.append("name", "sync_subscriber_erp_contacts");
    form_data.append("settings[sync]", "true");
    form_data.append("settings[import_crm_groups]", "true");
    form_data.append("settings[default_list]", list_id);

    const wperp_integrations = await this.request.post(
      `${data.rest_url}/wemail/v1/site/settings`,
      {
        headers: {
          "X-WP-Nonce": header.nonce,
          Cookie: header.cookie,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: form_data.toString(),
      }
    );

    let wperp_integrations_response: { message: string };

    const base = new BasePage();
    wperp_integrations_response = await base.response_checker(
      wperp_integrations
    );

    try {
      expect(wperp_integrations_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log(wperp_integrations_response);
      expect(wperp_integrations.ok()).toBeFalsy();
    }
  }

  async wperp_crm_contact_create(contcat_user_email: string) {
    let page_url: string =
      selector.integration_wperp.crm_contact_create_page_url;
    let locator: string =
      selector.integration_wperp.contact_create_nonce_locator;
    let popup_locator: string =
      selector.integration_wperp.contact_create_popup_nonce_locator;

    const wpsite = new WPSitePage(this.page);
    let header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      true,
      popup_locator
    );

    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
    form_data.append("contact[meta][photo_id]", "0");
    form_data.append("contact[main][first_name]", "Jhon");
    form_data.append("contact[main][last_name]", "Doe");
    form_data.append("contact[main][email]", contcat_user_email);
    form_data.append("contact[main][phone]", "");
    form_data.append("contact[meta][life_stage]", "customer");
    form_data.append("contact[meta][contact_owner]", "1");
    form_data.append("contact[meta][date_of_birth]", "");
    form_data.append("contact[meta][contact_age]", "");
    form_data.append("contact[main][mobile]", "");
    form_data.append("contact[main][website]", "");
    form_data.append("contact[main][fax]", "");
    form_data.append("contact[main][street_1]", "");
    form_data.append("contact[main][street_2]", "");
    form_data.append("contact[main][city]", "");
    form_data.append("contact[main][country]", "-1");
    form_data.append("contact[main][state]", "");
    form_data.append("contact[main][postal_code]", "");
    form_data.append("contact[meta][source]", "advert");
    form_data.append("contact[main][other]", "");
    form_data.append("contact[main][notes]", "");
    form_data.append("contact[social][facebook]", "");
    form_data.append("contact[social][twitter]", "");
    form_data.append("contact[social][googleplus]", "");
    form_data.append("contact[social][linkedin]", "");
    form_data.append("contact[main][id]", "0");
    form_data.append("contact[main][user_id]", "");
    form_data.append("contact[main][type]", "contact");
    form_data.append("action", "erp-crm-customer-new");
    form_data.append("_wpnonce", header.nonce);
    form_data.append(
      "_wp_http_referer",
      "/wp-admin/admin.php?page=erp-crm&section=contact"
    );

    const wperp_crm_contact_create = await this.request.post(
      `${data.wordpress_site_data.url}/admin-ajax.php`,
      {
        headers: {
          Cookie: header.cookie,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form_data.toString(),
      }
    );

    let wperp_crm_contact_create_response: {
      data: { data: { id: string; email: string } };
    };

    let crm_contact_id: string = "";

    const base = new BasePage();
    wperp_crm_contact_create_response = await base.response_checker(
      wperp_crm_contact_create
    );

    try {
      expect(wperp_crm_contact_create_response.data.data.email).toEqual(
        contcat_user_email
      );
      crm_contact_id = wperp_crm_contact_create_response.data.data.id;
    } catch (err) {
      console.log(wperp_crm_contact_create_response);
      expect(wperp_crm_contact_create.ok()).toBeFalsy();
    }

    return crm_contact_id;
  }

  async wperp_crm_contact_delete(wperp_crm_customer_id: string) {
    let page_url: string =
      selector.integration_wperp.crm_contact_create_page_url;
    let locator: string =
      selector.integration_wperp.contact_delete_nonce_locator;

    const wpsite = new WPSitePage(this.page);
    let header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      false,
      ""
    );

    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
    form_data.append("_wpnonce", header.nonce);
    form_data.append("id", wperp_crm_customer_id);
    form_data.append("hard", "0");
    form_data.append("type", "contact");
    form_data.append("action", "erp-crm-customer-delete");

    const wperp_crm_contact_delete = await this.request.post(
      `${data.wordpress_site_data.url}/admin-ajax.php`,
      {
        headers: {
          Cookie: header.cookie,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form_data.toString(),
      }
    );

    let wperp_crm_contact_delete_response: {
      success: boolean;
    };

    const base = new BasePage();
    wperp_crm_contact_delete_response = await base.response_checker(
      wperp_crm_contact_delete
    );

    try {
      expect(wperp_crm_contact_delete_response.success).toEqual(true);
    } catch (err) {
      console.log(wperp_crm_contact_delete_response);
      expect(wperp_crm_contact_delete.ok()).toBeFalsy();
    }
  }

  async create_wp_user(username: string, user_email: string) {
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(selector.wp_user.page_url, {
      waitUntil: "networkidle",
    });

    await this.page.locator(selector.wp_user.username).click();
    await this.page.locator(selector.wp_user.username).fill(username);
    await this.page
      .locator(selector.wp_user.email)
      .fill(user_email.toLowerCase());
    await this.page.locator(selector.wp_user.password).fill("12344321");
    await this.page.locator(selector.wp_user.weak_password).click();
    await this.page.locator(selector.wp_user.user_notification).click();
    await this.page.locator(selector.wp_user.add_user).click();

    await this.page.waitForLoadState("networkidle");
  }

  async delete_wp_user(username: string) {
    await this.page.goto(data.wordpress_site_data.url, {
      waitUntil: "networkidle",
    });
    await this.page.goto(selector.wp_user.users_list_page_url, {
      waitUntil: "networkidle",
    });

    await this.page.locator(selector.wp_user.select_user(username)).click();

    await this.page
      .locator(selector.integration_affiliate_actions.select_bulk_action)
      .selectOption("Delete");
    await this.page
      .locator(selector.integration_affiliate_actions.do_action)
      .click();

    await this.page.waitForLoadState("networkidle");

    await this.page
      .locator(selector.integration_create_affiliate.affiliate_submit)
      .click();
    await this.page.waitForLoadState("networkidle");
  }
}
