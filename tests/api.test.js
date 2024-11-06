import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import "dotenv/config";
import { baseUrl } from "../helpers/data.js";
import { userName } from "../helpers/data.js";

describe("Api tests", () => {
  it.only("get request", async () => {
    const response = await spec()
      .get(`${baseUrl}/BookStore/v1/Books`)
      .inspect();
    const resp = JSON.stringify(response.body);
    console.log("dotenv working:" + process.env.SECRET_PASSWORD);
    expect(response.statusCode).to.eql(200);
    expect(response.body.books[4].title).to.eql("You Don't Know JS");
    expect(resp).to.include("Kyle Simpson");
  });
  it("Create user", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)
      .withBody({
        userName: userName,
        password: process.env.SECRET_PASSWORD,
      })
      .inspect();
    expect(response.statusCode).to.eql(201);
    //bf15a962-ef85-4c35-9620-b29324ee4650
  });
});
