import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class GatewayPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async connect_gateway(
    gateway: string,
    configure_data: {
      mail_server: string;
      password: string;
      port: string;
      username: string;
    }
  ) {
    let driver: string = gateway;
    let gateway_data: {} = {};

    switch (driver) {
      case "smtp":
        gateway_data = {
          debug: false,
          driver: "smtp",
          //   elasticemail: { apiKey: null, limit: 3600 },
          //   log: { limit: 3600 },
          //   mailgun: {
          //     domain: null,
          //     secret: null,
          //     endpoint: "api.mailgun.net",
          //     limit: 3600,
          //   },
          //   pepipost: { domain: null, apiKey: null, limit: 3600 },
          //   postmark: {
          //     key: null,
          //     account_api_token: null,
          //     limit: 3600,
          //     batch_send: false,
          //   },
          //   sendgrid: { key: null, limit: 3600 },
          //   sendinblue: { key: null, limit: 3600 },
          //   ses: { key: null, secret: null, region: "us-east-1", limit: 3600 },
          smtp: {
            bounce_config: { driver: null },
            encryption: null,
            host: configure_data.mail_server,
            is_handled_bounce: false,
            limit: 3600,
            password: configure_data.password,
            port: configure_data.port,
            username: configure_data.username,
          },
          //   sparkpost: { secret: null, limit: 3600 },
        };
        break;
      default:
        gateway_data = {};
        break;
    }

    const connect_gateway = await this.request.post(
      `${config.use?.baseURL}/v1/settings/email-outbound`,
      {
        data: gateway_data,
      }
    );

    let connect_gateway_response: { message: string } = { message: "" };

    const base = new BasePage(this.request);
    connect_gateway_response = await base.response_checker(connect_gateway);

    try {
      expect(connect_gateway_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log(connect_gateway_response);
      expect(connect_gateway.ok()).toBeFalsy();
    }
  }

  async set_default_Form_Reply(
    gateway: string,
    configure_data: {
      from_name: string;
      from_email: string;
      reply_to_name: string;
      reply_to_email: string;
    }
  ) {
    const set_default_Form_Reply = await this.request.post(
      `${config.use?.baseURL}/v1/settings/email-default-settings`,
      {
        data: {
          from_name: configure_data.from_name,
          from_email: configure_data.from_email,
          reply_to_name: configure_data.reply_to_name,
          reply_to_email: configure_data.reply_to_email,
          selected_driver: gateway,
        },
      }
    );

    let set_default_Form_Reply_response: { message: string } = { message: "" };

    const base = new BasePage(this.request);
    set_default_Form_Reply_response = await base.response_checker(
      set_default_Form_Reply
    );

    try {
      expect(set_default_Form_Reply_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log(set_default_Form_Reply_response);
      expect(set_default_Form_Reply.ok()).toBeFalsy();
    }
  }
}
