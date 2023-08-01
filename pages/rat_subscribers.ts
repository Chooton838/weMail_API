import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class Rat_SubscribersPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Add Subscriber
  async add_subscriber(
    list_created_id: string,
    subs_email: string,
    subs_fname: string,
    subs_lname: string
  ) {
    //Add Subscriber to list
    const add_Subscriber_Request = await this.request.post(`${config.use?.baseURL}/v1/subscribers`, {
      data: {
        email: subs_email,
        first_name: subs_fname,
        last_name: subs_lname,
        lists: [list_created_id],
        event: 0,
      },
    });

    let add_Subscriber_Response: {
      data: {
        email: string;
        id: string;
      };
    } = {
      data: {
        email: "",
        id: "",
      },
    };

    try {
      expect(add_Subscriber_Request.ok()).toBeTruthy();
      add_Subscriber_Response = await add_Subscriber_Request.json();
    } catch (err) {
      console.log(`Status is: ${add_Subscriber_Request.status()}`);
      console.log(`Status-Text is: ${add_Subscriber_Request.statusText()}`);
      expect(add_Subscriber_Request.ok()).toBeTruthy();
    }

    try {
      expect(add_Subscriber_Response.data.email).toEqual(subs_email);
    } catch (err) {
      console.log(`Status is: ${add_Subscriber_Request.status()}`);
      console.log(`Status-Text is: ${add_Subscriber_Request.statusText()}`);
    }

    return add_Subscriber_Response.data.id;
  }

  async validate_subscriber(list_created_id: string, added_Subscriber_id: string) {
    const getSubscriberList_Request = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_created_id}/subscribers`
    );

    let getSubscriberList_Response: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };

    try {
      expect(getSubscriberList_Request.ok()).toBeTruthy();
      console.log(`Status is: ${getSubscriberList_Request.status()}`);
      console.log(`StatusText is: ${getSubscriberList_Request.statusText()}`);
    } catch (err) {
      console.log(`Status is: ${getSubscriberList_Request.status()}`);
      console.log(`StatusText is: ${getSubscriberList_Request.statusText()}`);
    }

    getSubscriberList_Response = await getSubscriberList_Request.json();

    try {
      expect(getSubscriberList_Response.data[0].id).toBe(added_Subscriber_id);
    } catch (err) {
      console.log(`Status is: ${getSubscriberList_Request.status()}`);
      console.log(`StatusText is: ${getSubscriberList_Request.statusText()}`);
      console.log(`Found: ${getSubscriberList_Response.data[0].id}`);
      console.log(`Sent: ${added_Subscriber_id}`);
    }
  }

  async update_subscriber(subs_phone: string, added_Subscriber_id: string) {
    const update_Subscriber_Request = await this.request.put(
      `${config.use?.baseURL}/v1/subscribers/${added_Subscriber_id}`,
      {
        data: {
          phone: subs_phone,
        },
      }
    );

    let update_Subscriber_Response: {
      data: {
        id: string;
        phone: string;
      };
    } = {
      data: {
        id: "",
        phone: "",
      },
    };

    try {
      expect(update_Subscriber_Request.ok()).toBeTruthy();
      console.log(`Status is: ${update_Subscriber_Request.status()}`);
      console.log(`StatusText is: ${update_Subscriber_Request.statusText()}`);
    } catch (err) {
      console.log(`Status is: ${update_Subscriber_Request.status()}`);
      console.log(`StatusText is: ${update_Subscriber_Request.statusText()}`);
    }

    update_Subscriber_Response = await update_Subscriber_Request.json();

    try {
      expect(update_Subscriber_Response.data.phone).toBe(subs_phone);
      console.log(`Status is: ${update_Subscriber_Request.status()}`);
      console.log(`StatusText is: ${update_Subscriber_Request.statusText()}`);
    } catch (err) {
      console.log(`Status is: ${update_Subscriber_Request.status()}`);
      console.log(`StatusText is: ${update_Subscriber_Request.statusText()}`);
    }

    return update_Subscriber_Response.data.id;
  }

  async delete_subscriber(updated_subs_id) {
    const delete_Subscriber_Request = await this.request.delete(
      `${config.use?.baseURL}/v1/subscribers/${updated_subs_id}`,
      {
        data: {
          permanent: true,
        },
      }
    );

    try {
      expect(delete_Subscriber_Request.ok()).toBeTruthy();
    } catch (err) {
      console.log(`Status is: ${delete_Subscriber_Request.status()}`);
      console.log(`StatusText is: ${delete_Subscriber_Request.statusText()}`);
      expect(delete_Subscriber_Request.ok()).toBeTruthy();
    }

    let delete_Subscriber_Response: {
      deleted: number;
    } = {
      deleted: 0,
    };

    try {
      delete_Subscriber_Response = await delete_Subscriber_Request.json();
      console.log(`Reponse is: ${delete_Subscriber_Response.deleted}`);
      expect(delete_Subscriber_Response.deleted).toBe(1);
    } catch (err) {
      console.log(`Status is: ${delete_Subscriber_Request.status()}`);
      console.log(`StatusText is: ${delete_Subscriber_Request.statusText()}`);
      expect(delete_Subscriber_Request.ok()).toBeTruthy();
    }
  }
}
