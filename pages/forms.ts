import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class FormPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async form_create(form_data: {}) {
    const form_create = await this.request.post(
      `${config.use?.baseURL}/v1/forms`,
      { data: form_data }
    );

    let form_create_response: { data: { id: string }; message: string };
    let form_id: string = "";

    const base = new BasePage(this.request);
    form_create_response = await base.response_checker(form_create);

    try {
      expect(form_create_response.message).toEqual(
        "Form created successfully."
      );
      form_id = form_create_response.data.id;
    } catch (err) {
      console.log(form_create_response);
      expect(form_create.ok()).toBeFalsy();
    }
    return form_id;
  }

  async form_update(form_id: string, form_data: {}) {
    const form_update = await this.request.put(
      `${config.use?.baseURL}/v1/forms/${form_id}`,
      { data: form_data }
    );

    let form_update_response: { data: { id: string }; message: string };

    const base = new BasePage(this.request);
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

  async form_sync(form_id: string) {
    const form_sync = await this.request.get(
      `${config.use?.baseURL}/v1/overview/forms?refresh=true`
    );

    let form_sync_response: { forms: Array<{ id: string }> };

    const base = new BasePage(this.request);
    form_sync_response = await base.response_checker(form_sync);

    try {
      let flag: boolean = false;
      for (let i: number = 0; i < form_sync_response.forms.length; i++) {
        if (form_id == form_sync_response.forms[i].id) {
          flag = true;
          break;
        }
      }

      if (flag == true) {
        console.log("Form Synched Successfully");
      } else {
        console.log("Created Form Not Found");
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

    const base = new BasePage(this.request);
    form_delete_response = await base.response_checker(form_delete);

    try {
      expect(form_delete_response.deleted).toEqual(true);
    } catch (err) {
      console.log(form_delete_response);
      expect(form_delete.ok()).toBeFalsy();
    }
  }
}
