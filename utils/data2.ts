import { faker } from "@faker-js/faker";


/**----Data set for Integrations: All----*/

let wp_forms_integration: {
  list_id: string;
  list_name: string;
  wp_forms_id: string;
  wp_forms_name: string;
  subscriber_id: string;
  form_subscriber_email: string;
  form_subscriber_name: string;
  wp_forms_shortcode: string;
  wp_form_page_name: string;
} = {
  list_id: "",
  list_name: "",
  wp_forms_id: "",
  wp_forms_name: "",
  subscriber_id: "",
  form_subscriber_email: "",
  form_subscriber_name: "",
  wp_forms_shortcode: "",
  wp_form_page_name: "",
};


let ninja_forms_integration: {
  list_id: string;
  list_name: string;
  ninja_forms_id: string;
  ninja_forms_name: string;
  subscriber_id: string;
  form_subscriber_email: string;
  form_subscriber_name: string;
  ninja_forms_shortcode: string;
  ninja_form_page_name: string;
} = {
  list_id: "",
  list_name: `[QA] ${faker.lorem.words(2)}`,
  ninja_forms_id: "",
  ninja_forms_name: `[QA]${faker.lorem.words(2)}`,
  subscriber_id: "",
  form_subscriber_name: faker.name.firstName(),
  form_subscriber_email: "",
  ninja_forms_shortcode: "",
  ninja_form_page_name: "[QA] NinjaForm",
};



export {
  wp_forms_integration,
  ninja_forms_integration,
};
