import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import * as data from "../utils/data";

export class CampaignPage {
	readonly request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async create_campaign(campaign_data) {
		const create_campaign = await this.request.post(`${config.use?.baseURL}/v1/campaigns`, {
			data: campaign_data,
		});

		let create_campaign_response: { data: { name: string; id: string } } = {
			data: { name: "", id: "" },
		};
		let campaign_id: string = "";

		const base = new BasePage();
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
		const duplicate_campaign = await this.request.post(`${config.use?.baseURL}/v1/campaigns/${main_campaign_id}/duplicate`, {});

		let duplicate_campaign_response: { data: { name: string; id: string } } = {
			data: { name: "", id: "" },
		};
		let duplicated_campaign_id: string = "";

		const base = new BasePage();
		duplicate_campaign_response = await base.response_checker(duplicate_campaign);

		try {
			expect(duplicate_campaign_response.data.name).toEqual(`Duplicate: ${data.campaign_data.name}`);
			duplicated_campaign_id = duplicate_campaign_response.data.id;
		} catch (err) {
			console.log(duplicate_campaign_response);
			expect(duplicate_campaign.ok()).toBeFalsy();
		}
		return duplicated_campaign_id;
	}

	async send_campaign(campaign_id: string) {
		const send_campaign = await this.request.post(`${config.use?.baseURL}/v1/campaigns/${campaign_id}/send`, {});

		let send_campaign_response: { data: { status: string } } = {
			data: { status: "" },
		};

		const base = new BasePage();
		send_campaign_response = await base.response_checker(send_campaign);

		try {
			expect(send_campaign_response.data.status).toEqual("active");
		} catch (err) {
			console.log(send_campaign_response);
			expect(send_campaign.ok()).toBeFalsy();
		}
	}

	async campaign_activity(campaign_id: string) {
		const campaign_activity = await this.request.get(`${config.use?.baseURL}/v1/campaigns/${campaign_id}`);

		let campaign_activity_response: {
			data: {
				id: string;
				status: string;
				no_of_subscribers: number;
				email: { id: string };
			};
		};
		let campaign_activity_stats: {
			status: string;
			no_of_subscribers: number;
			email_id: string;
		} = { status: "", no_of_subscribers: 0, email_id: "" };

		const base = new BasePage();
		campaign_activity_response = await base.response_checker(campaign_activity);

		try {
			expect(campaign_activity_response.data.id).toEqual(campaign_id);
			campaign_activity_stats.email_id = campaign_activity_response.data.email.id;
			campaign_activity_stats.no_of_subscribers = campaign_activity_response.data.no_of_subscribers;
			campaign_activity_stats.status = campaign_activity_response.data.status;
		} catch (err) {
			console.log(campaign_activity_response);
			expect(campaign_activity.ok()).toBeFalsy();
		}

		return campaign_activity_stats;
	}

	async subscriber_mail_activity(email_id: string, subscriber_mail: string) {
		const campaign_status = await this.request.get(`${config.use?.baseURL}/v1/emails/${email_id}/subscribers/${subscriber_mail}/activities`);

		let campaign_status_response: {
			data: Array<{ email: string; type: string }>;
		} = {
			data: [{ email: "", type: "" }],
		};
		let sent_status: string = "";

		const base = new BasePage();
		campaign_status_response = await base.response_checker(campaign_status);

		try {
			expect(campaign_status_response.data[0].email).toEqual(subscriber_mail);
			sent_status = campaign_status_response.data[0].type;
		} catch (err) {
			console.log(campaign_status_response);
			expect(campaign_status.ok()).toBeFalsy();
		}
		return sent_status;
	}

	async unsubscribe_campaign(campaign_id: string, subscriber_id: string, email_id: string) {
		const unsubscribe_campaign = await this.request.post(`${config.use?.baseURL}/v1/campaigns/${campaign_id}/subscribers/${subscriber_id}/unsubscribe`, {
			data: {
				email_id: email_id,
				_method: "PUT",
			},
		});

		let unsubscribe_campaign_response: { message: string } = { message: "" };
		let unsubscribed_flag: boolean = false;

		const base = new BasePage();
		unsubscribe_campaign_response = await base.response_checker(unsubscribe_campaign);

		try {
			expect(unsubscribe_campaign_response.message).toEqual("Subscriber Unsubscribe.");
			unsubscribed_flag = true;
		} catch (err) {
			console.log(unsubscribe_campaign_response);
			expect(unsubscribe_campaign.ok()).toBeFalsy();
		}

		return unsubscribed_flag;
	}

	async delete_campaign(campaign_id: string) {
		const delete_campaign = await this.request.delete(`${config.use?.baseURL}/v1/campaigns/${campaign_id}`, {});

		let delete_campaign_response: { message: string } = { message: "" };

		const base = new BasePage();
		delete_campaign_response = await base.response_checker(delete_campaign);

		try {
			expect(delete_campaign_response.message).toEqual("Deleted!");
		} catch (err) {
			console.log(delete_campaign_response);
			expect(delete_campaign.ok()).toBeFalsy();
		}
	}

	async filter_active_standard_campaign() {
		const filter_active_standard_campaign = await this.request.get(`${config.use?.baseURL}/v1/campaigns?statuses%5B%5D=active`);

		let filter_active_standard_campaign_response: {
			data: Array<{ id: string; status: string; type: string }>;
		} = { data: [] };

		let campaigns_id: Array<string> = [];

		const base = new BasePage();
		filter_active_standard_campaign_response = await base.response_checker(filter_active_standard_campaign);

		try {
			for (let i: number = 0; i < filter_active_standard_campaign_response.data.length; i++) {
				expect(filter_active_standard_campaign_response.data[i].status).toEqual("active");
				if (filter_active_standard_campaign_response.data[i].type == "standard") {
					campaigns_id.push(filter_active_standard_campaign_response.data[i].id);
				}
			}
		} catch (err) {
			console.log(filter_active_standard_campaign_response);
			expect(filter_active_standard_campaign.ok()).toBeFalsy();
		}

		return campaigns_id;
	}
}
