import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import config from "../playwright.config";

import { data } from "../utils/data";
import { Rat_LoginPage } from "../pages/rat_login";
import { Rat_ListsPage } from "../pages/rat_lists";

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

  const list_created_id = await list.list_create(`Rat-qa: ${listName}`);
  data.form_data.list_id = list_created_id;
});

test("Test-3: Validate List created", async ({ request }) => {
  const list = new Rat_ListsPage(request);

  await list.validate_list(data.form_data.list_id);
});

//TODO: Complete Scripts below
