import { faker } from "@faker-js/faker";

let list_data: {
  list_id: string;
  list_name: () => string;
} = {
  list_id: "",
  list_name: () => faker.lorem.words(2),
};

let tag_data: {
  tag_id: string;
  tag_name: () => string;
} = {
  tag_id: "",
  tag_name: () => faker.lorem.words(1),
};

let segment_data: {
  segment_id: string;
  segment_name: () => string;
} = {
  segment_id: "",
  segment_name: () => faker.lorem.words(1),
};

let subscriber_data: {
  subscriber_id: string;
  subscriber_email: () => string;
  unsubscribed_subscriber_email: () => string;
  segmented_subscriber_email: () => string;
  tagged_subscriber_email: () => string;
} = {
  subscriber_id: "",
  subscriber_email: () => faker.internet.email().toLowerCase(),
  unsubscribed_subscriber_email: () => faker.internet.email().toLowerCase(),
  segmented_subscriber_email: () => faker.internet.email().toLowerCase(),
  tagged_subscriber_email: () => faker.internet.email().toLowerCase(),
};

let subscriber_updated_data: {
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
} = {
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

let smtp_data: {
  mail_server: string;
  port: string;
  username: string;
  password: string;
} = {
  mail_server: "smtp.mailtrap.io",
  port: "2525",
  username: "e5af9bb2b2bac9",
  password: "04c40f93b1204c",
};

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
  from_email: "qa@wedevsqa.com",
  from_name: "qa",
  lists: [],
  name: "",
  segments: [],
  subject: "Subject for Automation Test Campaign",
  type: "standard",
  version: "1.12.0",
};

let defauld_sender_data: {
  from_name: string;
  from_email: string;
  reply_to_name: string;
  reply_to_email: string;
} = {
  from_name: "sqa",
  from_email: "sqa@wedevsqa.com",
  reply_to_name: "sdet",
  reply_to_email: "sdet@weedevssqa.com",
};

