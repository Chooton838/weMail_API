import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { AutomationPage } from "../pages/automation";
import { CampaignPage } from "../pages/campaign";
import { AdminPage } from "../pages/form_on_wp_site";
import { FormPage } from "../pages/forms";
//import { IntegrationsPage } from "../pages/integrations";
import { RatIntegrationsPage } from "../pages/rat_integrations";
import { ListPage } from "../pages/list";
import { LoginPage } from "../pages/login";
import { GatewayPage } from "../pages/sending_gateways";
import { SubscriberPage } from "../pages/subscriber";
import { SuppressionPage } from "../pages/suppression";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";

// /* ------------------------ Login ------------------------ */
// test.beforeAll(async ({ request }) => {
//   const login_data: Array<string> = [config.use?.httpCredentials?.username!, config.use?.httpCredentials?.password!];

//   const login = new LoginPage(request);
//   await login.login(login_data);

//   const base = new BasePage(request);
//   await base.wordpress_site_login();

//   //Activate-plugin
//   let plugins_name: string[] = ["contact-form-7", "wpforms-lite"];
//   for (let i: number = 0; i < plugins_name.length; i++) {
//     await base.activate_plugin(plugins_name[i]);
//   }
// });

/* ------------------------ Functionalities of Contact Form 7 Integration ------------------------ */
// test.describe.skip("Functionalities of Contact Form 7 Integration", () => {
//   let list_id: string = "";
//   let list_name: string = faker.lorem.words(2);
//   let contact_form_7_id: string = "";
//   let contact_form_7_name: string = faker.lorem.words(2);
//   let subscriber_id: string = "";
//   let form_subscriber_email: string = faker.internet.email();
//   let form_subscriber_name: string = faker.name.firstName();

//   test.only("Contact Form 7 - List Create", async ({ request }) => {
//     const list = new ListPage(request);
//     list_id = await list.list_create(list_name);
//   });

//   test("Create Contact Form 7 - e2e", async ({ request }) => {
//     const integrations = new RatIntegrationsPage(request);
//     await integrations.create_contact_forms_7(contact_form_7_name);
//   });

//   test("weMail List <-> Contact Form 7 - e2e", async ({ request }) => {
//     const integrations = new RatIntegrationsPage(request);
//     await integrations.map_contact_form_7(list_name, contact_form_7_name);
//   });

//   test.skip("weMail List <-> Contact Form 7 - API", async ({ request }) => {
//     const integrations = new RatIntegrationsPage(request);
//     await integrations.map_contact_form_7_API(list_id, contact_form_7_id);
//   });

//   test("Get Contact Form 7 ID", async ({ request }) => {
//     const integrations = new RatIntegrationsPage(request);
//     contact_form_7_id = (await integrations.contact_form_7_post_id(contact_form_7_name)).toString();
//   });

//   test("Submit - Contact Form 7", async ({ request }) => {
//     const integrations = new RatIntegrationsPage(request);
//     await integrations.submit_contact_form_7(contact_form_7_id, form_subscriber_email.toLowerCase(), form_subscriber_name);
//   });

//   test("Subscriber's info - Signed up through Contact Form 7", async ({ request }) => {
//     const subscriber = new SubscriberPage(request);
//     subscriber_id = await subscriber.subscribers_list(list_id, form_subscriber_email);
//   });

//   test("Delete Contact Form 7 - e2e", async ({ request }) => {
//     const integrations = new RatIntegrationsPage(request);
//     await integrations.delete_contact_form_7(contact_form_7_name);
//   });

//   test("Subscriber Delete - Signed up through Contact Form 7", async ({ request }) => {
//     const subscriber = new SubscriberPage(request);
//     await subscriber.subscriber_delete(list_id, subscriber_id);
//   });

//   test("Delete Test List", async ({ request }) => {
//     let lists: Array<string> = [];
//     lists.push(list_id);

//     const list = new ListPage(request);
//     await list.list_delete(lists);
//   });
// });


/* ------------------------ Functionalities of WP Forms Integration ------------------------ */
test.describe.only("Functionalities of WP Forms Integration", () => {
    let list_id: string = "";
    let list_name: string = faker.lorem.words(2);
    let wp_forms_id: string = "";
    let wp_forms_name: string = faker.lorem.words(2);
    let subscriber_id: string = "";
    let form_subscriber_email: string = faker.internet.email();
    let form_subscriber_name: string = faker.name.firstName();
    let wp_forms_shortcode: string = "";
    let wp_form_page_name: string = "";
  
    test("WP Forms - List Create", async ({ request }) => {
      const list = new ListPage(request);
      list_id = await list.list_create(list_name);
    });
  
    test("Create WP Forms - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      await integrations.create_wp_forms(wp_forms_name);
    });
  
    test("weMail List <-> WP Forms - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      await integrations.map_wp_forms(list_name, wp_forms_name);
    });
  
    test.skip("weMail List <-> WP Forms - API", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      await integrations.map_wp_forms(list_id, wp_forms_id);
    });
  
    test("Get WP Forms ID", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      wp_forms_id = (await integrations.wp_forms_post_id(wp_forms_name)).toString();
    });
    
    test("Get WP Forms Shortcode - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      wp_forms_shortcode = (await integrations.get_wp_forms_shortcode()).toString();
      console.log(wp_forms_shortcode);
    });

    test("Create Page form, WP Forms - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      wp_form_page_name = "[QA] WPForms"
      await integrations.create_wp_forms_page(wp_form_page_name, wp_forms_shortcode);
    });
    

    test("Submit WP Forms - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      await integrations.submit_wp_forms(wp_forms_id, form_subscriber_email.toLowerCase(), form_subscriber_name);
    });
  
    test("Subscriber's info - Signed up through WP Forms", async ({ request }) => {
      const subscriber = new SubscriberPage(request);
      subscriber_id = await subscriber.subscribers_list(list_id, form_subscriber_email);
    });
  
    test("Delete WP Forms - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      await integrations.delete_wp_forms(wp_forms_name);
    });

    test("Delete WP Forms Page - e2e", async ({ request }) => {
      const integrations = new RatIntegrationsPage(request);
      await integrations.delete_wp_forms_page(wp_form_page_name);
    });
  
    test("Subscriber Delete - Signed up through WP Forms", async ({ request }) => {
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


// /* ------------------------ Deactivate plugins ------------------------ */
// test.afterAll(async ({ request }) => {
//   const base = new BasePage(request);

//   //Activate-plugin
//   let plugins_name: string[] = ["contact-form-7", "wpforms-lite"];
//   for (let i: number = 0; i < plugins_name.length; i++) {
//     await base.deactivate_plugin(plugins_name[i]);
//   }
// });
