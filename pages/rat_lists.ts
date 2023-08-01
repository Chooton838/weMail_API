import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class Rat_ListsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Create List
  async list_create(listName: string) {
    const listCreate_Request = await this.request.post(`${config.use?.baseURL}/v1/lists`, {
      data: {
        name: `[Rat-QA] ${listName}`,
        description: `[Rat-QA] The created list is -  ${listName}`,
      },
    });

    let listCreate_Response: {
      data: { id: string; name: string };
      message: string;
    } = {
      data: { id: "", name: "" },
      message: "",
    };

    //Check List created status
    try {
      expect(listCreate_Request.ok()).toBeTruthy();
      listCreate_Response = await listCreate_Request.json();
      console.log(`Message is: ${listCreate_Response.message}`);
    } catch (err) {
      console.log(`Status is: ${listCreate_Request.status()}`);
      console.log(`Status-Text is: ${listCreate_Request.statusText()}`);
    }

    try {
      expect(listCreate_Response.data.name).toEqual(listName);
    } catch (err) {
      console.log(`Status is: ${listCreate_Request.status()}`);
      console.log(`Status-Text is: ${listCreate_Request.statusText()}`);
    }

    //Store List created ID
    const list_created_id = listCreate_Response.data.id;
    console.log(`List-created ID:-> ${list_created_id}, has been stored`);

    return list_created_id;
  }

  //View List created
  async validate_list(list_created_id: string) {
    console.log(`The ID sent is -->>> ${list_created_id}`);
    const getLists_Request = await this.request.get(`${config.use?.baseURL}/v1/lists`);

    let getListsAll_Response: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };

    try {
      expect(getLists_Request.ok()).toBeTruthy();
      getListsAll_Response = await getLists_Request.json();
    } catch (err) {
      console.log(`Status is: ${getLists_Request.status()}`);
      console.log(`Status Text is: ${getLists_Request.statusText()}`);
      console.log(`The ID of Item[0] is: ${getListsAll_Response.data[0].id}`);
    }

    try {
      expect(getListsAll_Response.data[0].id).toEqual(list_created_id);
    } catch (err) {
      console.log(`The response received was: ${JSON.stringify(getListsAll_Response)}`);
      expect(getLists_Request.ok()).toBeFalsy();
    }
  }

  //Edit/Update List
  async list_update(list_created_id: string) {
    //Edit - List
    //Get request
    const getListEdit_Request = await this.request.get(`${config.use?.baseURL}/v1/lists/${list_created_id}`);

    let getListEdit_Response: {
      data: {
        id: string;
        name: string;
        description: string;
      };
    } = {
      data: {
        id: "",
        name: "",
        description: "",
      },
    };

    //Validate Response of Edit opened
    try {
      expect(getListEdit_Request.ok()).toBeTruthy();
      getListEdit_Response = await getListEdit_Request.json();
    } catch (err) {
      console.log(`Status is: ${getListEdit_Request.status()}`);
      console.log(`Status-Text is: ${getListEdit_Request.statusText()}`);
      console.log(`ID of Current-Item is: ${getListEdit_Response.data.id}`);
    }

    //Update - List Name & Description
    //Put request
    const ListEdit_Request = await this.request.put(`${config.use?.baseURL}/v1/lists/${list_created_id}`, {
      data: {
        name: `${getListEdit_Response.data.name} + (--Updated--)`,
        description: `${getListEdit_Response.data.description} + (--Updated--)`,
      },
    });

    let ListEdited_Response: {
      data: {
        id: string;
        name: string;
        description: string;
      };
      message: string;
    } = {
      data: {
        id: "",
        name: "",
        description: "",
      },
      message: "",
    };

    //Validate List Edited/Updated
    try {
      expect(ListEdit_Request.ok()).toBeTruthy();
      ListEdited_Response = await ListEdit_Request.json();
      console.log(`Message is: ${ListEdited_Response.message}`);
    } catch (err) {
      console.log(`Status is: ${ListEdit_Request.status()}`);
      console.log(`Status-Text is: ${ListEdit_Request.statusText()}`);
    }

    //Store List created ID
    const list_updated_id = ListEdited_Response.data.id;
    console.log(`List-updated ID:-> ${list_created_id}, has been stored`);

    return list_updated_id;
  }

  //Delete List
  async list_delete(updated_list_id) {
    //Get - All List items
    //Get response
    console.log(`The ID sent is -->>> ${updated_list_id}`);
    const getLists_Request = await this.request.get(`${config.use?.baseURL}/v1/lists`);

    let getListsAll_Response: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };

    try {
      expect(getLists_Request.ok()).toBeTruthy();
      getListsAll_Response = await getLists_Request.json();
    } catch (err) {
      console.log(`Status is: ${getLists_Request.status()}`);
      console.log(`Status-Text is: ${getLists_Request.statusText()}`);
    }

    const listDelete_Request = await this.request.delete(`${config.use?.baseURL}/v1/lists/`, {
      data: {
        ids: [getListsAll_Response.data[0].id],
      },
    });

    //listDeleted_Response
    let listDelete_Response: {
      message: string;
    } = {
      message: "",
    };

    try {
      listDelete_Response = await listDelete_Request.json();
      console.log(listDelete_Response.message);
    } catch (err) {
      console.log(`Status is: ${listDelete_Request.status()}`);
      console.log(`Status-Text is: ${listDelete_Request.statusText()}`);
    }
  }
}
