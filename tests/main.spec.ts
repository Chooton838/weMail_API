import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { AutomationPage } from "../pages/automation";
import { CampaignPage } from "../pages/campaign";
import { AdminPage } from "../pages/form_on_wp_site";
import { FormPage } from "../pages/forms";
import { IntegrationsPage } from "../pages/integrations";
import { ListPage } from "../pages/list";
import { LoginPage } from "../pages/login";
import { GatewayPage } from "../pages/sending_gateways";
import { SubscriberPage } from "../pages/subscriber";
import { SuppressionPage } from "../pages/suppression";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

// /* ------------------------ Login ------------------------ */
test.beforeAll(async ({ request }) => {
  const login_data: Array<string> = [
    config.use?.httpCredentials?.username!,
    config.use?.httpCredentials?.password!,
  ];

  const login = new LoginPage(request);
  await login.login(login_data);

  const base = new BasePage(request);
  await base.wordpress_site_login();
});

// /* ------------------------ Functionalities of List (Tag, Segment, Custom Field) & Subscriber ------------------------ */
test.describe("Functionalities of List (Tag, Segment, Custom Field) & Subscriber", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let subscriber_email: string = faker.internet.email();
  let tag_id: string = "";
  let tag_name: string = faker.lorem.words(1);
  let segment_id: string = "";
  let segment_name: string = faker.lorem.words(1);
  let list_custom_fields_data: {
    title: string;
    slug: string;
    type: string;
    meta: { options: Array<string> };
  } = {
    title: faker.lorem.words(1),
    slug: "",
    type: "checkbox",
    meta: {
      options: [faker.lorem.words(1), faker.lorem.words(1)],
    },
  };
  list_custom_fields_data.slug = list_custom_fields_data.title.toLowerCase();

  test("List Create", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("Validate Created List", async ({ request }) => {
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

  test("Create Custom Field", async ({ request }) => {
    const list = new ListPage(request);
    await list.create_custom_field(list_id, list_custom_fields_data);
  });

  test("Update Custom Field", async ({ request }) => {
    let custom_field_options_new_value: string = "random";
    const list = new ListPage(request);
    await list.update_custom_field(
      list_id,
      list_custom_fields_data,
      custom_field_options_new_value
    );
  });

  test("Tag Create", async ({ request }) => {
    const list = new ListPage(request);
    tag_id = await list.tag_create(list_id, tag_name);
  });

  test("Tag Update", async ({ request }) => {
    let tag_update_data: {
      _method: string;
      id: string;
      site_id: string;
      name: string;
    } = {
      _method: "put",
      id: tag_id,
      site_id: config.use?.extraHTTPHeaders?.site!,
      name: `Updated_${tag_name}`,
    };

    const list = new ListPage(request);
    await list.tag_update(list_id, tag_id, tag_update_data);
  });

  test("Segment Create (Contains Created Tag)", async ({ request }) => {
    const list = new ListPage(request);
    segment_id = await list.segment_create_with_tag_assign(
      list_id,
      tag_id,
      segment_name
    );
  });

  test("Segment Update", async ({ request }) => {
    let updated_segment_name: string = `Updated_${segment_name}`;
    const list = new ListPage(request);
    await list.segment_update(list_id, segment_id, updated_segment_name);
  });

  test("Subscriber Create", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscriber_create(
      subscriber_email.toLowerCase(),
      list_id
    );
  });

  test("Validate Created Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscribers_list(list_id, subscriber_email)
    ).toEqual(subscriber_id);
  });

  test("Subscriber Update", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_update(
      data.subscriber_updated_data,
      subscriber_id
    );
  });

  test("Check Custom Field on Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      (await subscriber.subscriber_custom_field_details(list_id, subscriber_id))
        .fields_count
    ).toEqual(0);
  });

  test("Add Custom Field Value on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    await list.assign_custom_field(
      list_id,
      subscriber_id,
      list_custom_fields_data.slug,
      list_custom_fields_data.meta.options
    );
  });

  test("Verify Custom Field on Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      (await subscriber.subscriber_custom_field_details(list_id, subscriber_id))
        .options_count
    ).toEqual(3);
  });

  test("Remove Custom Field Value on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    await list.unassign_custom_field(
      list_id,
      subscriber_id,
      list_custom_fields_data.slug
    );
  });

  test("Re-Check Custom Field on Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      (await subscriber.subscriber_custom_field_details(list_id, subscriber_id))
        .options_count
    ).toEqual(0);
  });

  test("Delete Custom Field", async ({ request }) => {
    const list = new ListPage(request);
    await list.delete_custom_field(list_id, list_custom_fields_data.slug);
  });

  test("Check Tag on Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_tag_details(list_id, subscriber_id)
    ).toEqual(0);
  });

  test("Check Segment on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    expect(
      await list.filter_segmented_subscribers(
        list_id,
        segment_id,
        subscriber_id
      )
    ).toEqual(0);
  });

  test("Assign Tag on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    await list.tag_assign(list_id, tag_id, subscriber_id);
  });

  test("Verify Tag on Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_tag_details(list_id, subscriber_id)
    ).toEqual(1);
  });

  test("Verify Segment on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    expect(
      await list.filter_segmented_subscribers(
        list_id,
        segment_id,
        subscriber_id
      )
    ).toEqual(1);
  });

  test("Un-assign Tag on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    await list.tag_assign(list_id, "", subscriber_id);
  });

  test("Re-Check Tag on Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_tag_details(list_id, subscriber_id)
    ).toEqual(0);
  });

  test("Re-Check Segment on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    expect(
      await list.filter_segmented_subscribers(
        list_id,
        segment_id,
        subscriber_id
      )
    ).toEqual(0);
  });

  test("Tag Delete", async ({ request }) => {
    const list = new ListPage(request);
    await list.tag_delete(list_id, tag_id);
  });

  test("Segment Delete", async ({ request }) => {
    const list = new ListPage(request);
    await list.segment_delete(segment_id);
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("List Delete", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    // For multiple list delete, push list_id on lists array
    // lists.push("3992afb1-68ba-4ba7-a3c2-ae5dedffb21a");

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of Forms ------------------------ */
test.describe("Forms Functionalities", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let form_subscriber_email: string = faker.internet.email();
  let forms_id: string[] = [];
  let form_page_url: string | null;
  let header: { nonce: string; cookie: string; api_key: string } = {
    nonce: "",
    cookie: "",
    api_key: "",
  };
  let flag: boolean = true;

  test("Forms - List Create", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
    data.form_data.list_id = list_id;
  });

  test("Inline Form Create", async ({ request }) => {
    const form = new FormPage(request);

    data.form_data.name = `${faker.lorem.words(1)} - Automated Created Form`;
    data.form_data.type = "inline";

    let reponse = await form.form_create(data.form_data);

    forms_id.push(reponse.form_id);
    header = reponse.header;

    if (header.nonce == "" || header.cookie == "") {
      flag = false;
      console.log("Header Not Found");
    }
  });

  test("Modal Form Create", async ({ request }) => {
    const form = new FormPage(request);
    data.form_data.name = `${faker.lorem.words(1)} - Automated Created Form`;
    data.form_data.type = "modal";
    forms_id.push((await form.form_create(data.form_data)).form_id);
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
      console.log("Created Forms Not Found");
      test.fail();
    }
  });

  test("Form Sync with APP", async ({ request }) => {
    const form = new FormPage(request);
    if (forms_id.length >= 1) {
      for (let i: number = 0; i < forms_id.length; i++) {
        await form.form_sync(forms_id[i]);
      }
    } else {
      console.log("Created Forms Not Found");
      test.fail();
    }
  });

  // For test Form Submission from Frontend - remove .skip from next three test ( * - e2e) and put .skip on 4th & 5th test ( * - API)

  test.skip("Forms Sync. with WP Site - e2e", async ({ request }) => {
    const admin = new AdminPage();
    await admin.form_sync_with_frontend(request);
  });

  test.skip("Forms Added into Site Frontend - e2e", async ({ request }) => {
    const admin = new AdminPage();
    form_page_url = await admin.form_publish(request, forms_id[0]);
  });

  test.skip("Form Submission from Frontend - e2e", async ({}) => {
    if (form_page_url == null) {
      console.log("Page Url Not Found");
      test.fail();
    } else {
      const admin = new AdminPage();
      await admin.form_submit(
        form_page_url,
        form_subscriber_email.toLowerCase()
      );
    }
  });

  test("Forms Sync. with WP Site - API", async ({ request }) => {
    const forms = new FormPage(request);
    await forms.form_sync_with_frontend();
  });

  test("From Submission - API", async ({ request }) => {
    if (flag == true) {
      let api_endpoint: string = `${data.rest_url}/wemail/v1/forms/${forms_id[0]}`;
      let response_message: string =
        "Your subscription has been confirmed. You've been added to our list & will hear from us soon.";

      let form_data = new URLSearchParams();
      // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
      form_data.append("0[name]", "wemail_form_field_3");
      form_data.append("0[value]", "test user");
      form_data.append("1[name]", "wemail_form_field_4");
      form_data.append("1[value]", form_subscriber_email.toLowerCase());

      const form = new FormPage(request);
      await form.form_submit(
        api_endpoint,
        form_data.toString(),
        header,
        response_message
      );
    } else {
      console.log("Test Aborted as Header Not Found");
      test.fail();
    }
  });

  test("Subscriber's info - Signed up through Form", async ({ request }) => {
    // Used below commented code when Subscriber Signed-UP through e2e form submission

    // if (form_page_url == null) {
    //   console.log("Subscriber Can't Signed-UP");
    //   test.fail();
    // } else {
    //   const subscriber = new SubscriberPage(request);
    //   subscriber_id = await subscriber.subscribers_list(
    //   list_id,
    //   form_subscriber_email
    // );
    // }

    // Before use the above code, comment out the below portion

    if (flag == true) {
      const subscriber = new SubscriberPage(request);
      subscriber_id = await subscriber.subscribers_list(
        list_id,
        form_subscriber_email
      );
    } else {
      console.log("Test Aborted as Subsriber Can't Signed-UP");
      test.fail();
    }
  });

  test("Form Delete", async ({ request }) => {
    const form = new FormPage(request);
    if (forms_id.length >= 1) {
      for (let i: number = 0; i < forms_id.length; i++) {
        await form.form_delete(forms_id[i]);
      }
    } else {
      console.log("Forms Not Found");
      test.fail();
    }
  });

  test("Forms Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Forms Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

// /* ------------------------ Functionalities of Campaign ------------------------ */
test.describe("Campaign Functionalities", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscribers_id: string[] = [];
  let subscriber_email: string = faker.internet.email();
  let unsubscribed_subscriber_email: string = faker.internet.email();
  let campaign_id: string = "";
  let campaign_name: string = faker.lorem.words(2);
  data.campaign_data.name = campaign_name;
  let duplicate_campaign_id: string = "";
  let campaign_sending_gateway: string = "smtp";
  let campaign_activity_stats: {
    status: string;
    no_of_subscribers: number;
    email_id: string;
  } = { status: "", no_of_subscribers: 0, email_id: "" };
  let campaign_sent_flag: boolean = false;
  let unsubscribed_flag: boolean = false;

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

  test("List Create for Campaign", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
    data.campaign_data.lists.push(list_id);
  });

  test("Subscribers Create for Campaign", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    subscribers_id.push(
      await subscriber.subscriber_create(
        subscriber_email.toLowerCase(),
        list_id
      ),
      await subscriber.subscriber_create(
        unsubscribed_subscriber_email.toLowerCase(),
        list_id
      )
    );
  });

  test("Check Subscriber Status", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_status(
        list_id,
        unsubscribed_subscriber_email.toLowerCase(),
        subscribers_id[1]
      )
    ).toEqual("subscribed");
  });

  test("Campaign Create", async ({ request }) => {
    const campaign = new CampaignPage(request);
    campaign_id = await campaign.create_campaign(data.campaign_data);
  });

  test("Campaign Send", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.send_campaign(campaign_id);
  });

  test("Check Campaign Activity", async ({ request }) => {
    const campaign = new CampaignPage(request);

    while (campaign_activity_stats.status != "completed") {
      campaign_activity_stats = await campaign.campaign_activity(campaign_id);
      await new Promise((r) => setTimeout(r, 20000));
    }
  });

  test("Check Subscriber's Campaign Activity", async ({ request, page }) => {
    const campaign = new CampaignPage(request);
    if (
      (await campaign.subscriber_mail_activity(
        campaign_activity_stats.email_id,
        unsubscribed_subscriber_email.toLowerCase()
      )) == "sent"
    ) {
      campaign_sent_flag = true;
    }
  });

  test("Unsubscribe From Campaign", async ({ request }) => {
    if (campaign_sent_flag == true) {
      const campaign = new CampaignPage(request);
      unsubscribed_flag = await campaign.unsubscribe_campaign(
        campaign_id,
        subscribers_id[1],
        campaign_activity_stats.email_id
      );
    }
  });

  test("Re-Check Subscriber Status", async ({ request }) => {
    if (campaign_sent_flag == true && unsubscribed_flag == true) {
      const subscriber = new SubscriberPage(request);
      expect(
        await subscriber.subscriber_status(
          list_id,
          unsubscribed_subscriber_email.toLowerCase(),
          subscribers_id[1]
        )
      ).toEqual("unsubscribed");
    }
  });

  test("Duplicate a Campaign & Send", async ({ request }) => {
    const campaign = new CampaignPage(request);
    duplicate_campaign_id = await campaign.duplicate_campaign(campaign_id);
    await campaign.send_campaign(duplicate_campaign_id);
  });

  test("Check Duplicated Campaign's Activity", async ({ request }) => {
    let duplicate_campaign_activity_stats: {
      status: string;
      no_of_subscribers: number;
      email_id: string;
    } = { status: "", no_of_subscribers: 0, email_id: "" };

    const campaign = new CampaignPage(request);

    while (duplicate_campaign_activity_stats.status != "completed") {
      duplicate_campaign_activity_stats = await campaign.campaign_activity(
        duplicate_campaign_id
      );
      await new Promise((r) => setTimeout(r, 20000));
    }

    if (campaign_sent_flag == true && unsubscribed_flag == true) {
      expect(campaign_activity_stats.no_of_subscribers - 1).toEqual(
        duplicate_campaign_activity_stats.no_of_subscribers
      );
    }
  });

  test("Campaign Delete", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.delete_campaign(campaign_id);
    await campaign.delete_campaign(duplicate_campaign_id);
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscribers_id[0]);
    await subscriber.subscriber_delete(list_id, subscribers_id[1]);
  });

  test("Delete Campaign Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of Suppressions List ------------------------ */
test.describe("Suppression List Functionalities", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let subscriber_email: string = faker.internet.email();
  let campaign_id: string = "";
  let campaign_name: string = faker.lorem.words(2);
  data.campaign_data.name = campaign_name;
  let duplicate_campaign_id: string = "";
  let reduplicate_campaign_id: string = "";
  let campaign_sending_gateway: string = "smtp";
  let campaign_activity_stats: {
    status: string;
    no_of_subscribers: number;
    email_id: string;
  } = { status: "", no_of_subscribers: 0, email_id: "" };
  let duplicated_campaign_activity_stats: {
    status: string;
    no_of_subscribers: number;
    email_id: string;
  } = { status: "", no_of_subscribers: 0, email_id: "" };
  let reduplicated_campaign_activity_stats: {
    status: string;
    no_of_subscribers: number;
    email_id: string;
  } = { status: "", no_of_subscribers: 0, email_id: "" };
  let suppression_subscriber_id: string = "";

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

  test("List Create for Suppression List", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
    data.campaign_data.lists.push(list_id);
  });

  test("Subscribers Create for Suppression List", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscriber_create(
      subscriber_email.toLowerCase(),
      list_id
    );
  });

  test("Campaign Create for Suppression List", async ({ request }) => {
    const campaign = new CampaignPage(request);
    campaign_id = await campaign.create_campaign(data.campaign_data);
  });

  test("Campaign Send for Suppression List", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.send_campaign(campaign_id);
  });

  test("Check Campaign Activity & Subscriber Count", async ({ request }) => {
    const campaign = new CampaignPage(request);
    while (campaign_activity_stats.status != "completed") {
      campaign_activity_stats = await campaign.campaign_activity(campaign_id);
      await new Promise((r) => setTimeout(r, 20000));
    }

    expect(campaign_activity_stats.no_of_subscribers).toEqual(1);
  });

  test("Subscriber Added into Suppression List", async ({ request }) => {
    const suppression = new SuppressionPage(request);
    await suppression.create_suppression_subscriber(
      subscriber_email.toLowerCase()
    );
  });

  test("Duplicate a Campaign & Send", async ({ request }) => {
    const campaign = new CampaignPage(request);
    duplicate_campaign_id = await campaign.duplicate_campaign(campaign_id);
    await campaign.send_campaign(duplicate_campaign_id);
  });

  test("Check Duplicated Campaign's Subscribers Count", async ({ request }) => {
    const campaign = new CampaignPage(request);

    while (duplicated_campaign_activity_stats.status != "completed") {
      duplicated_campaign_activity_stats = await campaign.campaign_activity(
        duplicate_campaign_id
      );
      await new Promise((r) => setTimeout(r, 20000));
    }
    expect(duplicated_campaign_activity_stats.no_of_subscribers).toEqual(0);
  });

  test("Subscriber Search from Suppression List", async ({ request }) => {
    const suppression = new SuppressionPage(request);
    suppression_subscriber_id = await suppression.search_suppression_subscriber(
      subscriber_email.toLowerCase()
    );
  });

  test("Subscriber Deleted from Suppression List", async ({ request }) => {
    const suppression = new SuppressionPage(request);
    await suppression.delete_suppression_subscriber([
      suppression_subscriber_id,
    ]);
  });

  test("Re-Duplicate a Campaign & Send", async ({ request }) => {
    const campaign = new CampaignPage(request);
    reduplicate_campaign_id = await campaign.duplicate_campaign(campaign_id);
    await campaign.send_campaign(reduplicate_campaign_id);
  });

  test("Check Re-Duplicated Campaign's Subscribers Count", async ({
    request,
  }) => {
    const campaign = new CampaignPage(request);
    while (reduplicated_campaign_activity_stats.status != "completed") {
      reduplicated_campaign_activity_stats = await campaign.campaign_activity(
        reduplicate_campaign_id
      );
      await new Promise((r) => setTimeout(r, 20000));
    }
    expect(reduplicated_campaign_activity_stats.no_of_subscribers).toEqual(1);
  });

  test("Suppression Test Campaigns Delete", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.delete_campaign(campaign_id);
    await campaign.delete_campaign(duplicate_campaign_id);
    await campaign.delete_campaign(reduplicate_campaign_id);
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of Double-Opt-in List ------------------------ */
test.describe("Subscriber Verification for Double-Opt-in List", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let subscriber_email: string = faker.internet.email();
  let verification_url: string = "";

  test("Double-Opt-in List Create", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("Enable Double-Opt-in of the Create List", async ({ request }) => {
    const list = new ListPage(request);
    await list.enable_double_opt_in(list_id);
  });

  test("Subscribe on the Created List", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    verification_url = await subscriber.subscribe_double_opt_in_list(
      list_id,
      subscriber_email
    );

    let start = "/v1/subscribers/";
    let end = "/confirm-subscription";
    let startIndex = verification_url.indexOf(start) + start.length;
    let endIndex = verification_url.indexOf(end, startIndex);
    subscriber_id = verification_url.slice(startIndex, endIndex);
  });

  test("Check Subscriber Status", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_status(
        list_id,
        subscriber_email.toLowerCase(),
        subscriber_id
      )
    ).toEqual("unconfirmed");
  });

  test("Verify the Subscriber", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.verify_subscriber(verification_url);
  });

  test("Re-Check Subscriber Status", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_status(
        list_id,
        subscriber_email.toLowerCase(),
        subscriber_id
      )
    ).toEqual("subscribed");
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of Affiliate WP Integration ------------------------ */
test.describe("Functionalities of Affiliate WP Integration", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let affiliate_username: string = faker.lorem.words(1);
  let affiliate_user_email: string = faker.internet.email();

  test("List Create for Affiliate WP Integration", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("Affiliate Integration", async ({ request }) => {
    const integration = new IntegrationsPage(request);
    await integration.integrate_affiliatewp(list_id);
  });

  test("Create WP User - e2e", async ({ request }) => {
    const integration = new IntegrationsPage(request);
    await integration.create_wp_user(affiliate_username, affiliate_user_email);
  });

  test("Create Affiliate -e2e", async ({ request }) => {
    const integration = new IntegrationsPage(request);
    await integration.create_affiliate(affiliate_username);
  });

  test("Check Subscriber's info - Signed up through Affiliate WP Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.check_subscriber_on_list(list_id, affiliate_user_email)
    ).toEqual(false);
  });

  test("Approve Affiliate User - e2e", async ({ request }) => {
    const integration = new IntegrationsPage(request);
    await integration.approve_affiliate(affiliate_username);
  });

  test("Validate Subscriber's info - Signed up through Affiliate WP Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscribers_list(
      list_id,
      affiliate_user_email
    );
  });

  test("Subscriber Delete - Signed up through Affiliate WP Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });

  test("Delete Affiliates -e2e", async ({ request }) => {
    const integration = new IntegrationsPage(request);
    await integration.delete_affiliate(affiliate_username);
  });

  test("Delete WP User - e2e", async ({ request }) => {
    const integration = new IntegrationsPage(request);
    await integration.delete_wp_user(affiliate_username);
  });
});

