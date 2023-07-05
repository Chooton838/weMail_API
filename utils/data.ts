import { faker } from "@faker-js/faker";

let data: {
  campaign_data: {
    from_email: string;
    from_name: string;
    lists: Array<string>;
    name: string;
    segments: Array<string>;
    subject: string;
    type: string;
    version: string;
  };

  subscriber_updated_data: {
    first_name: string;
    last_name: string;
    date_of_birth: null;
    source: null;
    phone: null;
    mobile: null;
    address1: null;
    address2: null;
    city: null;
    state: null;
    country: string;
    zip: null;
    timezone: null;
    ip_address: null;
  };

  smtp_data: {
    mail_server: string;
    port: string;
    username: string;
    password: string;
  };

  defauld_sender_data: {
    from_name: string;
    from_email: string;
    reply_to_name: string;
    reply_to_email: string;
  };
} = {
  campaign_data: {
    from_email: "sqa@wedevsqa.com",
    from_name: "sqa",
    lists: [],
    name: "Automation Test Campaign",
    segments: [],
    subject: "Subject for Automation Test Campaign",
    type: "standard",
    version: "1.12.0",
  },

  subscriber_updated_data: {
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
  },

  smtp_data: {
    mail_server: "smtp.mailtrap.io",
    port: "2525",
    username: "e5af9bb2b2bac9",
    password: "04c40f93b1204c",
  },

  defauld_sender_data: {
    from_name: "sqa",
    from_email: "sqa@wedevsqa.com",
    reply_to_name: "sdet",
    reply_to_email: "sdet@weedevssqa.com",
  },
};

export { data };
