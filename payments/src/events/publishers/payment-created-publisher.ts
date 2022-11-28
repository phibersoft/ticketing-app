import {
  BasePublisher,
  PaymentCreatedEvent,
  Subjects,
} from "@phiberorg/common";

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
