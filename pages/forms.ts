import { APIRequestContext, expect, Page } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import * as data from "../utils/data";
import * as selector from "../utils/selectors";
import { WPSitePage } from "../utils/wp_site";

export class FormPage {
  readonly request: APIRequestContext;
  readonly page: Page;

  constructor(request: APIRequestContext, page: Page) {
    this.request = request;
    this.page = page;
  }

  async form_create(form_data: {}) {
    let page_url: string = selector.wemail_forms_selectors.forms_page_url;
    let locator: string = selector.wemail_forms_selectors.forms_nonce_locator;
    let response: {
      form_id: string;
      header: { nonce: string; cookie: string; api_key: string };
    } = {
      form_id: "",
      header: {
        nonce: "",
        cookie: "",
        api_key: "",
      },
    };

    const wpsite = new WPSitePage(this.page);
    response.header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      false,
      ""
    );

    const form_create = await this.request.post(
      `${config.use?.baseURL}/v1/forms`,
      { data: form_data }
    );

    let form_create_response: { data: { id: string }; message: string };

    const base = new BasePage();
    form_create_response = await base.response_checker(form_create);

    try {
      expect(form_create_response.message).toEqual(
        "Form created successfully."
      );
      response.form_id = form_create_response.data.id;
    } catch (err) {
      console.log(form_create_response);
      expect(form_create.ok()).toBeFalsy();
    }
    return response;
  }

  async form_update(form_id: string, form_data: {}) {
    const form_update = await this.request.put(
      `${config.use?.baseURL}/v1/forms/${form_id}`,
      { data: form_data }
    );

    let form_update_response: { data: { id: string }; message: string };

    const base = new BasePage();
    form_update_response = await base.response_checker(form_update);

    try {
      expect(form_update_response.message).toEqual(
        "Form updated successfully."
      );
    } catch (err) {
      console.log(form_update_response);
      expect(form_update.ok()).toBeFalsy();
    }
  }

  async form_sync(forms_id: string[]) {
    const form_sync = await this.request.get(
      `${config.use?.baseURL}/v1/overview/forms?refresh=true`
    );

    let form_sync_response: { forms: Array<{ id: string }> };

    const base = new BasePage();
    form_sync_response = await base.response_checker(form_sync);

    try {
      let flag: boolean = false;
      for (let i: number = 0; i < form_sync_response.forms.length; i++) {
        for (let j: number = 0; j < forms_id.length; j++) {
          if (form_sync_response.forms[i].id == forms_id[j]) {
            flag = true;
            break;
          }
        }
      }

      if (flag == false) {
        console.log("Created Form Not Found");
        expect(form_sync.ok()).toBeFalsy();
      }
    } catch (err) {
      console.log(form_sync_response);
      expect(form_sync.ok()).toBeFalsy();
    }
  }

  async form_delete(form_id: string) {
    const form_delete = await this.request.delete(
      `${config.use?.baseURL}/v1/forms`,
      { data: { ids: [form_id] } }
    );

    let form_delete_response: { deleted: boolean };

    const base = new BasePage();
    form_delete_response = await base.response_checker(form_delete);

    try {
      expect(form_delete_response.deleted).toEqual(true);
    } catch (err) {
      console.log(form_delete_response);
      expect(form_delete.ok()).toBeFalsy();
    }
  }

  async form_sync_with_frontend() {
    let page_url: string = selector.wemail_forms_selectors.forms_page_url;
    let locator: string = selector.wemail_forms_selectors.forms_nonce_locator;

    const wpsite = new WPSitePage(this.page);
    let header = await wpsite.wordpress_nonce_cookie(
      page_url,
      locator,
      false,
      ""
    );

    const form_sync_with_frontend = await this.request.put(
      `${data.rest_url}/wemail/v1/forms/sync`,
      {
        headers: { "X-WP-Nonce": header.nonce, Cookie: header.cookie },
      }
    );

    let form_sync_with_frontend_response: { success: boolean };

    const base = new BasePage();
    form_sync_with_frontend_response = await base.response_checker(
      form_sync_with_frontend
    );

    try {
      expect(form_sync_with_frontend_response.success).toEqual(true);
    } catch (err) {
      console.log(form_sync_with_frontend_response);
      expect(form_sync_with_frontend.ok()).toBeFalsy();
    }
  }

  async form_submit(
    api_endpoint: string,
    form_data: string | {},
    header: { nonce: string; cookie: string; api_key: string },
    response_message: string
  ) {
    let content_type: string = "multipart/form-data";
    if (typeof form_data == "string") {
      content_type = "application/x-www-form-urlencoded; charset=UTF-8";
    }

    const form_submit = await this.request.post(api_endpoint, {
      headers: {
        "X-WP-Nonce": header.nonce,
        Cookie: header.cookie,
        "Content-Type": content_type,
      },
      data: form_data,
    });

    let form_submit_response: { message: string };

    const base = new BasePage();
    form_submit_response = await base.response_checker(form_submit);

    try {
      expect(form_submit_response.message).toEqual(response_message);
    } catch (err) {
      console.log(form_submit_response);
      expect(form_submit.ok()).toBeFalsy();
    }
  }
}
