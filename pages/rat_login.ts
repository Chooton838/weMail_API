import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class Rat_LoginPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(username: string, password: string) {
    const loginRequest = await this.request.post(
      `${config.use?.baseURL}/v1/onboarding/login`,
      {
        data: {
          email: username,
          password: password,
        },
      }
    );

    let loginResponseData: {
      data: {
        user: { email: string };
      };
      meta: { token: string };
    } = {
      data: {
        user: { email: "" },
      },
      meta: { token: "" },
    };

    try {
      expect(loginRequest.ok()).toBeTruthy();
      loginResponseData = await loginRequest.json();
    } catch (err) {
      console.log(`Status is: ${loginRequest.status()}`);
      console.log(`Status Text is: ${loginRequest.statusText()}`);
    }

    //Validate and save Bearer
    try {
      expect(loginResponseData.data.user.email).toEqual(username);
      config.use!.extraHTTPHeaders!.authorization = `Bearer ${loginResponseData.meta.token}`;
    } catch (err) {
      console.log("Login auth Failed");
      console.log(`Response Data is: ${loginResponseData}`);
      expect(loginRequest.ok()).toBeFalsy();
    }
  }
}
