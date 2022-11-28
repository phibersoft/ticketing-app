import {
  BasePublisher,
  OrderCancelledEvent,
  Subjects,
} from "@phiberorg/common";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
