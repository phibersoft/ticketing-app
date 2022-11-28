import request from "supertest";
import { app } from "../../app";

const API_URL = "/api/users/currentuser";
const SUCCESSFULL_EMAIL = "test@test.com";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get(API_URL)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(SUCCESSFULL_EMAIL);
  expect(response.body.currentUser.password).toBeUndefined();
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get(API_URL).send().expect(200);

  expect(response.body.currentUser).toBeNull();
});
