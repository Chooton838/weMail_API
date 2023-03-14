import { APIRequestContext, expect } from "@playwright/test";
import { data } from "../utils/data";

export class SubscriberPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async subscriber_create(subscriber_email, list_id) {
    const subscriber_create = await this.request.post(
      `${data.base_url}/v1/subscribers`,
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

    expect(subscriber_create.ok()).toBeTruthy();

    try {
      subscriber_create_response = await subscriber_create.json();
      expect(subscriber_create_response.data.email).toEqual(subscriber_email);
      return subscriber_create_response.data.id;
    } catch (err) {
      console.log("Error is: ", subscriber_create.statusText());
      return "";
    }
  }

  async subscriber_update(subscriber_updated_data, subscriber_id) {
    const subscriber_update = await this.request.put(
      `${data.base_url}/v1/subscribers/${subscriber_id}`,
      {
        data: subscriber_updated_data,
      }
    );

    let subscriber_update_response: { data: { id: string } } = {
      data: { id: "" },
    };

    expect(subscriber_update.ok()).toBeTruthy();

    try {
      subscriber_update_response = await subscriber_update.json();
      expect(subscriber_update_response.data.id).toEqual(subscriber_id);
    } catch (err) {
      console.log("Error is: ", subscriber_update.statusText());
    }
  }

  async subscriber_delete(subscriber_id) {
    const subscriber_delete = await this.request.delete(
      `${data.base_url}/v1/subscribers/${subscriber_id}`,
      {
        data: {
          permanent: true,
        },
      }
    );

    let subscriber_delete_response: { deleted: number } = { deleted: 0 };

    expect(subscriber_delete.ok()).toBeTruthy();

    try {
      subscriber_delete_response = await subscriber_delete.json();
      expect(subscriber_delete_response.deleted).toEqual(1);
    } catch (err) {
      console.log("Error is: ", subscriber_delete.statusText());
    }
  }
}
