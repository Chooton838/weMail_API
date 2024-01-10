import { APIRequestContext, chromium, expect, firefox } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";
import { selectors } from "../utils/selectors";

export class RatIntegrationsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /* ------------------------ Integration: Contact Form 7 ------------------------ */

  //   async create_contact_forms_7(contact_form_7_name: string) {
  //     const browser = await firefox.launch();
  //     // const context = await browser.newContext({
  //     //   userAgent:
  //     //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
  //     // });
  //     const context = await browser.newContext({ storageState: "state.json" });
  //     const page = await context.newPage();

  //     // await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`, {
  //     //   waitUntil: "networkidle",
  //     // });

  //     await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`);

  //     await page.click('//a[@class="page-title-action" and contains(text(),"Add New")]');
  //     await page.waitForLoadState("domcontentloaded");

  //     await page.fill('//input[@id="title"]', contact_form_7_name);
  //     await page.click('//p[@class="submit"]//input[@name="wpcf7-save"]');
  //     await page.waitForTimeout(3000);
  //     expect(await page.locator('//input[@id="wpcf7-shortcode"]').isVisible()).toBeTruthy();
  //     await browser.close();
  //   }

  //   async map_contact_form_7(list_name: string, contact_form_7_name: string) {
  //     const browser = await firefox.launch();
  //     // const context = await browser.newContext({
  //     //   userAgent:
  //     //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
  //     // });
  //     const context = await browser.newContext({ storageState: "state.json" });
  //     const page = await context.newPage();

  //     await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
  //     await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`, {
  //       waitUntil: "networkidle",
  //     });

  //     await page.locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]//input[@type="checkbox"]`).click();

  //     await page.locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]`).click();

  //     await page.locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`).fill(list_name);

  //     await page.locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`).press("Enter");

  //     await page.locator(`//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/../form//input[@type="checkbox"]`).click();

  //     await page.locator(`(//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//select)[1]`).selectOption("first_name");

  //     await page.locator(`(//h3[@class="title clearfix" and contains(text(), "${contact_form_7_name}")]/..//select)[2]`).selectOption("email");

  //     await page.locator(`//button[contains(text(),"Save Settings")]`).click();

  //     expect(await page.locator(`//p[@class="iziToast-message slideIn"]`).innerText()).toEqual("Settings saved successfully");

  //     await browser.close();
  //   }

  //   async map_contact_form_7_API(list_id: string, contact_form_7_id: string) {
  //     let page_url: string = `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`;
  //     let locator: string = `#wemail-vendor-js-extra`;
  //     const base = new BasePage(this.request);
  //     let header = await base.wordpress_nonce_cookie(page_url, locator, false, "");

  //     let form_data = new URLSearchParams();
  //     // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
  //     form_data.append("settings[0][id]", contact_form_7_id);
  //     form_data.append("settings[0][list_id]", list_id);
  //     form_data.append("settings[0][overwrite]", "true");
  //     form_data.append("settings[0][map][your-name]", "first_name");
  //     form_data.append("settings[0][map][your-email]", "email");

  //     const contact_form_7 = await this.request.post(`${data.rest_url}/wemail/v1/forms/integrations/contact-form-7`, {
  //       headers: {
  //         "X-WP-Nonce": header.nonce,
  //         Cookie: header.cookie,
  //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  //       },
  //       data: form_data.toString(),
  //     });

  //     let contact_form_7_response: { message: string };
  //     contact_form_7_response = await base.response_checker(contact_form_7);

  //     try {
  //       expect(contact_form_7_response.message).toEqual("Settings saved successfully.");
  //     } catch (err) {
  //       console.log(contact_form_7_response);
  //       expect(contact_form_7.ok()).toBeFalsy();
  //     }
  //   }

  //   async contact_form_7_post_id(contact_form_7_name: string) {
  //     const contact_form_7_post_id = await this.request.get(`${config.use?.baseURL}/v1/forms/integrations/contact-form-7/forms`);

  //     let contact_form_7_post_id_response: {
  //       data: Array<{ id: number; title: string }>;
  //     };

  //     const base = new BasePage(this.request);
  //     contact_form_7_post_id_response = await base.response_checker(contact_form_7_post_id);
  //     let id: number = 0;

  //     if (contact_form_7_post_id_response.data.length > 0) {
  //       for (let i: number = 0; i < contact_form_7_post_id_response.data.length; i++) {
  //         if (contact_form_7_post_id_response.data[i].title == contact_form_7_name) {
  //           id = contact_form_7_post_id_response.data[i].id;
  //           break;
  //         }
  //       }
  //     }
  //     if (id == 0) {
  //       console.log("Created Contact form 7 Not Found");
  //       expect(contact_form_7_post_id.ok()).toBeFalsy();
  //     }
  //     return id;
  //   }

  //   async submit_contact_form_7(contact_form_7_id: string, subscriber_email: string, subscriber_name: string) {
  //     let payload: string = `------WebKitFormBoundary66t6AAYgRH37yFnA
  // Content-Disposition: form-data; name="your-name"

  // ${subscriber_name}
  // ------WebKitFormBoundary66t6AAYgRH37yFnA
  // Content-Disposition: form-data; name="your-email"

  // ${subscriber_email}
  // ------WebKitFormBoundary66t6AAYgRH37yFnA
  // Content-Disposition: form-data; name="your-subject"

  // subject
  // ------WebKitFormBoundary66t6AAYgRH37yFnA
  // Content-Disposition: form-data; name="your-message"

  // message
  // ------WebKitFormBoundary66t6AAYgRH37yFnA--`;

  //     const submit_contact_form_7 = await this.request.post(`${data.rest_url}/contact-form-7/v1/contact-forms/${contact_form_7_id}/feedback`, {
  //       headers: {
  //         "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary66t6AAYgRH37yFnA",
  //       },
  //       data: payload,
  //     });

  //     let submit_contact_form_7_response: { message: string };

  //     const base = new BasePage(this.request);
  //     submit_contact_form_7_response = await base.response_checker(submit_contact_form_7);

  //     try {
  //       expect(submit_contact_form_7_response.message).toEqual("Thank you for your message. It has been sent.");
  //     } catch (err) {
  //       console.log(submit_contact_form_7_response);
  //       expect(submit_contact_form_7.ok()).toBeFalsy();
  //     }
  //   }

  //   async delete_contact_form_7(contact_form_7_name: string) {
  //     const browser = await firefox.launch();
  //     // const context = await browser.newContext({
  //     //   userAgent:
  //     //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
  //     // });
  //     const context = await browser.newContext({ storageState: "state.json" });
  //     const page = await context.newPage();

  //     await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
  //     await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpcf7`, {
  //       waitUntil: "networkidle",
  //     });

  //     await page.locator(`//a[text()="${contact_form_7_name}"]/../../..//input[@type="checkbox"]`).click();

  //     await page.locator("#bulk-action-selector-top").selectOption("Delete");
  //     await page.locator("#doaction").click();
  //     await page.waitForLoadState("networkidle");
  //     expect(await page.locator('//p[text()="Contact form deleted."]').isVisible()).toBeTruthy();
  //   }

  /* ------------------------ Integration: WPForms Lite ------------------------ */
  async create_wp_forms(wp_forms_name: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpforms-overview`);
    //Add new
    await page.click(selectors.integrations.wp_forms.add_new);
    await page.waitForLoadState("domcontentloaded");
    //Give form name
    await page.fill(selectors.integrations.wp_forms.new_name, wp_forms_name);
    //Select template
    await page.hover(selectors.integrations.wp_forms.template_box);
    await page.click(selectors.integrations.wp_forms.template_select_simple_contact_form);
    await page.waitForLoadState("domcontentloaded");
    //Save
    await page.click(selectors.integrations.wp_forms.click_save);
    await page.waitForTimeout(3000);
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpforms-overview`);
    expect(await page.innerText(selectors.integrations.wp_forms.validate_new_form_created)).toContain(wp_forms_name);
    await browser.close();
  }

  async map_wp_forms(list_name: string, wp_forms_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/wpforms`, {
      waitUntil: "networkidle",
    });

    //Checkbox
    await page.locator(selectors.integrations.wp_forms.select_checkbox).click();
    //Click list dropdown
    await page.locator(selectors.integrations.wp_forms.click_dropdown_selection).click();
    //Type list name
    await page.locator(selectors.integrations.wp_forms.type_list_name).fill(list_name);
    //Select list
    await page.locator(selectors.integrations.wp_forms.select_list).press("Enter");
    //Overwrite checkbox
    await page.locator(selectors.integrations.wp_forms.overwrite_checkbox).click();
    //Select first_name
    await page.locator(selectors.integrations.wp_forms.select_first_name).selectOption("first_name");
    //Select email
    await page.locator(selectors.integrations.wp_forms.select_email).selectOption("email");
    //Save map settings
    await page.locator(selectors.integrations.wp_forms.save_map_settings).click();
    //Validate saved success message
    expect(await page.locator(selectors.integrations.wp_forms.validate_saved_success).innerText()).toEqual("Settings saved successfully");

    await browser.close();
  }

  async map_wp_forms_API(list_id: string, wp_forms_id: string) {
    let page_url: string = `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/wpforms`;
    let locator: string = `#wemail-vendor-js-extra`;
    const base = new BasePage(this.request);
    let header = await base.wordpress_nonce_cookie(page_url, locator, false, "");

    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"
    form_data.append("settings[0][id]", wp_forms_id);
    form_data.append("settings[0][list_id]", list_id);
    form_data.append("settings[0][overwrite]", "true");
    form_data.append("settings[0][map][your-name]", "first_name");
    form_data.append("settings[0][map][your-email]", "email");

    const wp_forms_request = await this.request.post(`${data.rest_url}/wemail/v1/forms/integrations/wpforms`, {
      headers: {
        "X-WP-Nonce": header.nonce,
        Cookie: header.cookie,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: form_data.toString(),
    });

    let wp_forms_response: { message: string };
    wp_forms_response = await base.response_checker(wp_forms_request);

    try {
      expect(wp_forms_response.message).toEqual("Settings saved successfully.");
    } catch (err) {
      console.log(wp_forms_response);
      expect(wp_forms_request.ok()).toBeFalsy();
    }
  }

  async wp_forms_post_id(wp_forms_name: string) {
    const wp_forms_post_id_request = await this.request.get(`${config.use?.baseURL}/v1/forms/integrations/wpforms/forms`);

    let wp_forms_post_id_response: {
      data: Array<{ id: number; title: string }>;
    };

    const base = new BasePage(this.request);
    wp_forms_post_id_response = await base.response_checker(wp_forms_post_id_request);
    console.log(wp_forms_post_id_response);
    console.log(wp_forms_name);

    let id: number = 0;

    if (wp_forms_post_id_response.data.length > 0) {
      for (let i: number = 0; i < wp_forms_post_id_response.data.length; i++) {
        console.log(wp_forms_post_id_response.data[i].title);
        console.log(wp_forms_name);
        if (wp_forms_post_id_response.data[i].title == wp_forms_name) {
          id = wp_forms_post_id_response.data[i].id;
          break;
        }
      }
    }

    if (id == 0) {
      console.log("Created WP Forms Not Found");
      expect(wp_forms_post_id_request.ok()).toBeFalsy();
    }

    return id;
  }

  async get_wp_forms_shortcode() {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpforms-overview`);
    // await page.click('//a[@class="page-title-action wpforms-btn add-new-h2 wpforms-btn-orange"]');
    //Validate shortcode list
    expect(await page.locator(selectors.integrations.wp_forms.shortcode_item1).isVisible()).toBeTruthy();
    //Store shortocde
    let store_wp_forms_shortcode: string = await page.locator(selectors.integrations.wp_forms.shortcode_item1).innerText();
    //Print shortcode
    // console.log(store_wp_forms_shortcode);
    return store_wp_forms_shortcode;
  }

  async create_wp_forms_page(wp_form_page_name: string, wp_forms_shortcode: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();
    //Add new page
    await page.goto(`${data.wordpress_site_data.url}/post-new.php?post_type=page`);
    console.log(wp_form_page_name);
    console.log(wp_forms_shortcode);
    //Give page name
    await page.locator(selectors.integrations.wp_forms.add_page_title).fill(wp_form_page_name);
    //Fill shortcode
    // await page.locator(selectors.integrations.wp_forms.add_page_paragraph).click();
    await page.keyboard.press('Tab');
    await page.locator(selectors.integrations.wp_forms.fill_shortcode).fill(wp_forms_shortcode);
    //Click Publish
    await page.locator(selectors.integrations.wp_forms.click_page_publish).click();
    //Confirm Publish
    await page.locator(selectors.integrations.wp_forms.confirm_page_publish).click();
    await page.waitForLoadState('domcontentloaded');
    //Validate page published success
    console.log(await page.locator(selectors.integrations.wp_forms.validate_page_published).innerText());
    expect(await page.locator(selectors.integrations.wp_forms.validate_page_published).isVisible()).toBeTruthy();
  }

  async submit_wp_forms(wp_form_page_name: string, wp_forms_id: string, subscriber_email: string, subscriber_name: string) {
    const browser = await chromium.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    //Convert to page_url_path
    const new_page_name = wp_form_page_name;
    const formatted_page_name = new_page_name.replace(/\[|\]/g, "") // Remove square brackets
      .replace(" ", "-") // Replace space with hyphen
      .toLowerCase(); // Convert to lowercase
    console.log(formatted_page_name);
    //Update url
    const original_url = data.wordpress_site_data.url;
    const new_url = original_url.replace('/wp-admin', '');
    console.log(new_url);

    //Go to updated page url
    console.log(`${new_url}/${formatted_page_name}/`);
    await page.goto(`${new_url}/${formatted_page_name}/`);
    //Subscriber first name
    await page.fill(selectors.integrations.wp_forms.subscriber_fname, subscriber_name);
    //Subscriber last name
    await page.fill(selectors.integrations.wp_forms.subscriber_lname, "Man");
    //Subscriber email
    await page.fill(selectors.integrations.wp_forms.subscriber_email, subscriber_email);
    //Subscriber message box
    await page.fill(selectors.integrations.wp_forms.subscriber_message_box, "QA in testing...!!!");
    //Subscriber submit
    await page.click(selectors.integrations.wp_forms.subscriber_submit_button);
    //Validate subscriber success
    await page.waitForLoadState('domcontentloaded');
    expect(await page.locator(selectors.integrations.wp_forms.validate_subscriber_submit).innerText()).toContain("Thanks for contacting us! We will be in touch with you shortly.");
    //Thanks for contacting us! We will be in touch with you shortly.
  }

  //Sends to Trash
  async delete_wp_forms(wp_forms_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpforms-overview`, {
      waitUntil: "networkidle",
    });

    //await page.locator(`//a[text()="${wp_forms_name}"]/../../..//input[@type="checkbox"]`).click();
    await page.locator('//input[@id="cb-select-all-1"]').click();
    await page.locator("#bulk-action-selector-top").selectOption("Trash");
    await page.locator("#doaction").click();
    await page.waitForLoadState("networkidle");
    expect(await page.locator('//p[text()="1 form was successfully moved to Trash."]').isVisible()).toBeTruthy();
  }

  async delete_wp_forms_page(wp_form_page_name: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    //Add new page
    await page.goto(`${data.wordpress_site_data.url}/edit.php?post_type=page`);

    await page.locator('//input[@type="search"]').fill(wp_form_page_name);
    await page.locator('//input[@id="search-submit"]').click();

    await page.locator(`//a[text()="${wp_form_page_name}"]/../../..//input[@type="checkbox"]`).click();

    await page.locator("#bulk-action-selector-top").selectOption("Move to Trash");
    await page.locator("#doaction").click();
    await page.waitForLoadState("networkidle");
    expect(await page.locator('//p[text()="1 page moved to the Trash. "]').isVisible()).toBeTruthy();
  }


  /* ------------------------ Integration: WPForms Lite ------------------------ */
  async create_ninja_forms(ninja_forms_name: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=ninja-forms`);
    //Validate form existing
    expect(page.locator('//a[contains(text(),"Contact Me")]')).toBeTruthy();

    //Add new
    await page.click('//button[text()="Add New"]');
    //Select blank
    await page.click('//strong[text()="Blank Form"]');
    expect(page.locator('//h3[text()="Add form fields"]')).toBeTruthy();
    //Add fields
    await page.click('//div[text()="First Name"]');
    await page.click('//div[text()="Last Name"]');
    await page.click('//div[text()="Email"]');
    await page.click('//div[text()="Submit"]');
    expect(page.locator('//div[@class="nf-field-wrap submit"]')).toBeTruthy();
    //Publish form
    await page.click('//a[@title="Done"]');
    await page.click('//a[@title="Publish"]');
    expect(page.locator('//input[@id="title"]')).toBeTruthy();
    await page.fill('//input[@id="title"]', ninja_forms_name);
    await page.click('//a[contains(text(),"Publish")]');
    await page.click('//a[@class="fa fa-times"]');
    //Validate form created
    expect(page.locator('//a[contains(text(),"Contact Me")]')).toBeTruthy();

    await browser.close();
  }

  async map_ninja_forms(list_name: string, ninja_forms_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/ninja-forms`, {
      waitUntil: "networkidle",
    });

    //Checkbox
    await page.locator(selectors.integrations.ninja_forms.select_checkbox).click();
    //Click list dropdown
    await page.locator(selectors.integrations.ninja_forms.click_dropdown_selection).click();
    //Type list name
    await page.locator(selectors.integrations.ninja_forms.type_list_name).fill(list_name);
    //Select list
    await page.locator(selectors.integrations.ninja_forms.select_list).press("Enter");
    //Overwrite checkbox
    await page.locator(selectors.integrations.ninja_forms.overwrite_checkbox).click();
    //Select first_name
    await page.locator(selectors.integrations.ninja_forms.select_first_name).selectOption("first_name");
    //Select email
    await page.locator(selectors.integrations.ninja_forms.select_email).selectOption("email");
    //Save map settings
    await page.locator(selectors.integrations.ninja_forms.save_map_settings).click();
    //Validate saved success message
    expect(await page.locator(selectors.integrations.ninja_forms.validate_saved_success).innerText()).toEqual("Settings saved successfully");

    await browser.close();
  }

  async ninja_forms_post_id(ninja_forms_name: string) {
    const ninja_forms_post_id_request = await this.request.get(`${config.use?.baseURL}/v1/forms/integrations/ninja-forms/forms`);

    let ninja_forms_post_id_response: {
      data: Array<{ id: number; title: string }>;
    };

    const base = new BasePage(this.request);
    ninja_forms_post_id_response = await base.response_checker(ninja_forms_post_id_request);
    console.log(ninja_forms_post_id_response);
    console.log(ninja_forms_name);

    let id: number = 0;

    if (ninja_forms_post_id_response.data.length > 0) {
      for (let i: number = 0; i < ninja_forms_post_id_response.data.length; i++) {
        console.log(ninja_forms_post_id_response.data[i].title);
        console.log(ninja_forms_name);
        if (ninja_forms_post_id_response.data[i].title == ninja_forms_name) {
          id = ninja_forms_post_id_response.data[i].id;
          break;
        }
      }
    }

    if (id == 0) {
      console.log("Created WP Forms Not Found");
      expect(ninja_forms_post_id_request.ok()).toBeFalsy();
    }

    return id;
  }

  async get_ninja_forms_shortcode() {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=ninja-forms`);
    // await page.click('//a[@class="page-title-action wpforms-btn add-new-h2 wpforms-btn-orange"]');
    //Validate shortcode list
    expect(await page.locator(selectors.integrations.ninja_forms.shortcode_item_with_set_name).isVisible()).toBeTruthy();
    //Store shortocde
    let store_ninja_forms_shortcode: string = await page.locator(selectors.integrations.ninja_forms.shortcode_item_with_set_name).innerText();
    //Print shortcode
    return store_ninja_forms_shortcode;
  }

  async create_ninja_forms_page(ninja_form_page_name: string, ninja_forms_shortcode: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();
    //Add new page
    await page.goto(`${data.wordpress_site_data.url}/post-new.php?post_type=page`);
    console.log(ninja_form_page_name);
    console.log(ninja_forms_shortcode);
    //Give page name
    await page.locator(selectors.integrations.ninja_forms.add_page_title).fill(ninja_form_page_name);
    //Fill shortcode
    await page.keyboard.press('Tab');
    await page.locator(selectors.integrations.ninja_forms.fill_shortcode).fill(ninja_forms_shortcode);
    //Click Publish
    await page.locator(selectors.integrations.ninja_forms.click_page_publish).click();
    //Confirm Publish
    await page.locator(selectors.integrations.ninja_forms.confirm_page_publish).click();
    await page.waitForLoadState('domcontentloaded');
    //Validate page published success
    console.log(await page.locator(selectors.integrations.ninja_forms.validate_page_published).innerText());
    expect(await page.locator(selectors.integrations.ninja_forms.validate_page_published).isVisible()).toBeTruthy();
  }

  async submit_ninja_forms(ninja_form_page_name: string, ninja_forms_id: string, subscriber_email: string, subscriber_name: string) {
    const browser = await chromium.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    //Convert to page_url_path
    const new_page_name = ninja_form_page_name;
    const formatted_page_name = new_page_name.replace(/\[|\]/g, "") // Remove square brackets
      .replace(" ", "-") // Replace space with hyphen
      .toLowerCase(); // Convert to lowercase
    console.log(formatted_page_name);
    //Update url
    const original_url = data.wordpress_site_data.url;
    const new_url = original_url.replace('/wp-admin', '');
    console.log(new_url);

    //Go to updated page url
    console.log(`${new_url}/${formatted_page_name}/`);
    await page.goto(`${new_url}/${formatted_page_name}/`);
    //Subscriber first name
    await page.fill(selectors.integrations.ninja_forms.subscriber_fname, subscriber_name);
    //Subscriber last name
    await page.fill(selectors.integrations.ninja_forms.subscriber_lname, "Man");
    //Subscriber email
    await page.fill(selectors.integrations.ninja_forms.subscriber_email, subscriber_email);
    //Subscriber message box
    await page.fill(selectors.integrations.ninja_forms.subscriber_message_box, "QA in testing...!!!");
    //Subscriber submit
    await page.click(selectors.integrations.ninja_forms.subscriber_submit_button);
    //Validate subscriber success
    await page.waitForLoadState('domcontentloaded');
    expect(await page.locator(selectors.integrations.ninja_forms.validate_subscriber_submit).innerText()).toContain("Thanks for contacting us! We will be in touch with you shortly.");
    //Thanks for contacting us! We will be in touch with you shortly.
  }

  //Sends to Trash
  async delete_ninja_forms(ninja_forms_name: string) {
    const browser = await firefox.launch();
    // const context = await browser.newContext({
    //   userAgent:
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // });
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    await page.goto(data.wordpress_site_data.url, { waitUntil: "networkidle" });
    await page.goto(`${data.wordpress_site_data.url}/admin.php?page=wpforms-overview`, {
      waitUntil: "networkidle",
    });

    //await page.locator(`//a[text()="${wp_forms_name}"]/../../..//input[@type="checkbox"]`).click();
    await page.locator('//input[@id="cb-select-all-1"]').click();
    await page.locator("#bulk-action-selector-top").selectOption("Trash");
    await page.locator("#doaction").click();
    await page.waitForLoadState("networkidle");
    expect(await page.locator('//p[text()="1 form was successfully moved to Trash."]').isVisible()).toBeTruthy();
  }

  async delete_ninja_forms_page(ninja_form_page_name: string) {
    const browser = await firefox.launch();

    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();

    //Add new page
    await page.goto(`${data.wordpress_site_data.url}/edit.php?post_type=page`);

    await page.locator('//input[@type="search"]').fill(ninja_form_page_name);
    await page.locator('//input[@id="search-submit"]').click();

    await page.locator(`//a[text()="${ninja_form_page_name}"]/../../..//input[@type="checkbox"]`).click();

    await page.locator("#bulk-action-selector-top").selectOption("Move to Trash");
    await page.locator("#doaction").click();
    await page.waitForLoadState("networkidle");
    expect(await page.locator('//p[text()="1 page moved to the Trash. "]').isVisible()).toBeTruthy();
  }
}
