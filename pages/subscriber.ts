import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
export class SubscriberPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async subscriber_create(subscriber_email: string, list_id: string) {
    const subscriber_create = await this.request.post(
      `${config.use?.baseURL}/v1/subscribers`,
      {
        data: {
          email: subscriber_email,
          first_name: "",
          last_name: "",

          phone: "",
          lists: [list_id],
          event: 0,
        },
      }
    );

    let subscriber_create_response: { data: { email: string; id: string } } = {
      data: { email: "", id: "" },
    };
    let subscriber_id: string = "";

    const base = new BasePage(this.request);
    subscriber_create_response = await base.response_checker(subscriber_create);

    try {
      expect(subscriber_create_response.data.email).toEqual(subscriber_email);
      subscriber_id = subscriber_create_response.data.id;
    } catch (err) {
      console.log(subscriber_create_response);
      expect(subscriber_create.ok()).toBeFalsy();
    }
    return subscriber_id;
  }

  async subscriber_update(subscriber_updated_data: {}, subscriber_id: string) {
    const subscriber_update = await this.request.put(
      `${config.use?.baseURL}/v1/subscribers/${subscriber_id}`,
      {
        data: subscriber_updated_data,
      }
    );

    let subscriber_update_response: { data: { id: string } } = {
      data: { id: "" },
    };

    const base = new BasePage(this.request);
    subscriber_update_response = await base.response_checker(subscriber_update);

    try {
      expect(subscriber_update_response.data.id).toEqual(subscriber_id);
    } catch (err) {
      console.log(subscriber_update_response);
      expect(subscriber_update.ok()).toBeFalsy();
    }
  }

  async subscriber_delete(subscriber_id: string) {
    const subscriber_delete = await this.request.delete(
      `${config.use?.baseURL}/v1/subscribers/${subscriber_id}`,
      {
        data: {
          permanent: true,
        },
      }
    );

    let subscriber_delete_response: { deleted: number } = { deleted: 0 };

    const base = new BasePage(this.request);
    subscriber_delete_response = await base.response_checker(subscriber_delete);

    try {
      expect(subscriber_delete_response.deleted).toEqual(1);
    } catch (err) {
      console.log(subscriber_delete_response);
      expect(subscriber_delete.ok()).toBeFalsy();
    }
  }
}