let form_data: {
  name: string;
  type: string;
  list_id: string;
  version: string;
  template: {};
  settings: {};
} = {
  name: "",
  type: "",
  list_id: "",
  version: "1.13.1",
  template: {
    type: "inline",
    modalTriggerButton: {
      label: "Subscribe",
      position: "left",
      size: "auto",
      style: {
        backgroundColor: "#0085ba",
        color: "#ffffff",
        border: "1px solid #0073aa",
        borderRadius: "3px",
        padding: "8px 14px 8px 14px",
      },
    },
    floatingBar: {
      position: "bottom",
      align: "center",
    },
    floatingBox: {
      position: "bottom-right",
    },
    modal: {
      size: "default",
    },
    layout: "box",
    label: {
      position: "hidden",
      align: "left",
    },
    cross: {
      style: {
        top: "9",
        right: "10",
        border: "0px solid ",
        background: "#555353",
        height: "28",
        width: "28",
        borderRadius: "12%",
        padding: "3px 3px 3px 3px",
      },
      fill: "#fff",
    },
    fields: [
      {
        id: 1,
        type: "column",
        label: "Column",
        icon: "columns",
        columns: [4, 8],
        fields: {
          "0": [
            {
              id: 2,
              type: "html",
              label: "TinyMCE",
              icon: "font",
              html: '\n                                <p><span style="color: #9772f6; font-size: 18px;">Introduction</span></p>\n                                <h1><span style="font-size: 45px;"><strong><span style="font-family: arial, helvetica, sans-serif;">Leadership Training</span></strong></span></h1>\n                                <p><span style="color: #949bb5;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.</span></p>\n                            ',
              style: {
                fontSize: "14px",
                marginBottom: "0",
              },
            },
            {
              id: 3,
              type: "firstName",
              label: "First Name",
              icon: "text-width",
              placeholder: "Name",
              required: true,
              requiredMessage: "The first name field is required.",
              style: {
                marginBottom: "0",
              },
            },
            {
              id: 4,
              type: "email",
              label: "Email",
              icon: "envelope-open-o",
              placeholder: "Email",
              required: true,
              requiredMessage: "This email field is required.",
              email: true,
              emailMessage: "That email is invalid.",
              style: {
                marginBottom: "",
              },
            },
            {
              id: 5,
              type: "button",
              label: "Button",
              icon: "paper-plane-o",
              text: "Join Today",
              style: {
                padding: "10px 15px 10px 15px",
                margin: "0px 0px 0px 0px",
                color: "#fff",
                background: "#895EFF",
                display: "inline-block",
                border: "0px solid #0073aa",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "normal",
              },
              parentStyle: {
                textAlign: "left",
              },
              attrs: {
                classNames: "submit-button",
                type: "submit",
              },
            },
          ],
          "1": [
            {
              id: 7,
              type: "image",
              label: "Image",
              icon: "picture-o",
              src: "https://cdn-staging.getwemail.io/images/forms/leadership-training.svg",
              alt: null,
              style: {
                borderRadius: "0%",
                maxWidth: "100%",
                border: "0px solid #ddd",
                padding: "5px 5px 5px 5px",
                background: "transparent",
                display: "inline-block",
                backgroundColor: "transparent",
              },
              outerStyle: {
                textAlign: "center",
              },
            },
          ],
        },
        rowStyle: {
          alignItems: "center",
          padding: "0px 0px 0px 0px",
          margin: "0px -10px 0px -10px",
          background: "transparent",
        },
      },
    ],
    style: {
      background: "#fff",
      color: "#444",
      border: "0px solid #ddd",
      padding: "20px 20px 20px 20px",
      borderRadius: "0%",
    },
  },
  settings: {
    onSubmit: "show_message",
    message: "Thanks for signing up!",
    redirectTo: "",
    displayMode: "duration",
    modalTrigger: "button",
    openingAnimation: "fade",
    scheduleFrom: "2023-07-07",
    scheduleTo: "2023-07-07",
    scrollAfter: 0,
    showAfter: 0,
    showPage: "home",
    when: "always",
    who: "all_users",
    retargetingOption: {
      onesClose: false,
      onesCloseName: 1,
      onesShowName: 1,
      onesShown: false,
      onesSubmit: false,
      onesSubmitName: 1,
    },
  },
};

