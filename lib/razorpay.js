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

// Opens the Razorpay checkout dialog and resolves with the payment payload
// the frontend then forwards to /orders/verify. Rejects on dismiss/error.
export async function openRazorpay({ orderId, amount, currency = "INR", user, name = "Decornart" }) {
  const ok = await loadRazorpayScript();
  if (!ok || !window.Razorpay) throw new Error("Could not load Razorpay.");

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Razorpay key is not configured on the frontend.");

  return new Promise((resolve, reject) => {
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
        resolve({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => reject(new Error("Payment dismissed.")),
      },
      theme: { color: "#1a1a1a" },
    });
    rzp.on("payment.failed", (resp) => {
      reject(new Error(resp.error?.description || "Payment failed."));
    });
    rzp.open();
  });
}
