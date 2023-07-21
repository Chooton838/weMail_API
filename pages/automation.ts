import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class AutomationPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async welcome_automation_create(list_id: string) {
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

    let automation_activation_response: { message: string };

    const base = new BasePage(this.request);
    automation_activation_response = await base.response_checker(
      automation_activation
    );

    try {
      expect(automation_activation_response.message).toEqual(
        "Automation has updated!"
      );
    } catch (err) {
      console.log(automation_activation_response);
      expect(automation_activation.ok()).toBeFalsy();
    }
  }

  async automation_activity(automation_id: string, subscriber_email: string) {
    const automation_activity = await this.request.get(
      `${config.use?.baseURL}/v1/automations/${automation_id}/subscribers`
    );

    let automation_activity_response: { data: [{ id: string; email: string }] };

    const base = new BasePage(this.request);
    automation_activity_response = await base.response_checker(
      automation_activity
    );

    try {
      if (
        subscriber_email.toLowerCase() !=
        automation_activity_response.data[0].email
      ) {
        console.log("Automation Not Triggured");
      }
    } catch (err) {
      console.log(automation_activity_response);
      expect(automation_activity.ok()).toBeFalsy();
    }
  }

  async automation_delete(automatoin_id: string) {
    const automation_delete = await this.request.post(
      `${config.use?.baseURL}/v1/campaigns/${automatoin_id}`,
      { data: { _method: "delete" } }
    );

    let automation_delete_reponse: { success: boolean; message: string };

    const base = new BasePage(this.request);
    automation_delete_reponse = await base.response_checker(automation_delete);

    try {
      expect(automation_delete_reponse.success).toEqual(true);
    } catch (err) {
      console.log(automation_delete_reponse);
      expect(automation_delete.ok()).toBeFalsy();
    }
  }
}
