import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import config from "../playwright.config";
import { data } from "../utils/data";
import { Rat_LoginPage } from "../pages/rat_login";
import { Rat_ListsPage } from "../pages/rat_lists";
import { Rat_SubscribersPage } from "../pages/rat_subscribers";
import { Rat_IntegrationsSetupPage } from "../pages/rat_intergrations_setup";
import { Rat_IntegrationsValidatePage } from "../pages/rat_integrations_validate";
import { BasePage } from "../utils/base_functions";

//Faker-data
//List-name
const list_name = faker.lorem.words(2);
//Contact-form-7-name
const contact_form_7_name = faker.lorem.words(2);
//Subscriber/Guest-name
let submitted_subscriber_name: string = "";

//Variables-declared
//Contact-form-7
let contact_form_7_page_url: string = "";
let header: string[] = [];

//Faker-data
let subscriber_firstName = faker.name.firstName(); // Generates a random first name like "John"
let subscriber_lastName = faker.name.lastName(); // Generates a random last name like "Doe"
let subscriber_name = `${subscriber_firstName}.${subscriber_lastName}`; //Concats the name like "John.Doe"
let subscriber_email = `${subscriber_name}@gmail.com`; //@gmail used to avoid blockades from weMail
let subscriber_subject = faker.lorem.word(2);
let subscriber_messagebody = faker.lorem.sentence();

// let formData: {
//   "your-name": string;
//   "your-email": string;
//   "your-subject": string;
//   "your-message": string;
// } = {
//   "your-name": faker.name.firstName(),
//   "your-email": "hgfd@gmail.com",
//   "your-subject": faker.lorem.word(4),
//   "your-message": faker.lorem.sentence()
// };
/**
 *
 *
 * *Main-test
 */
/**
 *
 * ?Basic-tests
 */
test.describe.skip("Basic Tests", () => {
  /* ------------------------ Rat-Login ------------------------ */
  test("Test-1: Login - api", async ({ request }) => {
    const username = config.use?.httpCredentials?.username!;
    const password = config.use?.httpCredentials?.password!;
    const login = new Rat_LoginPage(request);
    await login.login(username, password);
  });

  test("Test-2: List create - api", async ({ request }) => {
    const list = new Rat_ListsPage(request);
    const list_created_id = await list.list_create(`[Rat-QA] ${list_name}`);
    data.form_data.list_id = list_created_id;
  });

  test("Test-3: Validate List created - api", async ({ request }) => {
    const list = new Rat_ListsPage(request);
    await list.validate_list(data.form_data.list_id);
  });

  test("Test-4: Edit & Update List created - api", async ({ request }) => {
    const list = new Rat_ListsPage(request);
    const list_updated_id = await list.list_update(data.form_data.list_id);
    data.updated_form_data.list_id = list_updated_id;
  });

  test("Test-5: Delete List - api", async ({ request }) => {
    const list = new Rat_ListsPage(request);
    await list.list_delete(data.updated_form_data.list_id);
  });

  //Create Subscriber
  test("Test-6: Create Subscriber - api", async ({ request }) => {
    const subscribers = new Rat_SubscribersPage(request);
    //Add Subscriber to new List
    const subs_id = await subscribers.add_subscriber(
      data.form_data.list_id,
      data.subscriber_data.subs_email,
      data.subscriber_data.subs_first_name,
      data.subscriber_data.subs_last_name
    );
    data.subscriber_data.subs_id = subs_id;
    console.log(data.subscriber_data.subs_id);
  });

  test("Test-7: Validate Subscriber added in List - api", async ({ request }) => {
    const subscribers = new Rat_SubscribersPage(request);
    const subs_id = await subscribers.validate_subscriber(
      data.form_data.list_id,
      data.subscriber_data.subs_id
    );
  });

  test("Test-8: Update Subscriber in List - api", async ({ request }) => {
    const subscribers = new Rat_SubscribersPage(request);
    const updated_subs_id = await subscribers.update_subscriber(
      data.subscriber_data.subs_phone,
      data.subscriber_data.subs_id
    );
    data.subscriber_data.updated_subs_id = updated_subs_id;
  });

  test("Test-9: Delete Subscriber from List - api", async ({ request }) => {
    const subscribers = new Rat_SubscribersPage(request);
    await subscribers.delete_subscriber(data.subscriber_data.updated_subs_id);
  });
});

