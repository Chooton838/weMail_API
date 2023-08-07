import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

export class CampaignPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async create_campaign(campaign_data) {
    const create_campaign = await this.request.post(
      `${config.use?.baseURL}/v1/campaigns`,
      {
        data: campaign_data,
      }
    );

    let create_campaign_response: { data: { name: string; id: string } } = {
      data: { name: "", id: "" },
    };
    let campaign_id: string = "";

    const base = new BasePage(this.request);
    create_campaign_response = await base.response_checker(create_campaign);

    try {
      expect(create_campaign_response.data.name).toEqual(campaign_data.name);
      campaign_id = create_campaign_response.data.id;
    } catch (err) {
      console.log(create_campaign_response);
      expect(create_campaign.ok()).toBeFalsy();
    }

    return campaign_id;
  }

  async duplicate_campaign(main_campaign_id: string) {
    const duplicate_campaign = await this.request.post(
      `${config.use?.baseURL}/v1/campaigns/${main_campaign_id}/duplicate`,
      {}
    );

    let duplicate_campaign_response: { data: { name: string; id: string } } = {
      data: { name: "", id: "" },
    };
    let duplicated_campaign_id: string = "";

    const base = new BasePage(this.request);
    duplicate_campaign_response = await base.response_checker(
      duplicate_campaign
    );

    try {
      expect(duplicate_campaign_response.data.name).toEqual(
        `Duplicate: ${data.campaign_data.name}`
      );
      duplicated_campaign_id = duplicate_campaign_response.data.id;
    } catch (err) {
      console.log(duplicate_campaign_response);
      expect(duplicate_campaign.ok()).toBeFalsy();
    }
    return duplicated_campaign_id;
  }

  async send_campaign(campaign_id: string) {
    const send_campaign = await this.request.post(
      `${config.use?.baseURL}/v1/campaigns/${campaign_id}/send`,
      {}
    );

    let send_campaign_response: { data: { status: string } } = {
      data: { status: "" },
    };

    const base = new BasePage(this.request);
    send_campaign_response = await base.response_checker(send_campaign);

    try {
      expect(send_campaign_response.data.status).toEqual("active");
    } catch (err) {
      console.log(send_campaign_response);
      expect(send_campaign.ok()).toBeFalsy();
    }
  }

  async campaign_activity(campaign_id: string) {
    const campaign_activity = await this.request.get(
      `${config.use?.baseURL}/v1/campaigns/${campaign_id}`
    );

    let campaign_activity_response: {
      data: { id: string; email: { id: string } };
    };
    let email_id: string = "";

    const base = new BasePage(this.request);
    campaign_activity_response = await base.response_checker(campaign_activity);

    try {
      expect(campaign_activity_response.data.id).toEqual(campaign_id);
      email_id = campaign_activity_response.data.email.id;
    } catch (err) {
      console.log(campaign_activity_response);
      expect(campaign_activity.ok()).toBeFalsy();
    }

    return email_id;
  }

  async campaign_status(email_id: string, subscriber_mail: string) {
    const campaign_status = await this.request.get(
      `${config.use?.baseURL}/v1/emails/${email_id}/subscribers/${subscriber_mail}/activities`
    );

    let campaign_status_response: { data: Array<{ type: string }> } = {
      data: [{ type: "" }],
    };
    let sent_status: string = "";

    const base = new BasePage(this.request);
    campaign_status_response = await base.response_checker(campaign_status);

    try {
      console.log(campaign_status);
      sent_status = campaign_status_response.data[0].type;
    } catch (err) {
      console.log(campaign_status_response);
      expect(campaign_status.ok()).toBeFalsy();
    }
    return sent_status;
  }

  async delete_campaign(campaign_id) {
    const delete_campaign = await this.request.delete(
      `${config.use?.baseURL}/v1/campaigns/${campaign_id}`,
      {}
    );

    let delete_campaign_response: { message: string } = { message: "" };

    const base = new BasePage(this.request);
    delete_campaign_response = await base.response_checker(delete_campaign);

    try {
      expect(delete_campaign_response.message).toEqual("Deleted!");
    } catch (err) {
      console.log(delete_campaign_response);
      expect(delete_campaign.ok()).toBeFalsy();
    }
  }
}
