import { BasePublisher, Subjects, TicketUpdatedEvent } from "@phiberorg/common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