/* ------------------------ Functionalities of Automation Feature ------------------------ */
test.describe("Functionalities of Automation Feature", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let automation_name: string = `Automation - ${faker.lorem.words(2)}`;
  let automation_id: string = "";
  let delay_id: string = "";
  let subscriber_id: string = "";
  let subscriber_email: string = faker.internet.email();

  test("List Create", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("Automation Create", async ({ request }) => {
    const automation = new AutomationPage(request);
    automation_id = await automation.welcome_automation_create(
      list_id,
      automation_name
    );
  });

  test("Automation Details", async ({ request }) => {
    const automation = new AutomationPage(request);
    delay_id = await automation.get_automation_details(automation_id);
  });

  test("Delete Automation Delay", async ({ request }) => {
    const automation = new AutomationPage(request);
    await automation.delete_automation_delay(automation_id, delay_id);
  });

  test("Automation Activation", async ({ request }) => {
    const automation = new AutomationPage(request);
    await automation.automation_activation(automation_id, automation_name);
  });

  test("Subscriber Create With Fire Event", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscriber_create_with_fire_event(
      subscriber_email.toLowerCase(),
      list_id
    );
  });

  test("Check Automation Status", async ({ request }) => {
    const automation = new AutomationPage(request);
    expect(await automation.automation_status(automation_id)).toEqual("active");
  });

  test("Check Automation Activity", async ({ request }) => {
    let automation_activity_response: { data: [{ id: string; email: string }] };
    const automation = new AutomationPage(request);

    for (let i: number = 0; i <= 15; i++) {
      automation_activity_response = await automation.automation_activity(
        automation_id
      );
      if (automation_activity_response.data.length > 0) {
        expect(automation_activity_response.data[0].id).toEqual(subscriber_id);
      } else {
        i++;
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  });

  test("Automation Delete", async ({ request }) => {
    const automation = new AutomationPage(request);
    await automation.automation_delete(automation_id);
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of Contact Form 7 Integration ------------------------ */
test.describe("Functionalities of Contact Form 7 Integration", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let contact_form_7_id: string = "";
  let contact_form_7_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let form_subscriber_email: string = faker.internet.email();
  let form_subscriber_name: string = faker.name.firstName();

  test("Contact Form 7 - List Create", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("Create Contact Form 7 - e2e", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.create_contact_forms_7(contact_form_7_name);
  });

  test("weMail List <-> Contact Form 7 - e2e", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.map_contact_form_7(list_name, contact_form_7_name);
  });

  test.skip("weMail List <-> Contact Form 7 - API", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.map_contact_form_7_API(list_id, contact_form_7_id);
  });

  test("Get Contact Form 7 ID", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    contact_form_7_id = (
      await integrations.contact_form_7_post_id(contact_form_7_name)
    ).toString();
  });

  test("Submit - Contact Form 7", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.submit_contact_form_7(
      contact_form_7_id,
      form_subscriber_email.toLowerCase(),
      form_subscriber_name
    );
  });

  test("Subscriber's info - Signed up through Contact Form 7", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscribers_list(
      list_id,
      form_subscriber_email
    );
  });

  test("Delete Contact Form 7 - e2e", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.delete_contact_form_7(contact_form_7_name);
  });

  test("Subscriber Delete - Signed up through Contact Form 7", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of WooCommerce Integration ------------------------ */
test.describe("Functionalities of WooCommerce Integration", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let woocom_product_id: number = 0;
  let woocom_product_name: string = faker.lorem.words(2);
  let woocom_order_id: number = 0;
  let subscriber_id: string = "";
  let woocom_customer_email: string = faker.internet.email();

  test("List Create for woocom Int.", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("weMail <-> WooCommerce - API", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.woocom_integrations(list_id);
  });

  test("Create woocom Product", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    woocom_product_id = await integrations.woocom_product_create(
      woocom_product_name
    );
  });

  test("Create woocom Order", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    data.woocom_order_data.line_items[0].product_id = woocom_product_id;
    data.woocom_order_data.billing.email = woocom_customer_email.toLowerCase();
    woocom_order_id = await integrations.woocom_order_create(
      data.woocom_order_data
    );
  });

  test("Complete woocom Order", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.woocom_order_complete(woocom_order_id);
  });

  test("Subscriber's info - Signed up through WooCommerce Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscribers_list(
      list_id,
      woocom_customer_email
    );
  });

  test("Subscriber Delete - Signed up through WooCommerce Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });

  test("Delete woocom Order", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.woocom_order_delete(woocom_order_id);
  });

  test("Delete woocom Product", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.woocom_product_delete(woocom_product_id);
  });
});

