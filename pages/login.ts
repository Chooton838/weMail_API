import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class LoginPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(login_data: { username: string; password: string }) {
    const login = await this.request.post(
      `${config.use?.baseURL}/v1/onboarding/login`,
      {
        data: {
          email: login_data.username,
          password: login_data.password,
        },
      }
    );

    let login_response: {
      data: { user: { email: string } };
      meta: { token: string };
    } = {
      data: { user: { email: "" } },
      meta: { token: "" },
    };

    const base = new BasePage();
    login_response = await base.response_checker(login);

    try {
      expect(login_response.data.user.email).toEqual(login_data.username);
      config.use!.extraHTTPHeaders!.authorization = `Bearer ${login_response.meta.token}`;
    } catch (err) {
      console.log("User authentication is failed");
      console.log(login_response);
      expect(login.ok()).toBeFalsy();
    }
  }
}
