import { expect, Page } from "@playwright/test";
import * as data from "../utils/data";
import * as selector from "../utils/selectors";

export class AdminPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}
	async form_sync_with_frontend() {
		await this.page.goto(data.wordpress_site_data.url, {
			waitUntil: "networkidle",
		});

		await this.page.goto(selector.wemail_forms_selectors.forms_page_url, {
			waitUntil: "networkidle",
		});

		await this.page.locator(selector.wemail_forms_selectors.forms_sync).click();
		await this.page.waitForLoadState("networkidle");

		await this.page.waitForSelector(selector.wemail_forms_selectors.form_update_toast);
	}

	async form_publish(form_id: string) {
		await this.page.goto(data.wordpress_site_data.url, {
			waitUntil: "networkidle",
		});
		await this.page.goto(selector.create_post.create_post_page_url, {
			waitUntil: "networkidle",
		});

		await expect(this.page.locator(selector.create_post.add_new_page)).toHaveText("Add New Page");

		await this.page.locator(selector.create_post.title).fill(`Automated Forms`);
		await this.page.locator(selector.create_post.text_type).click();
		await this.page.locator(selector.create_post.textarea_content).click();
		await this.page.locator(selector.create_post.textarea_content).fill(`[wemail_form id="${form_id}"]`);

		await this.page.waitForTimeout(2000);
		await this.page.locator(selector.create_post.publish_button).click();

		await this.page.waitForLoadState("networkidle");
		await this.page.waitForSelector(selector.create_post.published_toast, {
			state: "visible",
			timeout: 3000,
		});

		let page_url: string | null;

		page_url = await this.page.locator(selector.create_post.published_toast).getAttribute("href");

		return page_url;
	}

	async form_submit(form_page_url: string, subscriber_email: string) {
		await this.page.goto(form_page_url);
		await this.page.waitForLoadState("networkidle");

		await this.page.locator(selector.form_submit.form_username).fill("dummy user");
		await this.page.locator(selector.form_submit.form_subscriber_email).fill(subscriber_email);
		await this.page.waitForTimeout(1000);
		await this.page.locator(selector.form_submit.subscribe).click();

		await this.page.waitForTimeout(5000);
		await expect(this.page.locator(selector.form_submit.success_popup)).toContainText("Success!");
		await this.page.locator(selector.form_submit.confirm).click();
	}

	async exclude_segment_tag_from_campaign(campaign_name: string, segment_name: string, tag_name: string) {
		await this.page.goto(data.wordpress_site_data.url, {
			waitUntil: "networkidle",
		});
		await this.page.goto(selector.campaign_selectors.campaign_page_url, {
			waitUntil: "networkidle",
		});

		await this.page.locator(selector.campaign_selectors.select_campaign(campaign_name)).click();
		await this.page.locator(selector.campaign_selectors.campaign_settings).click();
		await this.page.waitForLoadState("networkidle");

		await this.page.locator(selector.campaign_selectors.campaign_recipients).click();

		// Exclude Tag
		await this.page.locator(selector.campaign_selectors.exclude_tag_select).click();
		await this.page.locator(selector.campaign_selectors.exclude_tag_placeholder).click();
		await this.page.waitForTimeout(2000);
		await this.page.locator(selector.campaign_selectors.exclude_tag_input).fill(tag_name);
		await this.page.keyboard.press("Enter");

		await this.page.waitForTimeout(2000);

		// Exclude Segment
		await this.page.locator(selector.campaign_selectors.exclude_segment_select).click();
		await this.page.locator(selector.campaign_selectors.exclude_segment_placeholder).click();
		await this.page.waitForTimeout(2000);
		await this.page.locator(selector.campaign_selectors.exclude_segment_input).fill(segment_name);
		await this.page.keyboard.press("Enter");

		await this.page.locator(selector.campaign_selectors.campaign_draft_save).click();
		expect(await this.page.locator(selector.campaign_selectors.campaign_update_toast).innerText()).toEqual("Campaign has updated!");
	}
}
