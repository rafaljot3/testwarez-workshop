import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import "dotenv/config";
import { baseUrl, password, user, userID } from "../helpers/data.js";

let token_response;
describe("Api tests", () => {
  it("get request", async () => {
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
        userName: "rafal1234",
        password: process.env.SECRET_PASSWORD,
      })
      .inspect();
    expect(response.statusCode).to.eql(201);
  });

  it.only("Generate token", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: password,
      })
      .inspect();
    token_response = response.body.token;
    console.log(token_response);
    expect(response.statusCode).to.eql(200);
    expect(response.body.result).to.eql("User authorized successfully.");
  });
  //   it.only("check token", async () => {
  //     console.log("another it block " + token_response);
  //   });

  it("Add a book to a user", async () => {
    const response = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      .withBearerToken(token_response)
      .withBody({
        userId: userID,
        collectionOfIsbns: [
          {
            isbn: "9781449337711",
          },
        ],
      })
      .inspect();
    expect(response.statusCode).to.eql(201);
  });

  it("Delete books from a user", async () => {
    const response = await spec()
      .delete(`${baseUrl}/Account/v1/User/` + userID)
      .withBearerToken(token_response)
      .inspect();
    expect(response.statusCode).to.eql(204);
  });

  it("Check if user has books", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/` + userID)
      .withBearerToken(token_response)
      .inspect();
    expect(response.statusCode).to.eql(200);
    //change
  });
});
