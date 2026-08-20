import ResetPasswordView from "@/components/ResetPassword/ResetPasswordView";

export const metadata = {
  title: "Reset your password — Decor N Art",
  description: "Set a new password for your Decor N Art account.",
};

// Lands the shopper from the reset email link. Token comes in via ?token=…
// and is passed down to the client component that handles submission.
export default function ResetPasswordPage({ searchParams }) {
  const token = typeof searchParams?.token === "string" ? searchParams.token : "";
  return <ResetPasswordView token={token} />;
}
