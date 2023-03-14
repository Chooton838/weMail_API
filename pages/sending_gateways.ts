import { APIRequestContext, expect } from "@playwright/test";
import { data } from "../utils/data";

export class GatewayPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async connect_gateway(gateway, configure_data) {
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
      `${data.base_url}/v1/settings/email-outbound`,
      {
        data: gateway_data,
      }
    );

    let connect_gateway_response: { message: string } = { message: "" };

    expect(connect_gateway.ok()).toBeTruthy();

    try {
      connect_gateway_response = await connect_gateway.json();
      expect(connect_gateway_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log("Error is: ", connect_gateway.statusText());
    }
  }

  async set_default_Form_Reply(gateway, configure_data) {
    const set_default_Form_Reply = await this.request.post(
      `${data.base_url}/v1/settings/email-default-settings`,
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

    expect(set_default_Form_Reply.ok()).toBeTruthy();

    try {
      set_default_Form_Reply_response = await set_default_Form_Reply.json();
      expect(set_default_Form_Reply_response.message).toEqual(
        "Settings saved successfully."
      );
    } catch (err) {
      console.log("Error is: ", set_default_Form_Reply.statusText());
    }
  }
}
