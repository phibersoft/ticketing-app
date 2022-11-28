import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";

it("fetches the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Make request to fetch the order
  const anotherUser = global.signin();
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", anotherUser)
    .send()
    .expect(401);
});

it("returns a 404 when trying to fetch an order that does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin();
  await request(app)
    .get(`/api/orders/${ticketId}`)
    .set("Cookie", user)
    .send()
    .expect(404);
});
