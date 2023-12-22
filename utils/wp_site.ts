import { Page } from "@playwright/test";
import * as fs from "fs";

export class WPSitePage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * This below wordpress_nonce_cookie(page_url: string, locator: string, popup: boolean, popup_locator: string) function can be usable
	 * to get wp-nonce value, login cookie and WooCommerce API Key for WordPress site.
	 * Parameters:
	 *  page_url: string = Provide the webpage url containing the wp-nonce
	 *  locator: string = Provide the script id locator that contains the wp-nonce value
	 *  popup: string = If wp-nonce exists on a pop-up of the given page, value is true else false
	 *  popup_locator: string = Provide the locator for the pop-up to click and extract the wp-nonce value
	 */
	async wordpress_nonce_cookie(page_url: string, locator: string, popup: boolean, popup_locator: string) {
		let header: { nonce: string; cookie: string; api_key: string } = {
			nonce: "",
			cookie: "",
			api_key: "",
		};

		// Get Cookie value

		let cookie_data = fs.readFileSync("state.json", "utf8");
		let parsed_data = JSON.parse(cookie_data);
		let cookie: string = "";
		let flag: boolean = false;

		for (let i: number = 0; i < parsed_data.cookies.length; i++) {
			if (parsed_data.cookies[i].name.includes("wordpress_logged_in")) {
				cookie = `${parsed_data.cookies[i].name}=${parsed_data.cookies[i].value}`;
				flag = true;
				break;
			}
		}

		if (flag == true) {
			header.cookie = cookie;
		} else {
			console.log("Cookie Not Found");
		}

		// Get Nonce & API Key

		await this.page.goto(page_url, { waitUntil: "networkidle" });

		if (popup == true) {
			let nonce_value: string | null;
			await this.page.locator(popup_locator).click();
			nonce_value = await this.page.locator(locator).getAttribute("value");
			if (typeof nonce_value == "string") {
				header.nonce = nonce_value;
			}
		} else {
			let object_text = await this.page.locator(locator).innerText();
			let object_value = object_text.substring(object_text.indexOf("{"), object_text.lastIndexOf("}") + 1);

			let parsed_value: Record<string, any> = {};

			try {
				parsed_value = JSON.parse(object_value);
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}

			if (parsed_value.hasOwnProperty("nonce")) {
				header.nonce = parsed_value.nonce;
			}
			if (parsed_value.hasOwnProperty("api")) {
				header.api_key = parsed_value.api.api_key;
			}
		}

		return header;
	}
}
