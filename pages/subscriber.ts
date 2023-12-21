import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class SubscriberPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async subscriber_create(
    subscriber_email: string,
    list_id: string,
    fire_event: number = 0
  ) {
    const subscriber_create = await this.request.post(
      `${config.use?.baseURL}/v1/subscribers`,
      {
        data: {
          email: subscriber_email,
          first_name: "",
          last_name: "",
          phone: "",
          lists: [list_id],
          event: fire_event,
        },
      }
    );

    let subscriber_create_response: { data: { email: string; id: string } } = {
      data: { email: "", id: "" },
    };
    let subscriber_id: string = "";

    const base = new BasePage();
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

    let subscriber_update_response: { data: { id: string; country: string } } =
      {
        data: { id: "", country: "" },
      };

    const base = new BasePage();
    subscriber_update_response = await base.response_checker(subscriber_update);

    try {
      expect(subscriber_update_response.data.country).toEqual("BD");
      expect(subscriber_update_response.data.id).toEqual(subscriber_id);
    } catch (err) {
      console.log(subscriber_update_response);
      expect(subscriber_update.ok()).toBeFalsy();
    }
  }

  async subscriber_delete(list_id: string, subscriber_id: string) {
    let form_data = new URLSearchParams();
    form_data.append("ids[]", subscriber_id);

    const subscriber_delete = await this.request.delete(
      `${config.use?.baseURL}/v1/lists/${list_id}/delete-subscribers`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form_data.toString(),
      }
    );

    let subscriber_delete_response: { message: string } = { message: "" };

    const base = new BasePage();
    subscriber_delete_response = await base.response_checker(subscriber_delete);

    try {
      expect(subscriber_delete_response.message).toEqual(
        "Subscribers delete successfully"
      );
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

    const base = new BasePage();
    subscribers_list_response = await base.response_checker(subscribers_list);

    try {
      if (subscribers_list_response.data.length > 0) {
        for (
          let i: number = 0;
          i < subscribers_list_response.data.length;
          i++
        ) {
          if (subscriber_email == subscribers_list_response.data[i].email) {
            flag = true;
            subscriber_id = subscribers_list_response.data[i].id;
            break;
          }
        }
      }
      if (flag == false) {
        console.log("Subscriber Not Found");
        console.log(subscribers_list_response);
        expect(subscribers_list.ok()).toBeFalsy();
      }
    } catch {
      console.log(subscribers_list_response);
      expect(subscribers_list.ok()).toBeFalsy();
    }
    return subscriber_id;
  }

  async subscriber_status(
    list_id: string,
    subscriber_email: string,
    subscriber_id: string
  ) {
    const subscriber_status = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_id}/subscribers?s=${subscriber_email}`
    );

    let subscriber_status_response: {
      data: Array<{ id: string; status: string }>;
    };
    let status = "";

    const base = new BasePage();
    subscriber_status_response = await base.response_checker(subscriber_status);

    try {
      expect(subscriber_status_response.data[0].id).toEqual(subscriber_id);
      status = subscriber_status_response.data[0].status;
    } catch (err) {
      console.log(subscriber_status_response);
      expect(subscriber_status.ok()).toBeFalsy();
    }
    return status;
  }

  async subscribe_double_opt_in_list(
    list_id: string,
    subscriber_email: string
  ) {
    const subscribe_double_opt_in_list = await this.request.post(
      `${config.use?.baseURL}/v1/embed/check-subscribe/${list_id}`,
      { data: { email: subscriber_email, purpose: "test" } }
    );

    let subscribe_double_opt_in_list_response: { url: string } = { url: "" };
    let verification_url: string = "";

    const base = new BasePage();
    subscribe_double_opt_in_list_response = await base.response_checker(
      subscribe_double_opt_in_list
    );

    try {
      expect(typeof subscribe_double_opt_in_list_response.url).toBe("string");
      verification_url = subscribe_double_opt_in_list_response.url;
    } catch (err) {
      console.log(subscribe_double_opt_in_list_response);
      expect(subscribe_double_opt_in_list.ok()).toBeFalsy();
    }
    return verification_url;
  }

  async verify_subscriber(verification_url: string) {
    const verify_subscriber = await this.request.get(
      `${config.use?.baseURL}${verification_url}`
    );

    let verify_subscriber_response: { message: string } = { message: "" };

    const base = new BasePage();
    verify_subscriber_response = await base.response_checker(verify_subscriber);

    try {
      expect(verify_subscriber_response.message).toContain(
        "Your subscription has been confirmed. You've been added to our list & will hear from us soon."
      );
    } catch (err) {
      console.log(verify_subscriber_response);
      expect(verify_subscriber.ok()).toBeFalsy();
    }
  }

  async check_subscriber_on_list(list_id: string, subscriber_email: string) {
    const check_subscriber_on_list = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_id}/subscribers`,
      {}
    );

    let check_subscriber_on_list_response: {
      data: Array<{ email: string; id: string }>;
    } = {
      data: [],
    };
    let found_subscriber: boolean = false;

    const base = new BasePage();
    check_subscriber_on_list_response = await base.response_checker(
      check_subscriber_on_list
    );

    try {
      if (check_subscriber_on_list_response.data.length > 0) {
        for (
          let i: number = 0;
          i < check_subscriber_on_list_response.data.length;
          i++
        ) {
          if (
            subscriber_email == check_subscriber_on_list_response.data[i].email
          ) {
            found_subscriber = true;
            break;
          }
        }
      }
    } catch {
      console.log(check_subscriber_on_list_response);
      expect(check_subscriber_on_list.ok()).toBeFalsy();
    }
    return found_subscriber;
  }

  async subscriber_tag_details(list_id: string, subscriber_id: string) {
    const subscriber_details = await this.request.get(
      `${config.use?.baseURL}/v1/subscribers/${subscriber_id}`
    );

    let subscriber_details_response: {
      data: {
        id: string;
        lists: Array<{
          id: string;
          tags: Array<{ id: string }>;
        }>;
      };
    };
    let tag_count: number = 0;

    const base = new BasePage();
    subscriber_details_response = await base.response_checker(
      subscriber_details
    );

    try {
      expect(subscriber_details_response.data.id).toEqual(subscriber_id);
      for (
        let i: number = 0;
        i < subscriber_details_response.data.lists.length;
        i++
      ) {
        if (list_id == subscriber_details_response.data.lists[i].id) {
          tag_count = subscriber_details_response.data.lists[i].tags.length;
          break;
        }
      }
    } catch {
      console.log(subscriber_details_response);
      expect(subscriber_details.ok()).toBeFalsy();
    }

    return tag_count;
  }

  async subscriber_custom_field_details(
    list_id: string,
    subscriber_id: string
  ) {
    const subscriber_custom_field_details = await this.request.get(
      `${config.use?.baseURL}/v1/subscribers/${subscriber_id}`
    );

    let subscriber_custom_field_details_response: {
      data: {
        id: string;
        lists: Array<{
          id: string;
          fields: {};
        }>;
      };
    };

    let subscriber_custom_field_stats: {
      fields_count: number;
      options_count: number;
    } = { fields_count: 0, options_count: 0 };

    const base = new BasePage();
    subscriber_custom_field_details_response = await base.response_checker(
      subscriber_custom_field_details
    );

    try {
      expect(subscriber_custom_field_details_response.data.id).toEqual(
        subscriber_id
      );
      for (
        let i: number = 0;
        i < subscriber_custom_field_details_response.data.lists.length;
        i++
      ) {
        if (
          subscriber_custom_field_details_response.data.lists[i].id == list_id
        ) {
          subscriber_custom_field_stats.fields_count = Object.keys(
            subscriber_custom_field_details_response.data.lists[i].fields
          ).length;

          if (subscriber_custom_field_stats.fields_count > 0) {
            for (let key in subscriber_custom_field_details_response.data.lists[
              i
            ].fields) {
              if (
                subscriber_custom_field_details_response.data.lists[
                  i
                ].fields.hasOwnProperty(key)
              ) {
                subscriber_custom_field_stats.options_count =
                  subscriber_custom_field_details_response.data.lists[i].fields[
                    key
                  ].length;
              }
            }
          }
          break;
        }
      }
    } catch {
      console.log(subscriber_custom_field_details_response);
      expect(subscriber_custom_field_details.ok()).toBeFalsy();
    }

    return subscriber_custom_field_stats;
  }
}
