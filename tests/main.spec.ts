import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { CampaignPage } from "../pages/campaign";
import { ListPage } from "../pages/list";
import { LoginPage } from "../pages/login";
import { GatewayPage } from "../pages/sending_gateways";
import { SubscriberPage } from "../pages/subscriber";
import config from "../playwright.config";
import { data } from "../utils/data";

let list_id: string = "";
let list_name: string = faker.lorem.words(2);
let subscriber_id: string = "";
let campaign_id: string = "";

/* ------------------------ Login ------------------------ */
test.only("Login", async ({ request }) => {
  const login_data: Array<string> = [
    config.use?.httpCredentials?.username!,
    config.use?.httpCredentials?.password!,
  ];

  const login = new LoginPage(request);
  await login.login(login_data);
});

/* ------------------------ CRUD Functionalities of List ------------------------ */
test.only("List Create", async ({ request }) => {
  const list = new ListPage(request);
  list_id = await list.list_create(list_name);
});

test.only("Lists of List", async ({ request }) => {
  const list = new ListPage(request);
  await list.lists_of_list(list_id);
});

test.only("List Update", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_update(list_id, list_name);
});

test.only("List Details", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_details(list_id);
});

test.skip("List Delete", async ({ request }) => {
  let lists: Array<string> = [];
  lists.push(list_id);

  // For multiple list delete, push list_id on lists array
  // lists.push("3992afb1-68ba-4ba7-a3c2-ae5dedffb21a");

  const list = new ListPage(request);
  await list.list_delete(lists);
});

/* ------------------------ CRUD Functionalities of Subscribers ------------------------ */
test.only("Subscriber Create", async ({ request }) => {
  let subscriber_email: string = faker.internet.email();
  const subscriber = new SubscriberPage(request);
  subscriber_id = await subscriber.subscriber_create(
    subscriber_email.toLowerCase(),
    list_id
  );
});

test.only("Subscriber Update", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_update(
    data.subscriber_updated_data,
    subscriber_id
  );
});

test.only("Subscriber Delete", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_delete(subscriber_id);
});

test.only("Sending Gateway Connect", async ({ request }) => {
  let gateway: string = "smtp";
  const sending_gateways = new GatewayPage(request);
  await sending_gateways.connect_gateway(gateway, data.smtp_data);
});

test.only("Set Default Sender", async ({ request }) => {
  let gateway: string = "smtp";
  const sending_gateways = new GatewayPage(request);
  await sending_gateways.set_default_Form_Reply(
    gateway,
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