let updated_form_data: {
  name: string;
  list_id: string;
  version: string;
  template: {};
  settings: {};
} = {
  name: "",
  list_id: "",
  version: "1.13.1",
  template: {
    type: "inline",
    modalTriggerButton: {
      label: "Subscribe",
      position: "left",
      size: "auto",
      style: {
        backgroundColor: "#0085ba",
        color: "#ffffff",
        border: "1px solid #0073aa",
        borderRadius: "3px",
        padding: "8px 14px 8px 14px",
      },
    },
    floatingBar: {
      position: "bottom",
      align: "center",
    },
    floatingBox: {
      position: "bottom-right",
    },
    modal: {
      size: "default",
    },
    layout: "box",
    label: {
      position: "hidden",
      align: "left",
    },
    cross: {
      style: {
        top: "9",
        right: "10",
        border: "0px solid ",
        background: "#555353",
        height: "28",
        width: "28",
        borderRadius: "12%",
        padding: "3px 3px 3px 3px",
      },
      fill: "#fff",
    },
    fields: [
      {
        id: 1,
        type: "column",
        label: "Column",
        icon: "columns",
        columns: [4, 8],
        fields: {
          "0": [
            {
              id: 2,
              type: "html",
              label: "TinyMCE",
              icon: "font",
              html: '\n                                <p><span style="color: #9772f6; font-size: 18px;">Introduction</span></p>\n                                <h1><span style="font-size: 45px;"><strong><span style="font-family: arial, helvetica, sans-serif;">Leadership Training</span></strong></span></h1>\n                                <p><span style="color: #949bb5;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.</span></p>\n                            ',
              style: {
                fontSize: "14px",
                marginBottom: "0",
              },
            },
            {
              id: 3,
              type: "firstName",
              label: "First Name",
              icon: "text-width",
              placeholder: "Name",
              required: true,
              requiredMessage: "The first name field is required.",
              style: {
                marginBottom: "0",
              },
            },
            {
              id: 4,
              type: "email",
              label: "Email",
              icon: "envelope-open-o",
              placeholder: "Email",
              required: true,
              requiredMessage: "This email field is required.",
              email: true,
              emailMessage: "That email is invalid.",
              style: {
                marginBottom: "",
              },
            },
            {
              id: 5,
              type: "button",
              label: "Button",
              icon: "paper-plane-o",
              text: "Join Today",
              style: {
                padding: "10px 15px 10px 15px",
                margin: "0px 0px 0px 0px",
                color: "#fff",
                background: "#895EFF",
                display: "inline-block",
                border: "0px solid #0073aa",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "normal",
              },
              parentStyle: {
                textAlign: "left",
              },
              attrs: {
                classNames: "submit-button",
                type: "submit",
              },
            },
          ],
          "1": [
            {
              id: 7,
              type: "image",
              label: "Image",
              icon: "picture-o",
              src: "https://cdn-staging.getwemail.io/images/forms/leadership-training.svg",
              alt: null,
              style: {
                borderRadius: "0%",
                maxWidth: "100%",
                border: "0px solid #ddd",
                padding: "5px 5px 5px 5px",
                background: "transparent",
                display: "inline-block",
                backgroundColor: "transparent",
              },
              outerStyle: {
                textAlign: "center",
              },
            },
          ],
        },
        rowStyle: {
          alignItems: "center",
          padding: "0px 0px 0px 0px",
          margin: "0px -10px 0px -10px",
          background: "transparent",
        },
      },
    ],
    style: {
      background: "#fff",
      color: "#444",
      border: "0px solid #ddd",
      padding: "20px 20px 20px 20px",
      borderRadius: "0%",
    },
  },
  settings: {
    onSubmit: "show_message",
    message: "Thanks for signing up!",
    redirectTo: "",
    displayMode: "duration",
    modalTrigger: "button",
    openingAnimation: "fade",
    scheduleFrom: "2023-07-07",
    scheduleTo: "2023-07-07",
    scrollAfter: 0,
    showAfter: 0,
    showPage: "home",
    when: "always",
    who: "all_users",
    retargetingOption: {
      onesClose: false,
      onesCloseName: 1,
      onesShowName: 1,
      onesShown: false,
      onesSubmit: false,
      onesSubmitName: 1,
    },
  },
};

let wordpress_site_data: { url: string; username: string; password: string } =
  process.env.STAGING === "1"
    ? {
        url: process.env.STAGING_WP_SITE_URL!,
        username: process.env.STAGING_WP_SITE_USER_NAME!,
        password: process.env.STAGING_WP_SITE_USER_PASSWORD!,
      }
    : {
        url: process.env.WP_SITE_URL!,
        username: process.env.WP_SITE_USER_NAME!,
        password: process.env.WP_SITE_USER_PASSWORD!,
      };

let welcome_automation_create_data: {
  template: string;
  name: string;
  triggers: [
    {
      name: string;
      icon: string;
      title: string;
      description: string;
      payload: {
        list_id: string;
        rejoin: boolean;
      };
    }
  ];
  steps: {}[];
} = {
  template: "welcome-message",
  name: "",
  triggers: [
    {
      name: "SubscriberJoin",
      icon: "https://cdn-staging.getwemail.io/images/automation/triggers/subscriber-join.svg",
      title: "When subscriber joins a list",
      description: "Automation triggers when a new subscriber joins a list",
      payload: {
        list_id: "",
        rejoin: true,
      },
    },
  ],
  steps: [
    {
      _name: "Delay",
      type: "minutes",
      offset: 1,
      _index: 0,
    },
    {
      _name: "SendEmail",
      mail: {
        name: "Untitled",
        pre_header: null,
        subject: "Subject: Untitled",
        from_name: null,
        from_email: null,
        different_reply: false,
        reply_to_name: null,
        reply_to_email: null,
      },
      _index: 1,
    },
  ],
};

