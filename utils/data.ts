import { faker } from "@faker-js/faker";

let base_url: string = "https://api.getwemail.io";

let campaign_data: {
  from_email: string;
  from_name: string;
  lists: Array<string>;
  name: string;
  segments: Array<string>;
  subject: string;
  type: string;
  version: string;
} = {
  from_email: "choton838@gmail.com",
  from_name: "Wedevs QA",
  lists: [],
  name: "Automation Test Campaign",
  segments: [],
  subject: "Subject for Automation Test Campaign",
  type: "standard",
  version: "1.12.0",
};

let subscriber_updated_data = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  date_of_birth: null,
  source: null,
  phone: null,
  mobile: null,
  address1: null,
  address2: null,
  city: null,
  state: null,
  country: "BD",
  zip: null,
  timezone: null,
  ip_address: null,
};

export { base_url, campaign_data, subscriber_updated_data };
