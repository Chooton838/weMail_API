import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { base_url } from "../utils/data";

export class LoginPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email, password) {
    const login = await this.request.post(`${base_url}/v1/onboarding/login`, {
      data: {
        email: email,
        password: password,
      },
    });

    expect(login.ok()).toBeTruthy();

    let login_response: { meta: { token: string } } = { meta: { token: "" } };

    try {
      login_response = await login.json();
      config.use!.extraHTTPHeaders!.authorization = `Bearer ${login_response.meta.token}`;
    } catch (err) {
      console.log("Error is: ", login.statusText());
    }
  }
}
