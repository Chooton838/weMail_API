import { data2 } from "./data2";

export const selectors = {
  integrations: {
    contact_form_7: {},

    wp_forms: {
      /*--------------------Backend.Admin-end--------------------*/
      /*--------------------Create wp_forms--------------------*/
      //Add new button
      add_new: '//a[@class="page-title-action wpforms-btn add-new-h2 wpforms-btn-orange"]',
      //Form name
      new_name: '//input[@id="wpforms-setup-name"]',
      //Hover template
      template_box: '//div[@id="wpforms-template-simple-contact-form-template"]',
      //Select: Simple contact form
      template_select_simple_contact_form: '//a[@data-slug="simple-contact-form-template"]',
      //Save form
      click_save: '//button[@id="wpforms-save"]',
      //Validate form created
      validate_new_form_created: '(//td[@data-colname="Name"]//strong)[1]',

      /*--------------------Map wp_forms--------------------*/
      //Checkbox
      select_checkbox: `//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]//input[@type="checkbox"]`,
      //Click list dropdown
      click_dropdown_selection: `//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]/..//div[@class="multiselect__tags"]`,
      //Type list name
      type_list_name: `//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`,
      //Select list
      select_list: `//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`,
      //Overwrite checkbox
      overwrite_checkbox: `//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]/../form//input[@type="checkbox"]`,
      //Select first_name
      select_first_name: `(//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]/..//select)[1]`,
      //Select email
      select_email: `(//h3[@class="title clearfix" and contains(text(), "${data2.integrations.wp_forms.wp_forms_name}")]/..//select)[2]`,
      //Save map settings
      save_map_settings: `//button[contains(text(),"Save Settings")]`,
      //Validate saved success message
      validate_saved_success: `//p[@class="iziToast-message slideIn"]`,

      /*--------------------Get wp_forms shortcode--------------------*/
      //Shortcode
      shortcode_item1: '(//td[@data-colname="Shortcode"])[1]',

      /*--------------------Create page for wp_forms--------------------*/
      //Give page name
      fill_page_name: '//h1[@aria-label="Add title"]',
      //Fill shortcode
      fill_shortcode: '//p[@data-title="Paragraph"]',
      //Click Publish
      click_page_publish: '//button[text()="Publish"]',
      //Confirm Publish
      confirm_page_publish: '//button[contains(@class,"components-button editor-post-publish-button")]',
      //Validate page published success
      validate_page_published: '//a[contains(text(),"View Page")]',

      /*--------------------Frontend.Subscriber-end--------------------*/
      /*--------------------Submit wp_forms by Subscriber--------------------*/
      //Subscriber first name
      subscriber_fname: '//input[@class="wpforms-field-name-first wpforms-field-required"]',
      //Subscriber last name
      subscriber_lname: '//input[@class="wpforms-field-name-last wpforms-field-required"]',
      //Subscriber email
      subscriber_email: '//input[@type="email"]',
      //Subscriber message box
      subscriber_message_box: '//textarea[@class="wpforms-field-medium"]',
      //Subscriber submit
      subscriber_submit_button: '//button[@type="submit"]',
      //Validate subscriber success
      validate_subscriber_submit: '//p[text()="Thanks for contacting us! We will be in touch with you shortly."]',
    },
  },
};
