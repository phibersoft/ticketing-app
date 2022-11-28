"use client";

import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShowPage = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>Purchase Order</h1>
      <h4>Time remaining to pay: {timeLeft} seconds</h4>
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={
          "pk_test_51M8qEyF54dfzrIqEYpQzrUejH0C5LTsao3uaG7ggq724HiGnX7Zi4Z0dNOZyNyiEmTB6MH9HcbpR8H2iawHWsd7N00ZRgwiHfy"
        }
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShowPage.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShowPage;
