import { BasePublisher, OrderCreatedEvent, Subjects } from "@phiberorg/common";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
