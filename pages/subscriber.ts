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

  async subscriber_delete(subscriber_id: string[]) {
    const subscriber_delete = await this.request.delete(
      `${config.use?.baseURL}/v1/subscribers/${subscriber_id[0]}`,
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

  async subscribers_list(list_id: string, subscriber_email: string) {
    const subscribers_list = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_id}/subscribers`,
      {}
    );

    let subscribers_list_response: {
      data: Array<{ email: string; id: string }>;
    } = {
      data: [],
    };
    let subscriber_id: string = "";
    let flag: boolean = false;

    const base = new BasePage(this.request);
    subscribers_list_response = await base.response_checker(subscribers_list);

    try {
      if (subscribers_list_response.data.length >= 1) {
        for (
          let i: number = 0;
          i < subscribers_list_response.data.length;
          i++
        ) {
          if (
            subscriber_email.toLowerCase() ==
            subscribers_list_response.data[i].email
          ) {
            flag = true;
            subscriber_id = subscribers_list_response.data[i].id;
            break;
          }
        }
      }
      if (flag == false) {
        expect(subscribers_list.ok()).toBeFalsy();
      }
    } catch {
      console.log("Created Subscriber Not Found");
      expect(subscribers_list.ok()).toBeFalsy();
    }
    return subscriber_id;
  }
}