/**
 *
 * ?Contact-Form-7
 */
test.describe("Integration: Contact-form-7", () => {
  /**
   *
   * @param Integrations: @Contact_forms_7
   *
   */
  test("Test-11: Login - api", async ({ request }) => {
    const username = config.use?.httpCredentials?.username!;
    const password = config.use?.httpCredentials?.password!;
    const login = new Rat_LoginPage(request);
    await login.login(username, password);
  });

  test("Test-12: List create - api", async ({ request }) => {
    const list = new Rat_ListsPage(request);
    const list_created_id = await list.list_create(`[Rat-QA] ${list_name}`);
    data.form_data.list_id = list_created_id;
    console.log(list_created_id);
  });

  test("Test-13: Remove All - Contact-form-7 Forms - e2e", async ({ request }) => {
    const integrationsSetup = new Rat_IntegrationsSetupPage(request);
    await integrationsSetup.remove_all_contact_form_7_forms();
  });

  test.only("Test-14: Create new form - Contact-form-7 - e2e", async ({ request }) => {
    const integrationsSetup = new Rat_IntegrationsSetupPage(request);

    //Create Form: Contact-form-7
    const contact_form_7_id = await integrationsSetup.create_contact_forms_7(contact_form_7_name);
    data.integrations.contact_form_7.form_id = contact_form_7_id;
  });

  test("Test-15: Map - Contact Form 7 - api", async ({ request }) => {
    const integrationsSetup = new Rat_IntegrationsSetupPage(request);
    //Map: Contact-form-7
    header = await integrationsSetup.map_contact_form_7_api(
      data.form_data.list_id,
      data.integrations.contact_form_7.form_id
    );
  });

  // test("Test-15.0: Map - Contact Form 7 - e2e", async ({ request }) => {
  //   const integrationsSetup = new Rat_IntegrationsSetupPage(request);
  //   //Map: Contact-form-7
  //   await integrationsSetup.map_contact_form_7_e2e();
  // });

  test.skip("Test-16: Create new Page - Contact-form-7 - e2e", async ({ request }) => {
    const integrationsSetup = new Rat_IntegrationsSetupPage(request);

    //Create Form: Contact-form-7
    contact_form_7_page_url = await integrationsSetup.publish_form(
      data.integrations.contact_form_7.form_name,
      data.integrations.contact_form_7.form_id
    );
    console.log(`Page url is: ${contact_form_7_page_url}`);
  });

  // test.skip("Test-16: Submit form - Contact-form-7: Guest/Subscriber ---> e2e", async ({ request }) => {
  //   const integrationsValidate = new Rat_IntegrationsValidatePage(request);

  //   submitted_subscriber_name = await integrationsValidate.submit_contact_forms_7(formData);
  //   data.integrations.contact_form_7.form_user_email = submitted_subscriber_name;
  // });

  test("Test-17: Submit form - Contact-form-7: Guest/Subscriber ---> api", async ({ request }) => {
    const integrationsValidate = new Rat_IntegrationsValidatePage(request);

    let api_endpoint = `${data.rest_url}contact-form-7/v1/contact-forms/${data.integrations.contact_form_7.form_id}/feedback`;
    // let api_endpoint = `${data.rest_url}contact-form-7/v1/contact-forms/799468/feedback`;

    await integrationsValidate.form_submit(api_endpoint, subscriber_email, subscriber_name);

    data.integrations.contact_form_7.form_user_email = submitted_subscriber_name;
  });

  test.skip("Test-18: Validate subscriber added-to-list - api", async ({ request }) => {
    const integrationsValidate = new Rat_IntegrationsValidatePage(request);
    await integrationsValidate.validate_subscriber_to_list(
      data.form_data.list_id,
      formData["your-email"]
    );
  });

  test.skip("Test-20: Delete List - api", async ({ request }) => {
    const list = new Rat_ListsPage(request);
    await list.list_delete(data.updated_form_data.list_id);
  });
});
