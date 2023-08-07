import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class ListPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async list_create(list_name: string) {
    const list_create = await this.request.post(
      `${config.use?.baseURL}/v1/lists`,
      {
        data: {
          name: list_name,
          description: `${list_name} is a test list - created by automation script`, //Optional
        },
      }
    );

    let list_create_response: { data: { id: string }; message: string } = {
      data: { id: "" },
      message: "",
    };
    let list_id: string = "";

    const base = new BasePage(this.request);
    list_create_response = await base.response_checker(list_create);

    try {
      expect(list_create_response.message).toEqual(
        "List created successfully."
      );
      list_id = list_create_response.data.id;
    } catch (err) {
      console.log(list_create_response);
      expect(list_create.ok()).toBeFalsy();
    }
    return list_id;
  }

  async lists_of_list(list_id: string) {
    const lists_of_list = await this.request.get(
      `${config.use?.baseURL}/v1/lists`
    );

    let lists_of_list_response: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };
    let flag: boolean = false;

    const base = new BasePage(this.request);
    lists_of_list_response = await base.response_checker(lists_of_list);

    try {
      if (lists_of_list_response.data.length > 1) {
        for (let i: number = 0; i < lists_of_list_response.data.length; i++) {
          if (lists_of_list_response.data[i].id == list_id) {
            flag = true;
            break;
          }
        }
      }
      if (flag == false) {
        console.log("Created List Not Found");
        expect(lists_of_list.ok()).toBeFalsy();
      }
    } catch (err) {
      console.log(lists_of_list_response);
      expect(lists_of_list.ok()).toBeFalsy();
    }
  }

  async list_details(list_id: string) {
    const list_details = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_id}`
    );

    let list_details_response: {
      data: { id: string };
    } = {
      data: { id: "" },
    };

    const base = new BasePage(this.request);
    list_details_response = await base.response_checker(list_details);

    try {
      expect(list_details_response.data.id).toEqual(list_id);
    } catch (err) {
      console.log(list_details_response);
      expect(list_details.ok()).toBeFalsy();
    }
  }

  async list_update(list_id: string, list_name: string) {
    const list_update = await this.request.put(
      `${config.use?.baseURL}/v1/lists/${list_id}`,
      {
        data: {
          name: `Updated - ${list_name}`,
          description: `${list_name}'s description is also updated`, //Optional
        },
      }
    );

    let list_update_response: { message: string } = { message: "" };

    const base = new BasePage(this.request);
    list_update_response = await base.response_checker(list_update);

    try {
      expect(list_update_response.message).toEqual(
        "List updated successfully."
      );
    } catch (err) {
      console.log(list_update_response);
      expect(list_update.ok()).toBeFalsy();
    }
  }

  async list_delete(lists: string[]) {
    const list_delete = await this.request.post(
      `${config.use?.baseURL}/v1/lists`,
      {
        data: {
          ids: lists,
          _method: "DELETE",
        },
      }
    );

    let list_delete_response: { message: string } = { message: "" };

    const base = new BasePage(this.request);
    list_delete_response = await base.response_checker(list_delete);

    try {
      expect(list_delete_response.message).toEqual(
        "Lists deleted successfully"
      );
    } catch (err) {
      console.log(list_delete_response);
      expect(list_delete.ok()).toBeFalsy();
    }
  }
}
