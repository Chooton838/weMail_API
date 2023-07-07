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
