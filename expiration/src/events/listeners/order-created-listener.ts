import {BaseListener, OrderCreatedEvent, Subjects} from '@phiberorg/common';
import {Message} from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import {expirationQueue} from '../../queues/expiration-queue';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    });

    msg.ack();
  }
}
