import { APIRequestContext, expect, firefox } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";
import { faker } from "@faker-js/faker";

//Faker-data
let subscriber_name = faker.name.fullName();
let subscriber_email = `${subscriber_name}@gmail.com`;
let subscriber_subject = faker.lorem.word(2);
let subscriber_messagebody = faker.lorem.sentence();

export class Rat_IntegrationsValidatePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Create-contact-form-7
  async submit_contact_forms_7() {
    const browser = await firefox.launch();

    const context = await browser.newContext();
    const page = await context.newPage();

    const stagingWpSiteUrl: string = `${data.wordpress_site_data[0]}`;
    const modifiedUrl: string = stagingWpSiteUrl.replace("/wp-admin", "");
    console.log(`URL before: ${modifiedUrl}`);

    //Go-to-contact-form-7
    await page.goto(`${modifiedUrl}/rat-qa-contact-form-7/`);
    await page.waitForLoadState("networkidle");
    console.log(`URL after: ${modifiedUrl}/rat-qa-contact-form-7/`);


    //Submit-form-subscriber/guest
    await page.fill('//input[@name="your-name"]', subscriber_name);
    await page.fill('//input[@name="your-email"]', subscriber_email);
    await page.fill('//input[@name="your-subject"]', subscriber_subject);
    await page.fill('//textarea[@name="your-message"]', subscriber_messagebody);
    await page.click('//input[@value="Submit"]');

    const success_message = await page.innerText('//div[@class="wpcf7-response-output"]')
    console.log(success_message);
    expect(success_message).toBeTruthy();

    return subscriber_email;

  }

  async validate_subscriber_to_list(list_id: string, subscriber_email: string){
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
