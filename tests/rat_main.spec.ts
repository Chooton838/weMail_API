import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import config from "../playwright.config";

import { data } from "../utils/data";
import { Rat_LoginPage } from "../pages/rat_login";
import { Rat_ListsPage } from "../pages/rat_lists";
import { Rat_SubscribersPage } from "../pages/rat_subscribers";
import { Rat_IntegrationsPage } from "../pages/rat_intergrations";

//Faker Data
const listName = faker.lorem.words(2);

/* ------------------------ Rat-Login ------------------------ */
test("Test-1: Login", async ({ request }) => {
  const username = config.use?.httpCredentials?.username!;
  const password = config.use?.httpCredentials?.password!;

  const login = new Rat_LoginPage(request);
  await login.login(username, password);
});

test("Test-2: List create", async ({ request }) => {
  const list = new Rat_ListsPage(request);

  const list_created_id = await list.list_create(`${listName}`);
  data.form_data.list_id = list_created_id;
});

test("Test-3: Validate List created", async ({ request }) => {
  const list = new Rat_ListsPage(request);

  await list.validate_list(data.form_data.list_id);
});

// test("Test-4: Edit & Update List created", async ({ request }) => {
//   const list = new Rat_ListsPage(request);

//   const list_updated_id = await list.list_update(data.form_data.list_id);
//   data.updated_form_data.list_id = list_updated_id;
// });

// test("Test-5: Delete List", async ({ request }) => {
//   const list = new Rat_ListsPage(request);

//   await list.list_delete(data.updated_form_data.list_id);
// });

//Create Subscriber
test("Test-6: Create Subscriber", async ({ request }) => {
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

test("Test-7: Validate Subscriber added in List", async ({ request }) => {
  const subscribers = new Rat_SubscribersPage(request);

  const subs_id = await subscribers.validate_subscriber(
    data.form_data.list_id,
    data.subscriber_data.subs_id
  );
});

test("Test-8: Update Subscriber in List", async ({ request }) => {
  const subscribers = new Rat_SubscribersPage(request);

  const updated_subs_id = await subscribers.update_subscriber(
    data.subscriber_data.subs_phone,
    data.subscriber_data.subs_id
  );

  data.subscriber_data.updated_subs_id = updated_subs_id;
});

test("Test-9: Delete Subscriber from List", async ({ request }) => {
  const subscribers = new Rat_SubscribersPage(request);

  await subscribers.delete_subscriber(data.subscriber_data.updated_subs_id);
});

/**
 *
 * Integrations - Contact Forms
 *
 */

test("Test-10: Setup - 'Contact Form 7'...", async ({ request }) => {
  //Create New List
  const list = new Rat_ListsPage(request);
  const integrations = new Rat_IntegrationsPage(request);

  const list_created_id = await list.list_create(`[Rat-QA] Contact-Form-7 [001]`);
  data.form_data.list_id = list_created_id;
  //Setup - 'Contact Form 7'...

});
