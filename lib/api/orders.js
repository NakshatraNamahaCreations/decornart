"use client";

import { api } from "./client";

export function createOrder({ shippingAddress }) {
  return api.post("/orders", { shippingAddress });
}

export function verifyOrder({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  return api.post("/orders/verify", { razorpayOrderId, razorpayPaymentId, razorpaySignature });
}

export function listOrders(query = {}) {
  return api.get("/orders", { query });
}

export function getOrder(id) {
  return api.get(`/orders/${encodeURIComponent(id)}`);
}
