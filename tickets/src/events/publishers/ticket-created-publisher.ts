import { BasePublisher, Subjects, TicketCreatedEvent } from '@phiberorg/common';

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
