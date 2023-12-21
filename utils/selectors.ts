import * as data from "../utils/data";

let campaign_selectors: {
  campaign_page_url: string;
  select_campaign: (campaign_name: string) => string;
  campaign_settings: string;
  campaign_recipients: string;
  exclude_tag_select: string;
  exclude_tag_placeholder: string;
  exclude_tag_input: string;
  exclude_segment_select: string;
  exclude_segment_placeholder: string;
  exclude_segment_input: string;
  campaign_draft_save: string;
  campaign_update_toast: string;
} = {
  campaign_page_url: `${data.wordpress_site_data.url}/admin.php?page=wemail#/campaigns/`,
  select_campaign: (campaign_name: string) =>
    `//a[contains(text(),"${campaign_name}")]`,
  campaign_settings: '//div[@class="header"]//a[contains(text(),"Settings")]',
  campaign_recipients: '//a[contains(text(),"Recipients")]',
  exclude_tag_select: '//span[contains(text(),"By Tag")]',
  exclude_tag_placeholder:
    '//label[contains(text(),"Choose tag to exclude")]/..//span[@class="multiselect__placeholder"]',
  exclude_tag_input:
    '//label[contains(text(),"Choose tag to exclude")]/..//input[@class="multiselect__input"]',
  exclude_segment_select: '//span[contains(text(),"By Segment")]',
  exclude_segment_placeholder:
    '//label[contains(text(),"Choose segment to exclude")]/..//span[@class="multiselect__placeholder"]',
  exclude_segment_input:
    '//label[contains(text(),"Choose segment to exclude")]/..//input[@class="multiselect__input"]',
  campaign_draft_save: '//button[contains(text(),"Save as draft")]',
  campaign_update_toast: '//p[@class="iziToast-message slideIn"]',
};

let wemail_forms_selectors: {
  forms_page_url: string;
  forms_nonce_locator: string;
  select_wemail: string;
  select_forms: string;
  forms_sync: string;
  form_update_toast: string;
} = {
  forms_page_url: `${data.wordpress_site_data.url}/admin.php?page=wemail#/forms`,
  forms_nonce_locator: `#wemail-vendor-js-extra`,
  select_wemail: '//div[@class="wp-menu-name" and contains(text(),"weMail")]',
  select_forms: '//a[text()="Forms"]',
  forms_sync: '//button[@title="Sync forms with your website."]',
  form_update_toast: '//p[@class="iziToast-message slideIn"]',
};

let create_post: {
  create_post_page_url: string;
  add_new_page: string;
  title: string;
  text_type: string;
  textarea_content: string;
  publish_button: string;
  published_toast: string;
} = {
  create_post_page_url: `${data.wordpress_site_data.url}/post-new.php?post_type=page`,
  add_new_page: ".wp-heading-inline",
  title: "#title",
  text_type: '//button[text()="Text"]',
  textarea_content: '//textarea[@id="content"]',
  publish_button: '//input[@id="publish"]',
  published_toast: '//*[@id="message"]/p/a',
};

let form_submit: {
  form_username: string;
  form_subscriber_email: string;
  subscribe: string;
  success_popup: string;
  confirm: string;
} = {
  form_username: "#wemail-form-field-3",
  form_subscriber_email: "#wemail-form-field-4",
  subscribe:
    '//button[@class="submit-button" and contains(text(), "Join Today")]',
  success_popup: '//div[@class="swal-title"]',
  confirm: '//button[@class="swal-button swal-button--confirm"]',
};

let wp_admin: {
  username: string;
  password: string;
  submit: string;
} = {
  username: '//*[@id="user_login"]',
  password: '//*[@id="user_pass"]',
  submit: '//*[@id="wp-submit"]',
};

let integration_create_affiliate: {
  page_url: string;
  username: string;
  select_affiliate: (affiliate_username: string) => string;
  affiliate_status: string;
  affiliate_rate_type: string;
  affiliate_rate: string;
  affiliate_submit: string;
} = {
  page_url: `${data.wordpress_site_data.url}/admin.php?page=affiliate-wp-affiliates&action=add_affiliate`,
  username: "#user_name",
  select_affiliate: (affiliate_username: string) =>
    `//div[@class="ui-menu-item-wrapper" and contains(text(), ${affiliate_username})]`,
  affiliate_status: "#status",
  affiliate_rate_type: "#rate_type_percentage",
  affiliate_rate: "#rate",
  affiliate_submit: "#submit",
};

