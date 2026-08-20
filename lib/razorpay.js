"use client";

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// Error thrown by openRazorpay so callers can branch on cancel vs failure
// without string-sniffing the message. `code` is one of: "dismissed",
// "failed", "load_error", "config_error".
export class RazorpayError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "RazorpayError";
    this.code = code;
  }
}

// Opens the Razorpay checkout dialog and resolves with the payment payload
// the frontend then forwards to /orders/verify. Rejects with RazorpayError on
// dismiss / provider failure so the caller can route to the right page.
export async function openRazorpay({ orderId, amount, currency = "INR", user, name = "Decor N Art" }) {
  const ok = await loadRazorpayScript();
  if (!ok || !window.Razorpay) {
    throw new RazorpayError("Could not load Razorpay.", "load_error");
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new RazorpayError("Razorpay key is not configured on the frontend.", "config_error");
  }

  return new Promise((resolve, reject) => {
    // Razorpay fires payment.failed BEFORE ondismiss when a transaction
    // errors — track it so ondismiss doesn't overwrite the failure with a
    // generic "dismissed".
    let settled = false;
    const settle = (fn, value) => {
      if (settled) return;
      settled = true;
      fn(value);
    };

    const rzp = new window.Razorpay({
      key: keyId,
      order_id: orderId,
      amount,
      currency,
      name,
      description: "Hand-tied bouquet",
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      handler: (response) => {
        settle(resolve, {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () =>
          settle(reject, new RazorpayError("Payment cancelled.", "dismissed")),
      },
      theme: { color: "#1a1a1a" },
    });
    rzp.on("payment.failed", (resp) => {
      settle(
        reject,
        new RazorpayError(
          resp.error?.description || "Payment failed.",
          "failed"
        )
      );
    });
    rzp.open();
  });
}
