import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { ListPage } from "../pages/list";
import { LoginPage } from "../pages/login";
import { SubscriberPage } from "../pages/subscriber";

let list_id: string = "";
let subscriber_id: string = "";

/* ------------------------ Login ------------------------ */
test("Login", async ({ request }) => {
  const login = new LoginPage(request);
  await login.login(process.env.USERNAME, process.env.PASSWORD);
});

/* ------------------------ CRUD Functionalities of List ------------------------ */
test("List Create", async ({ request }) => {
  let list_name: string = faker.lorem.words(2);
  const list = new ListPage(request);

  list_id = await list.list_create(list_name);
});

test("lists of List", async ({ request }) => {
  const list = new ListPage(request);
  await list.lists_of_list(list_id);
});

test("List Update", async ({ request }) => {
  const list = new ListPage(request);
  await list.list_update(list_id, "Updated List", "");
});

test("List Details", async ({ request }) => {
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
test("Subscriber Create", async ({ request }) => {
  let subscriber_email: string = faker.internet.email();
  const subscriber = new SubscriberPage(request);
  subscriber_id = await subscriber.subscriber_create(
    subscriber_email.toLowerCase(),
    list_id
  );
});

test.skip("Subscriber Update", async ({ request }) => {
  let subscriber_email: string = faker.internet.email();
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_create(subscriber_email.toLowerCase(), list_id);
});

test.skip("Subscriber Delete", async ({ request }) => {
  const subscriber = new SubscriberPage(request);
  await subscriber.subscriber_delete(subscriber_id);
});
