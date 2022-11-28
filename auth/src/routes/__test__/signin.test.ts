import { app } from "../../app";
import request from "supertest";

const API_URL = "/api/users/signin";
const SUCCESSFULL_EMAIL = "test@test.com";
const SUCCESSFULL_PASSWORD = "password";

it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post(API_URL)
    .send({
      email: SUCCESSFULL_EMAIL,
      password: SUCCESSFULL_PASSWORD,
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: SUCCESSFULL_EMAIL,
      password: SUCCESSFULL_PASSWORD,
    })
    .expect(201);

  await request(app)
    .post(API_URL)
    .send({
      email: SUCCESSFULL_EMAIL,
      password: "incorrectPassword",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: SUCCESSFULL_EMAIL,
      password: SUCCESSFULL_PASSWORD,
    })
    .expect(201);

  const response = await request(app)
    .post(API_URL)
    .send({
      email: SUCCESSFULL_EMAIL,
      password: SUCCESSFULL_PASSWORD,
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
