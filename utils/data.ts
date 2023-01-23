let base_url: string = "https://api.getwemail.io";

let campaign_data: { from_email: string, from_name: string, lists: Array<string>, name: string, segments: Array<string>, subject: string, type: string, version: string } = {
    from_email: "choton838@gmail.com",
    from_name: "Wedevs QA",
    lists: ["ad21601c-b4e2-4e1d-af75-fe68e36183f0"],
    name: "Automation Test Campaign 3",
    segments: [],
    subject: "Subject for Automation Test Campaign",
    type: "standard",
    version: "1.12.0",
};

export { base_url, campaign_data };