let integration_affiliate_actions: {
  affiliates_list_page_url: string;
  select_affiliate: (affiliate_username: string) => string;
  select_bulk_action: string;
  do_action: string;
} = {
  affiliates_list_page_url: `${data.wordpress_site_data.url}/admin.php?page=affiliate-wp-affiliates`,
  select_affiliate: (affiliate_username: string) =>
    `//a[text()="${affiliate_username}"]/../..//input[@type="checkbox"]`,
  select_bulk_action: "#bulk-action-selector-top",
  do_action: "#doaction",
};

let integration_create_cf7: {
  page_url: string;
  add_new: string;
  title: string;
  save: string;
  shortcode: string;
} = {
  page_url: `${data.wordpress_site_data.url}/admin.php?page=wpcf7`,
  add_new: '//a[@class="page-title-action" and contains(text(),"Add New")]',
  title: '//input[@id="title"]',
  save: '//p[@class="submit"]//input[@name="wpcf7-save"]',
  shortcode: '//input[@id="wpcf7-shortcode"]',
};

let integration_map_cf7: {
  page_url: string;
  check_cf7: (cf7_name: string) => string;
  select_cf7: (cf7_name: string) => string;
  select_list: (cf7_name: string) => string;
  override: (cf7_name: string) => string;
  select_name: (cf7_name: string) => string;
  select_email: (cf7_name: string) => string;
  save_settings: string;
  success_toast: string;
} = {
  page_url: `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/contact-forms/contact-form-7`,
  check_cf7: (cf7_name: string) =>
    `//h3[@class="title clearfix" and contains(text(), "${cf7_name}")]//input[@type="checkbox"]`,
  select_cf7: (cf7_name: string) =>
    `//h3[@class="title clearfix" and contains(text(), "${cf7_name}")]/..//div[@class="multiselect__tags"]`,
  select_list: (cf7_name: string) =>
    `//h3[@class="title clearfix" and contains(text(), "${cf7_name}")]/..//div[@class="multiselect__tags"]//input[@type="text"]`,
  override: (cf7_name: string) =>
    `//h3[@class="title clearfix" and contains(text(), "${cf7_name}")]/../form//input[@type="checkbox"]`,
  select_name: (cf7_name: string) =>
    `(//h3[@class="title clearfix" and contains(text(), "${cf7_name}")]/..//select)[1]`,
  select_email: (cf7_name: string) =>
    `(//h3[@class="title clearfix" and contains(text(), "${cf7_name}")]/..//select)[2]`,
  save_settings: `//button[contains(text(),"Save Settings")]`,
  success_toast: `//p[@class="iziToast-message slideIn"]`,
};

let integration_delete_cf7: {
  select_cf7: (cf7_name: string) => string;
  delete_toast: string;
} = {
  select_cf7: (cf7_name: string) =>
    `//a[text()="${cf7_name}"]/../../..//input[@type="checkbox"]`,
  delete_toast: '//p[text()="Contact form deleted."]',
};

let integration_woocom: { page_url: string } = {
  page_url: `${data.wordpress_site_data.url}/admin.php?page=wemail#/e-commerce/woocommerce/setup`,
};

let integration_wperp: {
  page_url: string;
  nonce_locator: string;
  crm_contact_create_page_url: string;
  contact_create_nonce_locator: string;
  contact_create_popup_nonce_locator: string;
  contact_delete_nonce_locator: string;
} = {
  page_url: `${data.wordpress_site_data.url}/admin.php?page=wemail#/integrations/c-r-m/wp-erp-crm/erp-crm-contacts`,
  nonce_locator: `#wp-api-request-js-extra`,
  crm_contact_create_page_url: `${data.wordpress_site_data.url}/admin.php?page=erp-crm&section=contact`,
  contact_create_nonce_locator: `#_wpnonce`,
  contact_create_popup_nonce_locator: `#erp-customer-new`,
  contact_delete_nonce_locator: `#erp-crm-contact-js-extra`,
};

let wp_user: {
  page_url: string;
  username: string;
  email: string;
  password: string;
  weak_password: string;
  user_notification: string;
  add_user: string;
  users_list_page_url: string;
  select_user: (username: string) => string;
} = {
  page_url: `${data.wordpress_site_data.url}/user-new.php`,
  username: "#user_login",
  email: "#email",
  password: "#pass1",
  weak_password: ".pw-checkbox",
  user_notification: "#send_user_notification",
  add_user: "#createusersub",
  users_list_page_url: `${data.wordpress_site_data.url}/users.php`,
  select_user: (username: string) =>
    `//a[text()="${username}"]/../../..//input[@type="checkbox"]`,
};

export {
  campaign_selectors,
  create_post,
  form_submit,
  integration_affiliate_actions,
  integration_create_affiliate,
  integration_create_cf7,
  integration_delete_cf7,
  integration_map_cf7,
  integration_woocom,
  integration_wperp,
  wemail_forms_selectors,
  wp_admin,
  wp_user,
};
