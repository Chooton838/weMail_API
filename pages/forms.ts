import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class FormPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async form_create(list_id: string) {
    const form_create = await this.request.post(
      `${config.use?.baseURL}/v1/forms`,
      {
        data: {
          list_id: list_id,
          name: "Basic",
          //   slug: "basic-inline",
          type: "inline",
          version: "1.13.1",
          settings: {
            displayMode: "duration",
            message: "Thanks for signing up!",
            modalTrigger: "button",
            onSubmit: "show_message",
            openingAnimation: "fade",
            redirectTo: "",
            retargetingOption: {
              onesClose: false,
              onesCloseName: 1,
              onesShowName: 1,
              onesShown: false,
              onesSubmit: false,
              onesSubmitName: 1,
              scheduleFrom: "2023-07-05",
              scheduleTo: "2023-07-05",
              scrollAfter: 0,
              showAfter: 0,
              showPage: "home",
              when: "always",
              who: "all_users",
            },
          },
        },
      }
    );

    let form_create_response;

    const base = new BasePage(this.request);
    form_create_response = await base.response_checker(form_create);

    try {
      console.log(form_create_response);
      //   expect(set_default_Form_Reply_response.message).toEqual(
      //     "Settings saved successfully."
      //   );
    } catch (err) {
      console.log(form_create_response);
      expect(form_create.ok()).toBeFalsy();
    }
  }
}
