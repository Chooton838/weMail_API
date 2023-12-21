import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class SuppressionPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async create_suppression_subscriber(subscriber_email: string) {
    const suppression_create = await this.request.post(
      `${config.use?.baseURL}/v1/suppression-users`,
      { data: { email: subscriber_email } }
    );

    let suppression_create_response: { message: string };

    const base = new BasePage();
    suppression_create_response = await base.response_checker(
      suppression_create
    );

    try {
      expect(suppression_create_response.message).toEqual(
        "Suppression user created successfully"
      );
    } catch (err) {
      console.log(suppression_create_response);
      expect(suppression_create.ok()).toBeFalsy();
    }
  }

  async search_suppression_subscriber(subscriber_email: string) {
    const search_suppression_subscriber = await this.request.get(
      `${config.use?.baseURL}/v1/suppression-users`,
      { data: { s: subscriber_email } }
    );

    let search_suppression_subscriber_response: {
      data: Array<{ id: string; email: string; event: string }>;
    };

    const base = new BasePage();
    search_suppression_subscriber_response = await base.response_checker(
      search_suppression_subscriber
    );
    let flag: boolean = false;
    let suppression_subscriber_id: string = "";

    try {
      if (search_suppression_subscriber_response.data.length > 0) {
        for (
          let i: number = 0;
          i < search_suppression_subscriber_response.data.length;
          i++
        ) {
          if (
            search_suppression_subscriber_response.data[i].email ==
              subscriber_email &&
            search_suppression_subscriber_response.data[i].event == "Manually"
          ) {
            flag = true;
            suppression_subscriber_id =
              search_suppression_subscriber_response.data[i].id;
            break;
          }
        }
      }
      if (flag == false) {
        console.log("Created Suppression Subscriber Not Found");
      }
    } catch (err) {
      console.log(search_suppression_subscriber_response);
      expect(search_suppression_subscriber.ok()).toBeFalsy();
    }
    return suppression_subscriber_id;
  }

  async delete_suppression_subscriber(subscriber_id: string[]) {
    const delete_suppression_subscriber = await this.request.post(
      `${config.use?.baseURL}/v1/suppression-users`,
      { data: { ids: subscriber_id, _method: "DELETE" } }
    );

    let delete_suppression_subscriber_response: { message: string } = {
      message: "",
    };

    const base = new BasePage();
    delete_suppression_subscriber_response = await base.response_checker(
      delete_suppression_subscriber
    );

    try {
      expect(delete_suppression_subscriber_response.message).toEqual(
        "Suppression user deleted successfully"
      );
    } catch (err) {
      console.log(delete_suppression_subscriber_response);
      expect(delete_suppression_subscriber.ok()).toBeFalsy();
    }
  }
}