/* ------------------------ Functionalities of WP ERP Integration ------------------------ */
test.describe("Functionalities of WP ERP Integration", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscriber_id: string = "";
  let wperp_crm_customer_email: string = faker.internet.email();
  let wperp_crm_customer_id: string = "";

  test("List Create for WP ERP Integration", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("weMail <-> WP ERP - API", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.wperp_integrations(list_id);
  });

  test("Create WP ERP CRM Contacts", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    wperp_crm_customer_id = await integrations.wperp_crm_contact_create(
      wperp_crm_customer_email
    );
  });

  test("Subscriber's info - Signed up through WP ERP Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    subscriber_id = await subscriber.subscribers_list(
      list_id,
      wperp_crm_customer_email
    );
  });

  test("Subscriber Delete - Signed up through WP ERP Integration", async ({
    request,
  }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscriber_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });

  test("Delete WP ERP CRM Contacts", async ({ request }) => {
    const integrations = new IntegrationsPage(request);
    await integrations.wperp_crm_contact_delete(wperp_crm_customer_id);
  });
});

/* ------------------------ Functionalities of Exclude Feature on Campaign ------------------------ */
test.describe("Functionalities of Exclude Feature on Campaign", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let tag_id: string = "";
  let tag_name: string = `${faker.lorem.words(1)}${faker.random.numeric(1)}`;
  let segment_name: string = `${faker.lorem.words(1)}${faker.random.numeric(
    1
  )}`;
  let segment_id: string = "";
  let subscribers_id: string[] = [];
  let subscriber_email: string = faker.internet.email();
  let segmented_subscriber_email: string = faker.internet.email();
  let tagged_subscriber_email: string = faker.internet.email();
  let campaign_id: string = "";
  let campaign_name: string = faker.lorem.words(2);
  let duplicate_campaign_id: string = "";
  let campaign_sending_gateway: string = "smtp";
  let campaign_activity_stats: {
    status: string;
    no_of_subscribers: number;
    email_id: string;
  } = { status: "", no_of_subscribers: 0, email_id: "" };
  let deplicated_campaign_activity_stats: {
    status: string;
    no_of_subscribers: number;
    email_id: string;
  } = { status: "", no_of_subscribers: 0, email_id: "" };

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

  test("List Create for Campaign", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
    data.campaign_data.lists.push(list_id);
  });

  test("Subscribers Create for Campaign", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    subscribers_id.push(
      await subscriber.subscriber_create(
        subscriber_email.toLowerCase(),
        list_id
      ),
      await subscriber.subscriber_create(
        segmented_subscriber_email.toLowerCase(),
        list_id
      ),
      await subscriber.subscriber_create(
        tagged_subscriber_email.toLowerCase(),
        list_id
      )
    );
  });

  test("Tag Create", async ({ request }) => {
    const list = new ListPage(request);
    tag_id = await list.tag_create(list_id, tag_name);
  });

  test("Assign Tag on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    await list.tag_assign(list_id, tag_id, subscribers_id[2]);
  });

  test("Segment Create (Using Email Address)", async ({ request }) => {
    const list = new ListPage(request);
    segment_id = await list.segment_create_with_email_equal(
      list_id,
      segmented_subscriber_email,
      segment_name
    );
  });

  test("Campaign Create", async ({ request }) => {
    const campaign = new CampaignPage(request);
    data.campaign_data.name = campaign_name;
    campaign_id = await campaign.create_campaign(data.campaign_data);
  });

  test("Exclude Segment & Tag from campaign - e2e", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.exclude_list_segment_tag_from_campaign(
      campaign_name,
      segment_name,
      tag_name
    );
  });

  test("Campaign Send", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.send_campaign(campaign_id);
  });

  test("Check Campaign Activity", async ({ request }) => {
    const campaign = new CampaignPage(request);

    while (campaign_activity_stats.status != "completed") {
      campaign_activity_stats = await campaign.campaign_activity(campaign_id);
      await new Promise((r) => setTimeout(r, 20000));
    }

    expect(campaign_activity_stats.no_of_subscribers).toEqual(1);
  });

  test("Un-assign Tag on Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    await list.tag_assign(list_id, "", subscribers_id[2]);
  });

  test("Duplicate a Campaign & Send", async ({ request }) => {
    const campaign = new CampaignPage(request);
    duplicate_campaign_id = await campaign.duplicate_campaign(campaign_id);
    await campaign.send_campaign(duplicate_campaign_id);
  });

  test("Re-check Campaign Activity", async ({ request }) => {
    const campaign = new CampaignPage(request);

    while (deplicated_campaign_activity_stats.status != "completed") {
      deplicated_campaign_activity_stats = await campaign.campaign_activity(
        duplicate_campaign_id
      );
      await new Promise((r) => setTimeout(r, 20000));
    }

    expect(deplicated_campaign_activity_stats.no_of_subscribers).toEqual(2);
  });

  test("Campaign Delete", async ({ request }) => {
    const campaign = new CampaignPage(request);
    await campaign.delete_campaign(campaign_id);
    await campaign.delete_campaign(duplicate_campaign_id);
  });

  test("Tag Delete", async ({ request }) => {
    const list = new ListPage(request);
    await list.tag_delete(list_id, tag_id);
  });

  test("Segment Delete", async ({ request }) => {
    const list = new ListPage(request);
    await list.segment_delete(segment_id);
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(list_id, subscribers_id[0]);
    await subscriber.subscriber_delete(list_id, subscribers_id[1]);
    await subscriber.subscriber_delete(list_id, subscribers_id[2]);
  });

  test("Delete Campaign Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});
