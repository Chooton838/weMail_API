import { APIRequestContext, expect } from "@playwright/test";

export class BasePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async response_checker(request) {
    let request_response;

    try {
      expect(request.ok()).toBeTruthy();
      return (request_response = await request.json());
    } catch (err) {
      console.log(
        `Response status code is: ${request.status()}, & status text is: ${request.statusText()}`
      );
      expect(request.ok()).toBeTruthy();
    }
  }
}
