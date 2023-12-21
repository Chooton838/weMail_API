import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";
import { BasePage } from "../utils/base_functions";

export class ListPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async list_create(list_name: string) {
    const list_create = await this.request.post(
      `${config.use?.baseURL}/v1/lists`,
      {
        data: {
          name: list_name,
          description: `${list_name} is a test list - created by automation script`, //Optional
        },
      }
    );

    let list_create_response: { data: { id: string }; message: string } = {
      data: { id: "" },
      message: "",
    };
    let list_id: string = "";

    const base = new BasePage();
    list_create_response = await base.response_checker(list_create);

    try {
      expect(list_create_response.message).toEqual(
        "List created successfully."
      );
      list_id = list_create_response.data.id;
    } catch (err) {
      console.log(list_create_response);
      expect(list_create.ok()).toBeFalsy();
    }
    return list_id;
  }

  async lists_of_list(list_id: string) {
    const lists_of_list = await this.request.get(
      `${config.use?.baseURL}/v1/lists`
    );

    let lists_of_list_response: {
      data: Array<{ id: string }>;
    } = {
      data: [{ id: "" }],
    };
    let flag: boolean = false;

    const base = new BasePage();
    lists_of_list_response = await base.response_checker(lists_of_list);

    try {
      if (lists_of_list_response.data.length > 0) {
        for (let i: number = 0; i < lists_of_list_response.data.length; i++) {
          if (lists_of_list_response.data[i].id == list_id) {
            flag = true;
            break;
          }
        }
      }
      if (flag == false) {
        console.log("Created List Not Found");
        console.log(lists_of_list_response);
        expect(lists_of_list.ok()).toBeFalsy();
      }
    } catch (err) {
      console.log(lists_of_list_response);
      expect(lists_of_list.ok()).toBeFalsy();
    }
  }

  async list_details(list_id: string) {
    const list_details = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_id}`
    );

    let list_details_response: {
      data: { id: string };
    } = {
      data: { id: "" },
    };

    const base = new BasePage();
    list_details_response = await base.response_checker(list_details);

    try {
      expect(list_details_response.data.id).toEqual(list_id);
    } catch (err) {
      console.log(list_details_response);
      expect(list_details.ok()).toBeFalsy();
    }
  }

  async list_update(list_id: string, list_name: string) {
    const list_update = await this.request.put(
      `${config.use?.baseURL}/v1/lists/${list_id}`,
      {
        data: {
          name: `Updated - ${list_name}`,
          description: `${list_name}'s description is also updated`, //Optional
        },
      }
    );

    let list_update_response: { message: string } = { message: "" };

    const base = new BasePage();
    list_update_response = await base.response_checker(list_update);

    try {
      expect(list_update_response.message).toEqual(
        "List updated successfully."
      );
    } catch (err) {
      console.log(list_update_response);
      expect(list_update.ok()).toBeFalsy();
    }
  }

  async list_delete(lists: string[]) {
    const list_delete = await this.request.post(
      `${config.use?.baseURL}/v1/lists`,
      {
        data: {
          ids: lists,
          _method: "DELETE",
        },
      }
    );

    let list_delete_response: { message: string } = { message: "" };

    const base = new BasePage();
    list_delete_response = await base.response_checker(list_delete);

    try {
      expect(list_delete_response.message).toEqual(
        "Lists deleted successfully"
      );
    } catch (err) {
      console.log(list_delete_response);
      expect(list_delete.ok()).toBeFalsy();
    }
  }

  async enable_double_opt_in(list_id: string) {
    const enable_double_opt_in = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/settings`,
      {
        data: {
          double_opt_in: { enabled: true },
          notification: {
            digest_emails: "",
            one_by_one: false,
            subscribe_emails: "",
            summery: false,
            unsubscribe_emails: "",
          },
          sync: {
            mailchimp: {
              api_key: "",
              enabled: false,
              list_id: "",
              map: [],
              webhook_id: "",
            },
          },
          fastspring: { enabled: false, tag_id: "" },
          stripe: { enabled: false, tag_id: "" },
          paypal: { enabled: false, tag_id: "" },
        },
      }
    );

    let enable_double_opt_in_response: { message: string } = { message: "" };

    const base = new BasePage();
    enable_double_opt_in_response = await base.response_checker(
      enable_double_opt_in
    );

    try {
      expect(enable_double_opt_in_response.message).toEqual(
        "List settings updated"
      );
    } catch (err) {
      console.log(enable_double_opt_in_response);
      expect(enable_double_opt_in.ok()).toBeFalsy();
    }
  }

  async tag_create(list_id: string, tag_name: string) {
    const tag_create = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/tags`,
      { data: { name: tag_name } }
    );

    let tag_create_response: { data: { id: string; name: string } } = {
      data: { id: "", name: "" },
    };
    let tag_id: string = "";

    const base = new BasePage();
    tag_create_response = await base.response_checker(tag_create);

    try {
      expect(tag_create_response.data.name).toEqual(tag_name);
      tag_id = tag_create_response.data.id;
    } catch (err) {
      console.log(tag_create_response);
      expect(tag_create.ok()).toBeFalsy();
    }

    return tag_id;
  }

  async tag_update(list_id: string, tag_id: string, tag_update_data: {}) {
    const tag_update = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/tags/${tag_id}`,
      { data: tag_update_data }
    );

    let tag_update_response: {
      data: { id: string; name: string };
      message: string;
    } = {
      data: { id: "", name: "" },
      message: "",
    };

    const base = new BasePage();
    tag_update_response = await base.response_checker(tag_update);

    try {
      expect(tag_update_response.data.id).toEqual(tag_id);
      expect(tag_update_response.message).toEqual("This tag has now updated.");
    } catch (err) {
      console.log(tag_update_response);
      expect(tag_update.ok()).toBeFalsy();
    }
  }

  async tag_assign(list_id: string, tag_id: string, subscriber_id: string) {
    const tag_assign = await this.request.put(
      `${config.use?.baseURL}/v1/subscribers/${subscriber_id}`,
      {
        data: {
          tags: {
            [list_id]: [tag_id],
          },
        },
      }
    );

    let tag_assign_response: {
      data: {
        id: string;
        lists: Array<{
          id: string;
          status: string;
          tags: Array<{ id: string }>;
        }>;
      };
    };

    const base = new BasePage();
    tag_assign_response = await base.response_checker(tag_assign);

    try {
      if (tag_id.length > 0) {
        expect(tag_assign_response.data.lists[0].tags[0].id).toEqual(tag_id);
      } else {
        expect(tag_assign_response.data.lists[0].tags.length).toEqual(0);
      }
    } catch {
      console.log(tag_assign_response);
      expect(tag_assign.ok()).toBeFalsy();
    }
  }

  async tag_delete(list_id: string, tag_id: string) {
    const tag_delete = await this.request.delete(
      `${config.use?.baseURL}/v1/lists/${list_id}/tags/${tag_id}`
    );

    let tag_delete_response: { message: string } = { message: "" };

    const base = new BasePage();
    tag_delete_response = await base.response_checker(tag_delete);

    try {
      expect(tag_delete_response.message).toEqual("This tag is now deleted.");
    } catch (err) {
      console.log(tag_delete_response);
      expect(tag_delete.ok()).toBeFalsy();
    }
  }

  async segment_create_with_tag_assign(
    list_id: string,
    tag_id: string,
    segment_name: string
  ) {
    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"

    form_data.append("name", segment_name);
    form_data.append("segment[type]", "all");
    form_data.append(
      "segment[segments][0][selectedOperator]",
      "contact_is_tagged"
    );
    form_data.append("segment[segments][0][selectedSegment]", "tags");
    form_data.append("segment[segments][0][value]", tag_id);

    const segment_create_with_tag_assign = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/segments`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form_data.toString(),
      }
    );

    let segment_create_with_tag_assign_response: {
      data: { id: string; segment: { segments: Array<{ value: string }> } };
    };
    let segment_id: string = "";

    const base = new BasePage();
    segment_create_with_tag_assign_response = await base.response_checker(
      segment_create_with_tag_assign
    );

    try {
      expect(
        segment_create_with_tag_assign_response.data.segment.segments[0].value
      ).toEqual(tag_id);
      segment_id = segment_create_with_tag_assign_response.data.id;
    } catch {
      console.log(segment_create_with_tag_assign_response);
      expect(segment_create_with_tag_assign.ok()).toBeFalsy();
    }

    return segment_id;
  }

  async segment_create_with_email_equal(
    list_id: string,
    subscriber_email: string,
    segment_name: string
  ) {
    let form_data = new URLSearchParams();
    // URLSearchParams() - Used to construct form data for requests that use the "application/x-www-form-urlencoded" as "Content-Type"

    form_data.append("name", segment_name);
    form_data.append("segment[type]", "all");
    form_data.append("segment[segments][0][selectedOperator]", "is");
    form_data.append("segment[segments][0][selectedSegment]", "email");
    form_data.append("segment[segments][0][value]", subscriber_email);

    const segment_create_with_email_equal = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/segments`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form_data.toString(),
      }
    );

    let segment_create_with_email_equal_response: {
      data: { id: string; segment: { segments: Array<{ value: string }> } };
    };
    let segment_id: string = "";

    const base = new BasePage();
    segment_create_with_email_equal_response = await base.response_checker(
      segment_create_with_email_equal
    );

    try {
      expect(
        segment_create_with_email_equal_response.data.segment.segments[0].value
      ).toEqual(subscriber_email);
      segment_id = segment_create_with_email_equal_response.data.id;
    } catch {
      console.log(segment_create_with_email_equal_response);
      expect(segment_create_with_email_equal.ok()).toBeFalsy();
    }

    return segment_id;
  }

  async segment_update(
    list_id: string,
    segment_id: string,
    updated_segment_name: string
  ) {
    const segment_update = await this.request.put(
      `${config.use?.baseURL}/v1/lists/${list_id}/segments/${segment_id}`,
      { data: { name: updated_segment_name } }
    );

    let segment_update_response: { message: string; segment: { id: string } };

    const base = new BasePage();
    segment_update_response = await base.response_checker(segment_update);

    try {
      expect(segment_update_response.segment.id).toEqual(segment_id);
      expect(segment_update_response.message).toEqual("Segment updated!");
    } catch {
      console.log(segment_update_response);
      expect(segment_update.ok()).toBeFalsy();
    }
  }

  async filter_segmented_subscribers(
    list_id: string,
    segment_id: string,
    subscriber_id: string
  ) {
    const filter_segmented_subscribers = await this.request.get(
      `${config.use?.baseURL}/v1/lists/${list_id}/subscribers?segment=${segment_id}`
    );

    let filter_segmented_subscribers_response: { data: Array<{ id: string }> };

    const base = new BasePage();
    filter_segmented_subscribers_response = await base.response_checker(
      filter_segmented_subscribers
    );

    let counter: number = 0;

    try {
      if (filter_segmented_subscribers_response.data.length > 0) {
        for (
          let i: number = 0;
          i < filter_segmented_subscribers_response.data.length;
          i++
        ) {
          if (
            filter_segmented_subscribers_response.data[i].id == subscriber_id
          ) {
            counter = 1;
            break;
          }
        }
      }
    } catch {
      console.log(filter_segmented_subscribers_response);
      expect(filter_segmented_subscribers.ok()).toBeFalsy();
    }

    return counter;
  }

  async segment_delete(segment_id: string) {
    const segment_delete = await this.request.delete(
      `${config.use?.baseURL}/v1/segments/${segment_id}`
    );

    let segment_delete_response: { message: string };

    const base = new BasePage();
    segment_delete_response = await base.response_checker(segment_delete);

    try {
      expect(segment_delete_response.message).toEqual("Segment deleted");
    } catch {
      console.log(segment_delete_response);
      expect(segment_delete.ok()).toBeFalsy();
    }
  }

  async create_custom_field(
    list_id: string,
    custom_field_create_data: {
      title: string;
      slug: string;
      type: string;
      meta: { options: Array<string> };
    }
  ) {
    const create_custom_field = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/fields`,
      {
        data: custom_field_create_data,
      }
    );

    let create_custom_field_response: {
      data: { list_id: string; title: string; slug: string };
    };

    const base = new BasePage();
    create_custom_field_response = await base.response_checker(
      create_custom_field
    );

    try {
      expect(create_custom_field_response.data.list_id).toEqual(list_id);
      expect(create_custom_field_response.data.slug).toEqual(
        custom_field_create_data.slug
      );
    } catch {
      console.log(create_custom_field_response);
      expect(create_custom_field.ok()).toBeFalsy();
    }
  }

  async update_custom_field(
    list_id: string,
    custom_field_data: {
      title: string;
      slug: string;
      type: string;
      meta: { options: Array<string> };
    },
    custom_field_options_new_value: string
  ) {
    custom_field_data.meta.options.push(custom_field_options_new_value);

    const update_custom_field = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/fields/${custom_field_data.slug}`,
      {
        data: {
          title: custom_field_data.title,
          slug: custom_field_data.slug,
          type: custom_field_data.type,
          meta: custom_field_data.meta,
          _method: "patch",
          list_id: list_id,
        },
      }
    );

    let update_custom_field_response: {
      data: { list_id: string; meta: { options: Array<string> } };
    };

    const base = new BasePage();
    update_custom_field_response = await base.response_checker(
      update_custom_field
    );

    try {
      expect(update_custom_field_response.data.list_id).toEqual(list_id);
      expect(update_custom_field_response.data.meta.options.pop()).toEqual(
        custom_field_options_new_value
      );
    } catch {
      console.log(update_custom_field_response);
      expect(update_custom_field.ok()).toBeFalsy();
    }
  }

  async assign_custom_field(
    list_id: string,
    subscriber_id: string,
    custom_field_slug: string,
    custom_field_meta_options: Array<string>
  ) {
    const assign_custom_field = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/subscribers/${subscriber_id}/fields/${custom_field_slug}`,
      {
        data: {
          _method: "PATCH",
          value: custom_field_meta_options,
        },
      }
    );

    let assign_custom_field_response: {
      data: { id: string; fields: { [key: string]: [string[]] } };
    };

    const base = new BasePage();
    assign_custom_field_response = await base.response_checker(
      assign_custom_field
    );

    try {
      expect(assign_custom_field_response.data.id).toEqual(list_id);
      for (let key in assign_custom_field_response.data.fields) {
        if (assign_custom_field_response.data.fields.hasOwnProperty(key)) {
          expect(assign_custom_field_response.data.fields[key]).toEqual(
            custom_field_meta_options
          );
        }
      }
    } catch {
      console.log(assign_custom_field_response);
      expect(assign_custom_field.ok()).toBeFalsy();
    }
  }

  async unassign_custom_field(
    list_id: string,
    subscriber_id: string,
    custom_field_slug: string
  ) {
    const unassign_custom_field = await this.request.post(
      `${config.use?.baseURL}/v1/lists/${list_id}/subscribers/${subscriber_id}/fields/${custom_field_slug}`,
      {
        data: {
          _method: "PATCH",
          value: [],
        },
      }
    );

    let unassign_custom_field_response: {
      data: { id: string; fields: { [key: string]: [string[]] } };
    };

    const base = new BasePage();
    unassign_custom_field_response = await base.response_checker(
      unassign_custom_field
    );

    try {
      expect(unassign_custom_field_response.data.id).toEqual(list_id);
      for (let key in unassign_custom_field_response.data.fields) {
        if (unassign_custom_field_response.data.fields.hasOwnProperty(key)) {
          expect(
            unassign_custom_field_response.data.fields[key].length
          ).toEqual(0);
        }
      }
    } catch {
      console.log(unassign_custom_field_response);
      expect(unassign_custom_field.ok()).toBeFalsy();
    }
  }

  async delete_custom_field(list_id: string, custom_field_slug: string) {
    const delete_custom_field = await this.request.delete(
      `${config.use?.baseURL}/v1/lists/${list_id}/fields/${custom_field_slug}`
    );

    let delete_custom_field_response: {
      data: { list_id: string };
    };

    const base = new BasePage();
    delete_custom_field_response = await base.response_checker(
      delete_custom_field
    );

    try {
      expect(delete_custom_field_response.data.list_id).toEqual(list_id);
    } catch {
      console.log(delete_custom_field_response);
      expect(delete_custom_field.ok()).toBeFalsy();
    }
  }
}
