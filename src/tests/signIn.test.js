//File for unit test scripts

const app = require("../../app");
const request = require("supertest");

describe("POST /user/signin", () => {
    test("(Correct input) Should respond with a 200 status code.", async () => {
      const response = await request(app)
        .post("/user/signin")
        .set("Accept", "application/json")
        .send({
          "email": "newsample1234@test.com",
          "password": "tEST##233",
        });
      expect(response.statusCode).toBe(200);
      expect(response.type).toEqual('application/json');
    });
    test("(Wrong email format) Should respond with a 400 status code.", async () => {
      const response = await request(app)
        .post("/user/signin")
        .set("Accept", "application/json")
        .send({
          "email": "newsampletest.com",
          "password": "tEST##233",
        });
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
    });
    test("(Wrong Password) Should respond with a 400 status code.", async () => {
      const response = await request(app)
        .post("/user/signin")
        .set("Accept", "application/json")
        .send({
          "email": "newsample@test.com",
          "password": "tEST233",
        });
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
    });
    test("(Wrong JSON key) Should respond with a 400 status code.", async () => {
      const response = await request(app)
        .post("/user/signin")
        .set("Accept", "application/json")
        .send({
          "qmail": "newsample@test.com",
          "password": "tEST##233",
        });
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
    });
});