let specific_product_purchase_automation_create_data: {
  template: string;
  name: string;
  triggers: [
    {
      name: string;
      icon: string;
      title: string;
      description: string;
      payload: {
        criteria: string;
        ids: number[];
      };
    }
  ];
  steps: {}[];
} = {
  template: "product-purchase",
  name: "",
  triggers: [
    {
      name: "PurchaseProduct",
      icon: "https://cdn-staging.getwemail.io/images/automation/triggers/purchase-product.svg",
      title: "When subscriber purchases a product",
      description: "Automation triggers when a new subscriber purchases a product",
      payload: {
        criteria: "specific_products",
        ids: [],
      },
    },
  ],
  steps: [
    {
      _name: "Delay",
      type: "minutes",
      offset: 1,
      _index: 0,
    },
    {
      _name: "SendEmail",
      mail: {
        name: "Untitled",
        pre_header: null,
        subject: "Subject: Untitled",
        from_name: null,
        from_email: null,
        different_reply: false,
        reply_to_name: null,
        reply_to_email: null,
      },
      _index: 1,
    },
  ],
};

let affiliate_integration_data: {
  key: string;
  token: string;
  list: string;
  sync_existing_data: boolean;
  rest_url: string;
  is_affiliate_enabled: boolean;
} =
  process.env.STAGING === "1"
    ? {
        key: process.env.STAGING_affiliate_wp_public_key!,
        token: process.env.STAGING_affiliate_wp_token!,
        list: "",
        sync_existing_data: true,
        rest_url: "",
        is_affiliate_enabled: true,
      }
    : {
        key: process.env.affiliate_wp_public_key!,
        token: process.env.affiliate_wp_token!,
        list: "",
        sync_existing_data: true,
        rest_url: "",
        is_affiliate_enabled: true,
      };

let rest_url: string = wordpress_site_data.url.substring(0, wordpress_site_data.url.lastIndexOf("/wp-admin")) + "/wp-json";

let woocom_rest_api: { consumer_key: string; consumer_secret: string } =
  process.env.STAGING === "1"
    ? {
        consumer_key: process.env.STAGING_wcom_Consumer_key!,
        consumer_secret: process.env.STAGING_wcom_Consumer_secret!,
      }
    : {
        consumer_key: process.env.wcom_Consumer_key!,
        consumer_secret: process.env.wcom_Consumer_secret!,
      };

let woocom_order_data: {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: [
    {
      product_id: number;
      quantity: number;
    }
  ];
} = {
  payment_method: "cod",
  payment_method_title: "Cash On Delivery",
  set_paid: false,
  billing: {
    first_name: "John",
    last_name: "Doe",
    address_1: "969 Market",
    address_2: "",
    city: "San Francisco",
    state: "CA",
    postcode: "94103",
    country: "US",
    email: "",
    phone: "(555) 555-5555",
  },
  shipping: {
    first_name: "John",
    last_name: "Doe",
    address_1: "969 Market",
    address_2: "",
    city: "San Francisco",
    state: "CA",
    postcode: "94103",
    country: "US",
  },
  line_items: [
    {
      product_id: 0,
      quantity: 1,
    },
  ],
};

export {
  affiliate_integration_data,
  campaign_data,
  defauld_sender_data,
  form_data,
  list_data,
  rest_url,
  segment_data,
  smtp_data,
  specific_product_purchase_automation_create_data,
  subscriber_data,
  subscriber_updated_data,
  tag_data,
  updated_form_data,
  welcome_automation_create_data,
  woocom_order_data,
  woocom_rest_api,
  wordpress_site_data,
};
