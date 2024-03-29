import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { AutomationPage } from "../pages/automation";
import { CampaignPage } from "../pages/campaign";
import { AdminPage } from "../pages/form_on_wp_site";
import { FormPage } from "../pages/forms";
import { IntegrationsPage } from "../pages/integrations";
import { ListPage } from "../pages/list";
import { LoginPage } from "../pages/login";
import { GatewayPage } from "../pages/sending_gateways";
import { SubscriberPage } from "../pages/subscriber";
import config from "../playwright.config";
import { data } from "../utils/data";

let list_id: string = "";
let list_name: string = faker.lorem.words(2);
let subscribers_id: string[] = [];
let subscriber_email: string = faker.internet.email();
let form_subscriber_email: string = faker.internet.email();
let forms_id: string[] = [];
let form_page_url: string = "";
let automation_id: string = "";
let campaign_id: string = "";
let campaign_sending_gateway: string = "smtp";
let contact_form_id: string = "";

// /* ------------------------ Login ------------------------ */
test("Login", async ({ request }) => {
  const login_data: Array<string> = [
    config.use?.httpCredentials?.username!,
    config.use?.httpCredentials?.password!,
  ];

  const login = new LoginPage(request);
  await login.login(login_data);
});

// /* ------------------------ CRUD Functionalities of List ------------------------ */
test("List Create", async ({ request }) => {
  const list = new ListPage(request);
  list_id = await list.list_create(list_name);
  data.campaign_data.lists.push(list_id);
  data.form_data.list_id = list_id;
  data.affiliate_integration_data.list = await list.list_create(
    faker.lorem.words(2)
  );
});

test("Lists of List", async ({ request }) => {
  const list = new ListPage(request);
  await list.lists_of_list(list_id);
});

test("List Update", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_update(list_id, list_name);
});

test("List Details", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_details(list_id);
});

/* ------------------------ CRUD Functionalities of Subscribers ------------------------ */
test("Subscriber Create", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  subscribers_id.push(
    await subscriber.subscriber_create(subscriber_email.toLowerCase(), list_id)
  );
});

test("Subscribers List", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscribers_list(list_id, subscriber_email);
});

test("Subscriber Update", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_update(
    data.subscriber_updated_data,
    subscribers_id[0]
  );
});

test("Affiliate Integration", async ({ request }) => {
  const integration = new IntegrationsPage(request);
  await integration.integrate_affiliatewp();
});

test("Create Affiliate", async ({ request }) => {
  const integration = new IntegrationsPage(request);
  await integration.create_affiliate(subscriber_email);
});

test("Automation Create", async ({ request }) => {
  const automation = new AutomationPage(request);
  automation_id = await automation.welcome_automation_create(list_id);
});

test("Automation Activation", async ({ request }) => {
  const automation = new AutomationPage(request);
  await automation.automation_activation(automation_id);
});

// /* ------------------------ CRUD Functionalities of Forms ------------------------ */
test("Inline Form Create", async ({ request }) => {
  const form = new FormPage(request);
  data.form_data.name = `${faker.lorem.words(1)} - Automated Created Form`;
  data.form_data.type = "inline";
  forms_id.push(await form.form_create(data.form_data));
});

test("Modal Form Create", async ({ request }) => {
  const form = new FormPage(request);
  data.form_data.name = `${faker.lorem.words(1)} - Automated Created Form`;
  data.form_data.type = "modal";
  forms_id.push(await form.form_create(data.form_data));
});

test("Forms Update", async ({ request }) => {
  const form = new FormPage(request);
  if (forms_id.length >= 1) {
    for (let i: number = 0; i < forms_id.length; i++) {
      data.updated_form_data.name = `Updated form - ${forms_id[i]}`;
      data.updated_form_data.list_id = list_id;
      await form.form_update(forms_id[i], data.updated_form_data);
    }
  } else {
    console.log("Forms Not Found");
  }
});

test("Form Sync with Frontend", async ({ request }) => {
  const form = new FormPage(request);
  await form.form_sync(forms_id[0]);
});

test("Forms Sync. with WP Site", async ({ request }) => {
  const admin = new AdminPage();
  await admin.form_sync_with_frontend(request);
});

test("Forms Added into Site Frontend", async ({ request }) => {
  const admin = new AdminPage();
  form_page_url = await admin.form_publish(request, forms_id[0]);
});

test("Form Submission from Frontend", async ({}) => {
  const admin = new AdminPage();
  await admin.form_submit(form_page_url, form_subscriber_email.toLowerCase());
});

test("Subscriber's info - Signed up through Form", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  subscribers_id.push(
    await subscriber.subscribers_list(list_id, form_subscriber_email)
  );
});

test("Sending Gateway Connect", async ({ request }) => {
  const sending_gateways = new GatewayPage(request);
  await sending_gateways.connect_gateway(
    campaign_sending_gateway,
    data.smtp_data
  );
});

test("Set Default Sender", async ({ request }) => {
  const sending_gateways = new GatewayPage(request);
  await sending_gateways.set_default_Form_Reply(
    campaign_sending_gateway,
    data.defauld_sender_data
  );
});

/* ------------------------ CRUD Functionalities of Campaign ------------------------ */
test("Campaign Create", async ({ request }) => {
  const campaign = new CampaignPage(request);
  campaign_id = await campaign.create_campaign(data.campaign_data);
});

test("Campaign Send", async ({ request }) => {
  const campaign = new CampaignPage(request);
  await campaign.send_campaign(campaign_id);
});

test("Duplicate a Campaign & Send", async ({ request }) => {
  const campaign = new CampaignPage(request);
  let duplicate_campaign_id: string = await campaign.duplicate_campaign(
    campaign_id
  );
  await campaign.send_campaign(duplicate_campaign_id);
});

test.skip("Campaign Delete", async ({ request }) => {
  const campaign = new CampaignPage(request);
  await campaign.delete_campaign(campaign_id);
});

test("Check Automation Activity", async ({ request }) => {
  const automatoin = new AutomationPage(request);
  await automatoin.automation_activity(automation_id, form_subscriber_email);
});

test("Automation Delete", async ({ request }) => {
  const automation = new AutomationPage(request);
  await automation.automation_delete(automation_id);
});

test("Form Delete", async ({ request }) => {
  await new Promise((r) => setTimeout(r, 10000));
  const form = new FormPage(request);
  if (forms_id.length >= 1) {
    for (let i: number = 1; i < forms_id.length; i++) {
      await form.form_delete(forms_id[i]);
    }
  } else {
    console.log("Forms Not Found");
  }
});

test("Subscriber Delete", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_delete(subscribers_id);
});

test.skip("List Delete", async ({ request }) => {
  let lists: Array<string> = [];
  lists.push(list_id);

  // For multiple list delete, push list_id on lists array
  // lists.push("3992afb1-68ba-4ba7-a3c2-ae5dedffb21a");

  const list = new ListPage(request);
  await list.list_delete(lists);
});

test.only("Create Contact Form 7", async ({ request }) => {
  const contact_form_7 = new IntegrationsPage(request);
  contact_form_id = await contact_form_7.create_contact_form_7();
});

test.only("Contact Form 7 Integration", async ({ request }) => {
  const contact_form_7 = new IntegrationsPage(request);
  await contact_form_7.contact_form_7(contact_form_id, list_id);
});
