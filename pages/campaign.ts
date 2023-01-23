import { APIRequestContext, expect } from "@playwright/test";
import { base_url } from "../utils/data";

export class CampaignPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async create_campaign(campaign_data) {
        const create_campaign = await this.request.post(`${base_url}/v1/campaigns`, {
            data: campaign_data,
        });

        let create_campaign_response: { data: { name: string; id: string } } = {
            data: { name: "", id: "" },
        };


        expect(create_campaign.ok()).toBeTruthy();

        try {
            create_campaign_response = await create_campaign.json();
            expect(create_campaign_response.data.name).toEqual(campaign_data.name);
            return create_campaign_response.data.id;
        } catch (err) {
            console.log("Error is: ", create_campaign.statusText());
            return "";
        }
    }

    async send_campaign(campaign_id) {

        const send_campaign = await this.request.post(`${base_url}/v1/campaigns/${campaign_id}/send`, {});

        let send_campaign_response: { data: { status: string } } = {
            data: { status: "" },
        };


        expect(send_campaign.ok()).toBeTruthy();

        try {
            send_campaign_response = await send_campaign.json();
            expect(send_campaign_response.data.status).toEqual("active");
        } catch (err) {
            console.log("Error is: ", send_campaign.statusText());
        }
    }
}
