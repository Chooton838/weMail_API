import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";
import { data } from "../utils/data";
import * as fs from "fs";

export class Rat_IntegrationsPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  //Integration Forms
  //Contact Forms

  //Contact Forms 7
  async setup_Contact_Forms_7(list_id: string) {
    //Get Login Cookie
    let cookieData = fs.readFileSync("state.json", "utf8");
    console.log(cookieData);

    try {
      const parsedData = JSON.parse(cookieData);

      // Concatenate the cookie name and value for each cookie into the desired format
      const concatenatedCookie = parsedData.cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      //const concatenatedCookieAll = `${concatenatedCookie}; __stripe_mid=1d99d362-c6a6-4edb-8586-05f86e8a412ee00b44; tk_ai=woo%3AxZh%2FzAGyVqNe3uDXVimJ8q3C`;

      console.log("Concatenated Cookie:", concatenatedCookie);
      //console.log("Concatenated Cookie:", concatenatedCookieAll);

      //Updated URL
      let url = `${data.wordpress_site_data[0]}`;
      console.log(url);

      let modifiedUrl = url.replace("wp-admin", "wp-json");
      console.log(modifiedUrl);

      const payload = {
        settings: [[["763077"], [`${list_id}`], [true], [[["full_name"], ["email"]]]]],
      };

      const setup_Contact_Forms_7_Request = await this.request.post(
        `${modifiedUrl}/wemail/v1/forms/integrations/contact-form-7`,
        {
          headers: {
            Cookie: concatenatedCookie,
          },
          data: payload,
        }
      );

      console.log(`Status is: ${setup_Contact_Forms_7_Request.status()}`)
      console.log(`StatusText is: ${setup_Contact_Forms_7_Request.statusText()}`)

    } catch (error) {
      console.error("Error reading or parsing the state.json file:", error);
    }

    let setup_Contact_Forms_7_Response: {
      message: string;
    } = {
      message: "",
    };
    
  
  }


}
