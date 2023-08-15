import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
// import { AutomationPage } from "../pages/automation";
import { CampaignPage } from "../pages/campaign";
import { AdminPage } from "../pages/form_on_wp_site";
import { FormPage } from "../pages/forms";
// import { IntegrationsPage } from "../pages/integrations";
import { ListPage } from "../pages/list";
import { LoginPage } from "../pages/login";
import { GatewayPage } from "../pages/sending_gateways";
import { SubscriberPage } from "../pages/subscriber";
import { SuppressionPage } from "../pages/suppression";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

// let list_id: string = "";
// let list_name: string = faker.lorem.words(2);
// let subscribers_id: string[] = [];
// let subscriber_email: string = faker.internet.email();
// let form_subscriber_email: string = faker.internet.email();
// let forms_id: string[] = [];
// let form_page_url: string = "";
// let automation_id: string = "";
// let campaign_id: string = "";
// let campaign_sending_gateway: string = "smtp";

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

// /* ------------------------ Functionalities of List ------------------------ */
test.describe("List Functionalities", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);

  test("List Create", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
    // data.campaign_data.lists.push(list_id);
    // data.form_data.list_id = list_id;
    // data.affiliate_integration_data.list = await list.list_create(
    //   faker.lorem.words(2)
    // );
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

  test("List Delete", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    // For multiple list delete, push list_id on lists array
    // lists.push("3992afb1-68ba-4ba7-a3c2-ae5dedffb21a");

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

/* ------------------------ Functionalities of Subscribers ------------------------ */
test.describe("Subscribers Functionalities", () => {
  let list_id: string = "";
  let list_name: string = faker.lorem.words(2);
  let subscribers_id: string[] = [];
  let subscriber_email: string = faker.internet.email();

  test("List Create for Subscriber", async ({ request }) => {
    const list = new ListPage(request);
    list_id = await list.list_create(list_name);
  });

  test("Subscriber Create", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    subscribers_id.push(
      await subscriber.subscriber_create(
        subscriber_email.toLowerCase(),
        list_id
      )
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

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(subscribers_id[0]);
  });

  test("Delete Subscriber Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

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
  let header: string[];
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

    if (header[0] == "" || header[1] == "") {
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
      const form = new FormPage(request);
      await form.form_submit(
        forms_id[0],
        form_subscriber_email.toLowerCase(),
        header
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
    //   subscribers_id = await subscriber.subscribers_list(
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
    await subscriber.subscriber_delete(subscriber_id);
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
    await subscriber.subscriber_delete(subscribers_id[0]);
    await subscriber.subscriber_delete(subscribers_id[1]);
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
  let subscribers_id: string[] = [];
  let subscriber_email: string = faker.internet.email();
  let campaign_id: string = "";
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
    subscribers_id.push(
      await subscriber.subscriber_create(
        subscriber_email.toLowerCase(),
        list_id
      )
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

  test("Check Campaign Activity", async ({ request }) => {
    const campaign = new CampaignPage(request);
    while (campaign_activity_stats.status != "completed") {
      campaign_activity_stats = await campaign.campaign_activity(campaign_id);
      await new Promise((r) => setTimeout(r, 20000));
    }
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
    await subscriber.subscriber_delete(subscribers_id[0]);
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
  let subscribers_id: string = "";
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
    subscribers_id = verification_url.slice(startIndex, endIndex);
  });

  test("Check Subscriber Status", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    expect(
      await subscriber.subscriber_status(
        list_id,
        subscriber_email.toLowerCase(),
        subscribers_id
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
        subscribers_id
      )
    ).toEqual("subscribed");
  });

  test("Subscriber Delete", async ({ request }) => {
    const subscriber = new SubscriberPage(request);
    await subscriber.subscriber_delete(subscribers_id);
  });

  test("Delete Test List", async ({ request }) => {
    let lists: Array<string> = [];
    lists.push(list_id);

    const list = new ListPage(request);
    await list.list_delete(lists);
  });
});

// test("Affiliate Integration", async ({ request }) => {
//   const integration = new IntegrationsPage(request);
//   await integration.integrate_affiliatewp();
// });

// test("Create Affiliate", async ({ request }) => {
//   const integration = new IntegrationsPage(request);
//   await integration.create_affiliate(subscriber_email);
// });

// test("Automation Create", async ({ request }) => {
//   const automation = new AutomationPage(request);
//   automation_id = await automation.welcome_automation_create(list_id);
// });

// test("Automation Activation", async ({ request }) => {
//   const automation = new AutomationPage(request);
//   await automation.automation_activation(automation_id);
// });

// test("Check Automation Activity", async ({ request }) => {
//   const automatoin = new AutomationPage(request);
//   await automatoin.automation_activity(automation_id, form_subscriber_email);
// });

// test("Automation Delete", async ({ request }) => {
//   const automation = new AutomationPage(request);
//   await automation.automation_delete(automation_id);
// });
