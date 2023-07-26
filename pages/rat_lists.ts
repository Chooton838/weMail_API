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
    const listCreateRequest = await this.request.post(
      `${config.use?.baseURL}/v1/lists`,
      {
        data: {
          name: listName,
          description: `${listName} - is a test, created by @rat-qa`,
        },
      }
    );

    let listCreateResponseData: {
      data: { id: string; name: string };
      message: string;
    } = {
      data: { id: "", name: "" },
      message: "",
    };

    //Check List created status
    try {
      expect(listCreateRequest.ok()).toBeTruthy();
      listCreateResponseData = await listCreateRequest.json();
      console.log(`Status is: ${listCreateRequest.status()}`);
      console.log(`Status Text is: ${listCreateRequest.statusText()}`);
    } catch (err) {
      console.log("List creation was unsuccessful");
      console.log(`Status is: ${listCreateRequest.status()}`);
      console.log(`Status Text is: ${listCreateRequest.statusText()}`);
    }

    console.log(`The List created ID is: ${listCreateResponseData.data.id}`);
    console.log(
      `The List created Name is: ${listCreateResponseData.data.name}`
    );
    console.log(
      `The List created Message is: ${listCreateResponseData.message}`
    );

    try {
      expect(listCreateResponseData.data.name).toEqual(listName);
    } catch (err) {
      console.log("List creation was unsuccessful");
      console.log(`Status is: ${listCreateRequest.status()}`);
      console.log(`Status Text is: ${listCreateRequest.statusText()}`);
    }

    //Store List created ID
    const list_created_id = listCreateResponseData.data.id;
    console.log(`The List created ID:-> ${list_created_id}, has been stored`);

    return list_created_id;
  }

  //View List created
  async validate_list(list_created_id: string) {
    console.log(`The ID sent is -->>> ${list_created_id}`);
    const getListsRequest = await this.request.get(
      `${config.use?.baseURL}/v1/lists`
    );

    let getListsAllResponse: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };

    getListsAllResponse = await getListsRequest.json();

    console.log(`Status is: ${getListsRequest.status()}`);
    console.log(`Status Text is: ${getListsRequest.statusText()}`);
    console.log(`The ID of Item[0] is: ${getListsAllResponse.data[0].id}`);

    try {
      expect(getListsAllResponse.data[0].id).toEqual(list_created_id);
    } catch (err) {
      console.log(
        `The response received was: ${JSON.stringify(getListsAllResponse)}`
      );
      expect(getListsRequest.ok()).toBeFalsy();
    }
  }

  //TODO: Complete Scripts below

  //Update List
  async list_update() {
    //! Do
  }

  //Delete List
  async list_delete() {
    //! Do
  }
}
