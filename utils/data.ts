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

  form_data: {
    name: string;
    type: string;
    list_id: string;
    version: string;
    template: {};
    settings: {};
  };

  updated_form_data: {
    name: string;
    list_id: string;
    version: string;
    template: {};
    settings: {};
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

  form_data: {
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
  },

  updated_form_data: {
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
  },
};

export { data };
