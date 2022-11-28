import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();

import { connect } from "node-nats-streaming";

const stan = connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    // const data = {
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // };
    //
    // stan.publish('ticket:created', JSON.stringify(data), () => {
    //     console.log('Event published');
    // });

    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    });
})
