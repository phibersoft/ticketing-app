import request from "supertest";

import { app } from "../../app";

const API_URL = "/api/users/signup";
const SUCCESSFULL_EMAIL = "test@test.com";
const SUCCESSFULL_PASSWORD = "password";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post(API_URL)
    .send({
      email: SUCCESSFULL_EMAIL,
      password: SUCCESSFULL_PASSWORD,
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post(API_URL)
    .send({
      email: "test",
      password: SUCCESSFULL_PASSWORD,
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post(API_URL)
    .send({
      email: SUCCESSFULL_EMAIL,
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post(API_URL)
    .send({ email: SUCCESSFULL_EMAIL })
    .expect(400);
  await request(app)
    .post(API_URL)
    .send({ password: SUCCESSFULL_PASSWORD })
    .expect(400);
  await request(app).post(API_URL).send({}).expect(400);
});

it("disallows duplicate emails", async () => {
    await request(app)
        .post(API_URL)
        .send({
            email: SUCCESSFULL_EMAIL,
            password: SUCCESSFULL_PASSWORD,
        })
        .expect(201);

    await request(app)
        .post(API_URL)
        .send({
            email: SUCCESSFULL_EMAIL,
            password: SUCCESSFULL_PASSWORD,
        })
        .expect(400);
});

it("sets a cookie after successful signup", async () => {
    const response = await request(app)
        .post(API_URL)
        .send({
            email: SUCCESSFULL_EMAIL,
            password: SUCCESSFULL_PASSWORD,
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});
