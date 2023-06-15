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
    from_email: "choton838@gmail.com",
    from_name: "Wedevs QA",
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
    username: "a4424883743930",
    password: "49ef2f7b688b3e",
  },

  defauld_sender_data: {
    from_name: "info",
    from_email: "info@gmail.com",
    reply_to_name: "info",
    reply_to_email: "info@gmail.com",
  },
};

export { data };
