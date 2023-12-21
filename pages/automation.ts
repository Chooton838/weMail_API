import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class AutomationPage {
	readonly request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async automation_create(automation_create_data: {}) {
		const automation_create = await this.request.post(`${config.use?.baseURL}/v1/automations`, {
			data: automation_create_data,
		});

		let automation_create_response: { data: { id: string }; message: string };
		let automation_id: string = "";

		const base = new BasePage();
		automation_create_response = await base.response_checker(automation_create);

		try {
			expect(automation_create_response.message).toEqual("New automation was created.");
			automation_id = automation_create_response.data.id;
		} catch (err) {
			console.log(automation_create_response);
			expect(automation_create.ok()).toBeFalsy();
		}
		return automation_id;
	}

	async get_automation_details(automation_id: string) {
		const get_automation_details = await this.request.get(`${config.use?.baseURL}/v1/automations/${automation_id}?with=steps,triggers`);

		let automation_details_response: {
			data: { id: string; steps: { id: string } };
		};
		let delay_id: string = "";

		const base = new BasePage();
		automation_details_response = await base.response_checker(get_automation_details);

		try {
			let response_data = automation_details_response.data;
			expect(response_data.id).toEqual(automation_id);
			let steps_value = response_data.steps;
			delay_id = steps_value[0].id;
		} catch (err) {
			console.log(automation_details_response);
			expect(get_automation_details.ok()).toBeFalsy();
		}

		return delay_id;
	}

	async delete_automation_delay(automation_id: string, delay_id: string) {
		const delete_automatoin_delay = await this.request.delete(`${config.use?.baseURL}/v1/automations/${automation_id}/steps/${delay_id}`);

		let delete_automatoin_delay_response: {
			message: string;
		};

		const base = new BasePage();
		delete_automatoin_delay_response = await base.response_checker(delete_automatoin_delay);

		try {
			expect(delete_automatoin_delay_response.message).toEqual("Step has deleted.");
		} catch (err) {
			console.log(delete_automatoin_delay_response);
			expect(delete_automatoin_delay.ok()).toBeFalsy();
		}
	}

	async automation_activation(automation_id: string, automation_name: string) {
		const automation_activation = await this.request.post(`${config.use?.baseURL}/v1/automations/${automation_id}`, {
			data: {
				name: automation_name,
				status: "active",
				_method: "PATCH",
			},
		});

		let automation_activation_response: { message: string };

		const base = new BasePage();
		automation_activation_response = await base.response_checker(automation_activation);

		try {
			expect(automation_activation_response.message).toEqual("Automation has updated!");
		} catch (err) {
			console.log(automation_activation_response);
			expect(automation_activation.ok()).toBeFalsy();
		}
	}

	async automation_status(automation_id: string) {
		const automation_status = await this.request.get(`${config.use?.baseURL}/v1/automations/${automation_id}?with=emails`);

		let automation_status_response: { data: { id: string; status: string } } = {
			data: { id: "", status: "" },
		};
		let status: string = "";

		const base = new BasePage();
		automation_status_response = await base.response_checker(automation_status);

		try {
			expect(automation_status_response.data.id).toEqual(automation_id);
			status = automation_status_response.data.status;
		} catch (err) {
			console.log(automation_status_response);
			expect(automation_status.ok()).toBeFalsy();
		}

		return status;
	}

	async automation_activity(automation_id: string) {
		const automation_activity = await this.request.get(`${config.use?.baseURL}/v1/automations/${automation_id}/subscribers`);

		let automation_activity_response: { data: [{ id: string; email: string }] };

		const base = new BasePage();
		automation_activity_response = await base.response_checker(automation_activity);

		return automation_activity_response;
	}

	async automation_delete(automatoin_id: string) {
		const automation_delete = await this.request.post(`${config.use?.baseURL}/v1/campaigns/${automatoin_id}`, { data: { _method: "delete" } });

		let automation_delete_reponse: { success: boolean; message: string };

		const base = new BasePage();
		automation_delete_reponse = await base.response_checker(automation_delete);

		try {
			expect(automation_delete_reponse.success).toEqual(true);
		} catch (err) {
			console.log(automation_delete_reponse);
			expect(automation_delete.ok()).toBeFalsy();
		}
	}
}
