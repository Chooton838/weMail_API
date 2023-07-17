import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { CampaignPage } from "../pages/campaign";
import { AdminPage } from "../pages/form_on_wp_site";
import { FormPage } from "../pages/forms";
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
let campaign_id: string = "";
let campaign_sending_gateway: string = "smtp";

/* ------------------------ Login ------------------------ */
test.skip("Login", async ({ request }) => {
  const login_data: Array<string> = [
    config.use?.httpCredentials?.username!,
    config.use?.httpCredentials?.password!,
  ];

  const login = new LoginPage(request);
  await login.login(login_data);
});

/* ------------------------ CRUD Functionalities of List ------------------------ */
test.skip("List Create", async ({ request }) => {
  const list = new ListPage(request);
  list_id = await list.list_create(list_name);
  data.campaign_data.lists.push(list_id);
  data.form_data.list_id = list_id;
});

test.skip("Lists of List", async ({ request }) => {
  const list = new ListPage(request);
  await list.lists_of_list(list_id);
});

test.skip("List Update", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_update(list_id, list_name);
});

test.skip("List Details", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_details(list_id);
});

/* ------------------------ CRUD Functionalities of Subscribers ------------------------ */
test.skip("Subscriber Create", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  subscribers_id.push(
    await subscriber.subscriber_create(subscriber_email.toLowerCase(), list_id)
  );
});

test.skip("Subscribers List", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscribers_list(list_id, subscriber_email);
});

test.skip("Subscriber Update", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_update(
    data.subscriber_updated_data,
    subscribers_id[0]
  );
});

/* ------------------------ CRUD Functionalities of Forms ------------------------ */
test.skip("Inline Form Create", async ({ request }) => {
  const form = new FormPage(request);
  data.form_data.name = `${faker.lorem.words(1)} - Automated Created Form`;
  data.form_data.type = "inline";
  forms_id.push(await form.form_create(data.form_data));
});

test.skip("Modal Form Create", async ({ request }) => {
  const form = new FormPage(request);
  data.form_data.name = `${faker.lorem.words(1)} - Automated Created Form`;
  data.form_data.type = "modal";
  forms_id.push(await form.form_create(data.form_data));
});

test.skip("Forms Update", async ({ request }) => {
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

test.skip("Form Sync with Frontend", async ({ request }) => {
  const form = new FormPage(request);
  await form.form_sync(forms_id[0]);
});

test("Forms Sync. with WP Site", async ({}) => {
  const admin = new AdminPage();
  await admin.form_sync_with_frontend();
});

test.skip("Forms Added into Site Frontend", async ({}) => {
  const admin = new AdminPage();
  form_page_url = await admin.form_publish(forms_id[0]);
});

test.skip("Form Submission from Frontend", async ({}) => {
  const admin = new AdminPage();
  await admin.form_submit(form_page_url, form_subscriber_email.toLowerCase());
});

test.skip("Subscriber's info - Signed up through Form", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  subscribers_id.push(
    await subscriber.subscribers_list(list_id, form_subscriber_email)
  );
});

test.skip("Sending Gateway Connect", async ({ request }) => {
  const sending_gateways = new GatewayPage(request);
  await sending_gateways.connect_gateway(
    campaign_sending_gateway,
    data.smtp_data
  );
});

test.skip("Set Default Sender", async ({ request }) => {
  const sending_gateways = new GatewayPage(request);
  await sending_gateways.set_default_Form_Reply(
    campaign_sending_gateway,
    data.defauld_sender_data
  );
});

/* ------------------------ CRUD Functionalities of Campaign ------------------------ */
test.skip("Campaign Create", async ({ request }) => {
  const campaign = new CampaignPage(request);
  campaign_id = await campaign.create_campaign(data.campaign_data);
});

test.skip("Campaign Send", async ({ request }) => {
  const campaign = new CampaignPage(request);
  await campaign.send_campaign(campaign_id);
});

test.skip("Duplicate a Campaign & Send", async ({ request }) => {
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

test.skip("Form Delete", async ({ request }) => {
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

test.skip("Subscriber Delete", async ({ request }) => {
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
