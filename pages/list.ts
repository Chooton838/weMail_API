import { APIRequestContext, expect } from "@playwright/test";
import { base_url } from "../utils/data";

export class ListPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async list_create(list_name) {
    const list_create = await this.request.post(`${base_url}/v1/lists`, {
      data: {
        name: list_name,
        description: "", //Optional
      },
    });

    let list_create_response: { data: { id: string }; message: string } = {
      data: { id: "" },
      message: "",
    };

    expect(list_create.ok()).toBeTruthy();

    try {
      list_create_response = await list_create.json();
      expect(list_create_response.message).toEqual(
        "List created successfully."
      );
      return list_create_response.data.id;
    } catch (err) {
      console.log("Error is: ", list_create.statusText());
      return "";
    }
  }

  async lists_of_list(list_id) {
    const lists_of_list = await this.request.get(`${base_url}/v1/lists`);

    let lists_of_list_response: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };

    expect(lists_of_list.ok()).toBeTruthy();

    try {
      lists_of_list_response = await lists_of_list.json();
      expect(lists_of_list_response.data[0].id).toEqual(list_id);
    } catch (err) {
      console.log("Error is: ", lists_of_list.statusText());
    }
  }

  async list_details(list_id) {
    const list_details = await this.request.get(
      `${base_url}/v1/lists/${list_id}`
    );

    let list_details_response: {
      data: { id: string };
    } = {
      data: { id: "" },
    };

    expect(list_details.ok()).toBeTruthy();

    try {
      list_details_response = await list_details.json();
      expect(list_details_response.data.id).toEqual(list_id);
    } catch (err) {
      console.log("Error is: ", list_details.statusText());
    }
  }

  async list_update(list_id, updated_list_name, list_description) {
    const list_update = await this.request.put(
      `${base_url}/v1/lists/${list_id}`,
      {
        data: {
          name: updated_list_name,
          description: list_description, //Optional
        },
      }
    );

    let list_update_response: { message: string } = { message: "" };

    expect(list_update.ok()).toBeTruthy();

    try {
      list_update_response = await list_update.json();
      expect(list_update_response.message).toEqual(
        "List updated successfully."
      );
    } catch (err) {
      console.log("Error is: ", list_update.statusText());
    }
  }

  async list_delete(lists) {
    const list_delete = await this.request.post(`${base_url}/v1/lists`, {
      data: {
        ids: lists,
        _method: "DELETE",
      },
    });

    let list_delete_response: { message: string } = { message: "" };

    expect(list_delete.ok()).toBeTruthy();

    try {
      list_delete_response = await list_delete.json();
      expect(list_delete_response.message).toEqual(
        "Lists deleted successfully"
      );
    } catch (err) {
      console.log("Error is: ", list_delete.statusText());
    }
  }
}
