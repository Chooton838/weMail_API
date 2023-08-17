import { APIRequestContext, expect, firefox } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";
import { faker } from "@faker-js/faker";
const FormData = require('form-data');


export class Rat_IntegrationsValidatePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Submit-contact-form-7: e2e
  // async submit_contact_forms_7(formData: string) {
  //   const browser = await firefox.launch();

  //   const context = await browser.newContext();
  //   const page = await context.newPage();

  //   const stagingWpSiteUrl: string = `${data.wordpress_site_data[0]}`;
  //   const modifiedUrl: string = stagingWpSiteUrl.replace("/wp-admin", "");
  //   console.log(`URL before: ${modifiedUrl}`);

  //   //Go-to-contact-form-7
  //   await page.goto(`${modifiedUrl}/rat-qa-contact-form-7/`);
  //   console.log(`URL after: ${modifiedUrl}/rat-qa-contact-form-7/`);
  //   await page.waitForLoadState("domcontentloaded");

  //   //Submit-form-subscriber/guest
  //   await page.fill('//input[@name="your-name"]', subscriber_name);
  //   await page.fill('//input[@name="your-email"]', subscriber_email);
  //   await page.fill('//input[@name="your-subject"]', subscriber_subject);
  //   await page.fill('//textarea[@name="your-message"]', subscriber_messagebody);
  //   await page.click('//input[@value="Submit"]');

  //   await page.waitForLoadState("domcontentloaded");

  //   await page.waitForSelector('//div[@class="wpcf7-response-output"]');
  //   const receivedObject = await page.locator(
  //     '//form[@aria-label="Contact form"]//div[@class="wpcf7-response-output"]'
  //   );
  //   const receivedText = await receivedObject.textContent();
  //   expect(receivedText).toContain("Thank you for your message. It has been sent.");

  //   return subscriber_email;
  // }

  //Submit-contact-form-7: api
  async form_submit(
    api_endpoint: string,
    form_data: string | {},
    header: string[],
    response_message: string
  ) {
    let content_type: string = "multipart/form-data";
    if (typeof form_data == "string") {
      content_type = "application/x-www-form-urlencoded; charset=UTF-8";
    }

  const browser = await firefox.launch();
  const page = await browser.newPage();

  const formData = new FormData();
  formData.append('your-name', 'erfds');
  formData.append('your-email', 'hgfd@gmail.com');
  formData.append('your-subject', 'erds rfeds frwd');
  formData.append('your-message', 'red edgt reftgrfd');

    const form_submit = await this.request.post("https://eddtest.appsero.com/wp-json/contact-form-7/v1/contact-forms/796785/feedback", {
      headers: {
        "X-WP-Nonce": header[0],
        Cookie: header[1],
        "Content-Type": content_type,
      },
      data: formData,
    });

    let form_submit_response: { message: string };

    const base = new BasePage(this.request);
    form_submit_response = await base.response_checker(form_submit);

    try {
      expect(form_submit_response.message).toEqual(response_message);
    } catch (err) {
      console.log(form_submit_response);
      expect(form_submit.ok()).toBeFalsy();
    }
  }
  
  //Validate Subscriber-to-list
  async validate_subscriber_to_list(list_id: string, subscriber_email: string) {
    const base = new BasePage(this.request);
    //WP-site-login
    let page = await base.wordpress_site_login();

    //Validate-Subscriber-to-list
    const getLists_Request = await this.request.get(`${config.use?.baseURL}/v1/lists/${list_id}`);

    let getListsAll_Response: {
      data: Array<{ email: string }>;
    } = {
      data: [{ email: "" }],
    };

    try {
      expect(getLists_Request.ok()).toBeTruthy();
      getListsAll_Response = await getLists_Request.json();
    } catch (err) {
      console.log(`Status is: ${getLists_Request.status()}`);
      console.log(`Status Text is: ${getLists_Request.statusText()}`);
      console.log(`The ID of Item[0] is: ${getListsAll_Response.data[0].email}`);
    }

    try {
      expect(getListsAll_Response.data[0].email).toEqual(subscriber_email);
    } catch (err) {
      console.log(`The response received was: ${JSON.stringify(getListsAll_Response)}`);
      expect(getLists_Request.ok()).toBeFalsy();
    }
  }
}
