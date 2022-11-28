import {BasePublisher, ExpirationCompleteEvent, Subjects} from '@phiberorg/common';

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
