import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class AutomationPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async automation_create(list_id: string) {
    data.automation_create_data.triggers[0].payload.list_id = list_id;
    const automation_create = await this.request.post(
      `${config.use?.baseURL}/v1/automations`,
      {
        data: data.automation_create_data,
      }
    );

    let automation_create_response: { data: { id: string }; message: string };
    let automation_id: string = "";

    const base = new BasePage(this.request);
    automation_create_response = await base.response_checker(automation_create);

    try {
      expect(automation_create_response.message).toEqual(
        "New automation was created."
      );
      automation_id = automation_create_response.data.id;
    } catch (err) {
      console.log(automation_create_response);
      expect(automation_create.ok()).toBeFalsy();
    }
    return automation_id;
  }

  async automation_activation(automation_id: string) {
    const automation_activation = await this.request.post(
      `${config.use?.baseURL}/v1/automations/${automation_id}`,
      {
        data: {
          name: "Automated - Welcome Message",
          status: "active",
          _method: "PATCH",
        },
      }
    );

    let automation_activation_response;

    const base = new BasePage(this.request);
    automation_activation_response = await base.response_checker(
      automation_activation
    );

    try {
      console.log(automation_activation_response);
    } catch (err) {
      console.log(automation_activation_response);
      expect(automation_activation.ok()).toBeFalsy();
    }
  }

  //   async lists_of_list(list_id: string) {
  //     const lists_of_list = await this.request.get(
  //       `${config.use?.baseURL}/v1/lists`
  //     );

  //     let lists_of_list_response: {
  //       data: Array<{ id: string }>;
  //     } = {
  //       data: [{ id: "" }],
  //     };

  //     const base = new BasePage(this.request);
  //     lists_of_list_response = await base.response_checker(lists_of_list);

  //     try {
  //       expect(lists_of_list_response.data[0].id).toEqual(list_id);
  //     } catch (err) {
  //       console.log(lists_of_list_response);
  //       expect(lists_of_list.ok()).toBeFalsy();
  //     }
  //   }

  //   async list_details(list_id: string) {
  //     const list_details = await this.request.get(
  //       `${config.use?.baseURL}/v1/lists/${list_id}`
  //     );

  //     let list_details_response: {
  //       data: { id: string };
  //     } = {
  //       data: { id: "" },
  //     };

  //     const base = new BasePage(this.request);
  //     list_details_response = await base.response_checker(list_details);

  //     try {
  //       expect(list_details_response.data.id).toEqual(list_id);
  //     } catch (err) {
  //       console.log(list_details_response);
  //       expect(list_details.ok()).toBeFalsy();
  //     }
  //   }

  //   async list_update(list_id: string, list_name: string) {
  //     const list_update = await this.request.put(
  //       `${config.use?.baseURL}/v1/lists/${list_id}`,
  //       {
  //         data: {
  //           name: `Updated - ${list_name}`,
  //           description: `${list_name}'s description is also updated`, //Optional
  //         },
  //       }
  //     );

  //     let list_update_response: { message: string } = { message: "" };

  //     const base = new BasePage(this.request);
  //     list_update_response = await base.response_checker(list_update);

  //     try {
  //       expect(list_update_response.message).toEqual(
  //         "List updated successfully."
  //       );
  //     } catch (err) {
  //       console.log(list_update_response);
  //       expect(list_update.ok()).toBeFalsy();
  //     }
  //   }

  //   async list_delete(lists: string[]) {
  //     const list_delete = await this.request.post(
  //       `${config.use?.baseURL}/v1/lists`,
  //       {
  //         data: {
  //           ids: lists,
  //           _method: "DELETE",
  //         },
  //       }
  //     );

  //     let list_delete_response: { message: string } = { message: "" };

  //     const base = new BasePage(this.request);
  //     list_delete_response = await base.response_checker(list_delete);

  //     try {
  //       expect(list_delete_response.message).toEqual(
  //         "Lists deleted successfully"
  //       );
  //     } catch (err) {
  //       console.log(list_delete_response);
  //       expect(list_delete.ok()).toBeFalsy();
  //     }
  //   }
}
