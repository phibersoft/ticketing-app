import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import request from "supertest";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from 'mongoose';

it("marks an order as cancelled", async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  // Expectation to make sure the thing is cancelled
  const updatedOrder = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(updatedOrder.body.status).toEqual("cancelled");

  // Check that the order:cancelled event was published
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
